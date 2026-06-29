const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// Register a new patient
router.post('/register', async (req, res) => {
  try {
    const { name, age, symptoms, priority, phone } = req.body;
    const patient = new Patient({ name, age, symptoms, priority, phone });
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
