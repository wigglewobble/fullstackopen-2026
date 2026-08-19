import patientsData from '../data/patients.ts';
import type { Patient, NonSensitivePatient, NewPatient, Entry } from '../types.ts';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patientsData;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patientsData.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const getPatientById = (id: string): Patient | undefined => {
  return patientsData.find(p => p.id === id);
};

const addPatient = (entry: Omit<NewPatient, 'entries'>): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
    entries: []
  };

  patientsData.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (patient: Patient, entry: Omit<Entry, 'id'>): Entry => {
  const newEntry = {
    id: uuid(),
    ...entry
  } as Entry;

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getNonSensitivePatients,
  getPatientById,
  addPatient,
  addEntry
};

