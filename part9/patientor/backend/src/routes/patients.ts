import express from 'express';
import patientService from '../services/patientService.ts';
import { NewPatientSchema, NewEntrySchema } from '../utils.ts';
import { z } from 'zod';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const patient = patientService.getPatientById(req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).send({ error: 'Patient not found' });
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient = NewPatientSchema.parse(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'Unknown error occurred' });
    }
  }
});

router.post('/:id/entries', (req, res) => {
  const patient = patientService.getPatientById(req.params.id);
  if (!patient) {
    res.status(404).send({ error: 'Patient not found' });
    return;
  }

  try {
    const newEntry = NewEntrySchema.parse(req.body);
    const addedEntry = patientService.addEntry(patient, newEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'Unknown error occurred' });
    }
  }
});

export default router;

