import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import axios from "axios";

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import WorkIcon from '@mui/icons-material/Work';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { Patient, Diagnosis, Entry, NewEntry } from "../../types";
import patientService from "../../services/patients";
import AddEntryModal from "../AddEntryModal";

interface Props {
  diagnoses: Diagnosis[];
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const EntryDetails = ({ entry }: { entry: Entry }) => {
  const cardStyle = { marginBottom: "1em", border: "1px solid #ccc" };

  switch (entry.type) {
    case "Hospital":
      return (
        <Card style={cardStyle}>
          <CardContent>
            <Typography variant="body1">
              {entry.date} <LocalHospitalIcon />
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ fontStyle: "italic" }}>
              {entry.description}
            </Typography>
            {entry.discharge && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Discharge:</strong> {entry.discharge.date} — {entry.discharge.criteria}
              </Typography>
            )}
            <Typography variant="body2" sx={{ mt: 1 }}>
              diagnose by {entry.specialist}
            </Typography>
          </CardContent>
        </Card>
      );
    case "OccupationalHealthcare":
      return (
        <Card style={cardStyle}>
          <CardContent>
            <Typography variant="body1">
              {entry.date} <WorkIcon /> <strong>{entry.employerName}</strong>
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ fontStyle: "italic" }}>
              {entry.description}
            </Typography>
            {entry.sickLeave && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <strong>Sick Leave:</strong> {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
              </Typography>
            )}
            <Typography variant="body2" sx={{ mt: 1 }}>
              diagnose by {entry.specialist}
            </Typography>
          </CardContent>
        </Card>
      );
    case "HealthCheck":
      const ratingColors = ["green", "yellow", "orange", "red"];
      const ratingColor = ratingColors[entry.healthCheckRating] || "grey";
      return (
        <Card style={cardStyle}>
          <CardContent>
            <Typography variant="body1">
              {entry.date} <FavoriteIcon style={{ color: ratingColor }} />
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{ fontStyle: "italic" }}>
              {entry.description}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              diagnose by {entry.specialist}
            </Typography>
          </CardContent>
        </Card>
      );
    default:
      return assertNever(entry);
  }
};

const PatientDetailPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (id) {
      const fetchPatient = async () => {
        try {
          const patientData = await patientService.getById(id);
          setPatient(patientData);
        } catch (e: unknown) {
          console.error("Error fetching patient details:", e);
        }
      };
      void fetchPatient();
    }
  }, [id]);

  const openModal = (): void => setModalOpen(true);
  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const getDiagnosisName = (code: string): string => {
    const diagnosis = diagnoses.find(d => d.code === code);
    return diagnosis ? diagnosis.name : "";
  };

  if (!patient) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case "male":
        return <MaleIcon />;
      case "female":
        return <FemaleIcon />;
      default:
        return <TransgenderIcon />;
    }
  };

  const submitNewEntry = async (values: NewEntry) => {
    if (!id) return;
    try {
      const addedEntry = await patientService.createEntry(id, values);
      setPatient({
        ...patient,
        entries: patient.entries.concat(addedEntry)
      });
      setModalOpen(false);
      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "object" && "error" in e.response.data) {
          const errorMsg = (e.response.data as { error: unknown }).error;
          if (Array.isArray(errorMsg)) {
            const message = errorMsg.map((issue: unknown) => {
              if (issue && typeof issue === 'object' && 'message' in issue) {
                return String(issue.message);
              }
              return 'Unknown validation issue';
            }).join(", ");
            setError(message);
          } else {
            setError(String(errorMsg));
          }
        } else if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography variant="h4">{patient.name}</Typography>
        {getGenderIcon(patient.gender)}
      </Box>

      <Typography variant="body1">ssh: {patient.ssn}</Typography>
      <Typography variant="body1">occupation: {patient.occupation}</Typography>
      {patient.dateOfBirth && <Typography variant="body1">date of birth: {patient.dateOfBirth}</Typography>}

      <Box sx={{ mt: 3, mb: 2 }}>
        <Button variant="contained" color="primary" onClick={openModal}>
          Add New Entry
        </Button>
      </Box>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        entries
      </Typography>

      {patient.entries.length === 0 ? (
        <Typography variant="body2">No entries yet</Typography>
      ) : (
        patient.entries.map((entry) => (
          <Box key={entry.id} sx={{ mb: 2 }}>
            <EntryDetails entry={entry} />
            {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
              <Box sx={{ ml: 2, mb: 2 }}>
                <Typography variant="body2" style={{ fontWeight: "bold" }}>Diagnoses:</Typography>
                <ul>
                  {entry.diagnosisCodes.map((code) => (
                    <li key={code}>
                      <Typography variant="body2">
                        {code} {getDiagnosisName(code)}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Box>
        ))
      )}

      <AddEntryModal
        modalOpen={modalOpen}
        onClose={closeModal}
        onSubmit={submitNewEntry}
        error={error}
        diagnoses={diagnoses}
      />
    </Box>
  );
};

export default PatientDetailPage;
