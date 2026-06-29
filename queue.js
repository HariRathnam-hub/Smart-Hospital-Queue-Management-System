const express = require('express');
const Patient = require('../models/Patient');

const PRIORITY_ORDER = { emergency: 0, urgent: 1, normal: 2 };

module.exports = (io) => {
  const router = express.Router();

  // Get full sorted queue
  router.get('/', async (req, res) => {
    try {
      const patients = await Patient.find({ status: 'waiting' }).sort({
        createdAt: 1,
      });
      patients.sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      );
      res.json(patients);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Call next patient
  router.put('/next', async (req, res) => {
    try {
      const waiting = await Patient.find({ status: 'waiting' }).sort({
        createdAt: 1,
      });
      waiting.sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      );

      if (!waiting.length)
        return res.status(404).json({ message: 'Queue is empty' });

      const next = waiting[0];
      next.status = 'in-progress';
      next.calledAt = new Date();
      await next.save();

      io.emit('queue:update', { type: 'next', patient: next });
      res.json(next);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Complete consultation
  router.put('/:id/complete', async (req, res) => {
    try {
      const patient = await Patient.findByIdAndUpdate(
        req.params.id,
        { status: 'completed', completedAt: new Date(), notes: req.body.notes },
        { new: true }
      );
      if (!patient) return res.status(404).json({ message: 'Patient not found' });
      io.emit('queue:update', { type: 'complete', patientId: patient._id });
      res.json(patient);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Admin stats
  router.get('/stats', async (req, res) => {
    try {
      const [waiting, inProgress, completed] = await Promise.all([
        Patient.countDocuments({ status: 'waiting' }),
        Patient.countDocuments({ status: 'in-progress' }),
        Patient.countDocuments({ status: 'completed' }),
      ]);

      const completedToday = await Patient.find({
        status: 'completed',
        completedAt: { $gte: new Date().setHours(0, 0, 0, 0) },
      });

      const avgWait =
        completedToday.length > 0
          ? Math.round(
              completedToday.reduce((sum, p) => {
                if (!p.calledAt || !p.createdAt) return sum;
                return sum + (p.calledAt - p.createdAt) / 60000;
              }, 0) / completedToday.length
            )
          : 0;

      res.json({ waiting, inProgress, completed, avgWaitMinutes: avgWait });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
