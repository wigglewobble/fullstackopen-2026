import { useState, SyntheticEvent } from "react";
import { TextField, InputLabel, MenuItem, Select, Button, Grid, OutlinedInput, Box, Chip } from '@mui/material';
import { NewEntry, Diagnosis, HealthCheckRating } from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: NewEntry) => void;
  diagnoses: Diagnosis[];
  error?: string;
}

const AddEntryForm = ({ onCancel, onSubmit, diagnoses }: Props) => {
  const [type, setType] = useState<"HealthCheck" | "Hospital" | "OccupationalHealthcare">("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  
  // HealthCheck specific
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);
  
  // Hospital specific
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  
  // OccupationalHealthcare specific
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState("");
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState("");

  const onAddEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    
    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined
    };

    switch (type) {
      case "HealthCheck":
        onSubmit({
          ...baseEntry,
          type,
          healthCheckRating
        });
        break;
      case "Hospital":
        onSubmit({
          ...baseEntry,
          type,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria
          }
        });
        break;
      case "OccupationalHealthcare":
        onSubmit({
          ...baseEntry,
          type,
          employerName,
          sickLeave: sickLeaveStartDate && sickLeaveEndDate ? {
            startDate: sickLeaveStartDate,
            endDate: sickLeaveEndDate
          } : undefined
        });
        break;
    }
  };

  const ratingOptions = [
    { value: HealthCheckRating.Healthy, label: "Healthy" },
    { value: HealthCheckRating.LowRisk, label: "Low Risk" },
    { value: HealthCheckRating.HighRisk, label: "High Risk" },
    { value: HealthCheckRating.CriticalRisk, label: "Critical Risk" }
  ];

  return (
    <form onSubmit={onAddEntry}>
      <InputLabel style={{ marginTop: 20 }}>Entry Type</InputLabel>
      <Select
        fullWidth
        value={type}
        onChange={(e) => setType(e.target.value as "HealthCheck" | "Hospital" | "OccupationalHealthcare")}
        style={{ marginBottom: 15 }}
      >
        <MenuItem value="HealthCheck">Health Check</MenuItem>
        <MenuItem value="Hospital">Hospital</MenuItem>
        <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
      </Select>

      <TextField
        label="Description"
        fullWidth
        value={description}
        onChange={({ target }) => setDescription(target.value)}
        required
        style={{ marginBottom: 15 }}
      />
      
      <TextField
        label="Date"
        type="date"
        fullWidth
        value={date}
        onChange={({ target }) => setDate(target.value)}
        InputLabelProps={{ shrink: true }}
        required
        style={{ marginBottom: 15 }}
      />

      <TextField
        label="Specialist"
        fullWidth
        value={specialist}
        onChange={({ target }) => setSpecialist(target.value)}
        required
        style={{ marginBottom: 15 }}
      />

      <InputLabel id="diagnoses-label">Diagnosis Codes</InputLabel>
      <Select
        labelId="diagnoses-label"
        multiple
        fullWidth
        value={diagnosisCodes}
        onChange={(e) => setDiagnosisCodes(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
        input={<OutlinedInput label="Diagnosis Codes" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        style={{ marginBottom: 20 }}
      >
        {diagnoses.map((d) => (
          <MenuItem key={d.code} value={d.code}>
            {d.code} - {d.name}
          </MenuItem>
        ))}
      </Select>

      {/* Conditionally render fields based on the selected type */}
      {type === "HealthCheck" && (
        <>
          <InputLabel id="health-rating-label">Health Check Rating</InputLabel>
          <Select
            labelId="health-rating-label"
            fullWidth
            value={healthCheckRating}
            onChange={(e) => setHealthCheckRating(Number(e.target.value) as HealthCheckRating)}
            style={{ marginBottom: 20 }}
          >
            {ratingOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </>
      )}

      {type === "Hospital" && (
        <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1, mb: 2 }}>
          <InputLabel style={{ marginBottom: 10 }}>Discharge Information</InputLabel>
          <TextField
            label="Discharge Date"
            type="date"
            fullWidth
            value={dischargeDate}
            onChange={({ target }) => setDischargeDate(target.value)}
            InputLabelProps={{ shrink: true }}
            required
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="Discharge Criteria"
            fullWidth
            value={dischargeCriteria}
            onChange={({ target }) => setDischargeCriteria(target.value)}
            required
          />
        </Box>
      )}

      {type === "OccupationalHealthcare" && (
        <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 1, mb: 2 }}>
          <TextField
            label="Employer Name"
            fullWidth
            value={employerName}
            onChange={({ target }) => setEmployerName(target.value)}
            required
            style={{ marginBottom: 15 }}
          />
          <InputLabel style={{ marginBottom: 10 }}>Sick Leave (Optional)</InputLabel>
          <TextField
            label="Start Date"
            type="date"
            fullWidth
            value={sickLeaveStartDate}
            onChange={({ target }) => setSickLeaveStartDate(target.value)}
            InputLabelProps={{ shrink: true }}
            style={{ marginBottom: 15 }}
          />
          <TextField
            label="End Date"
            type="date"
            fullWidth
            value={sickLeaveEndDate}
            onChange={({ target }) => setSickLeaveEndDate(target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      )}

      <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
        <Grid size="auto">
          <Button
            color="secondary"
            variant="contained"
            type="button"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Grid>
        <Grid size="auto">
          <Button
            type="submit"
            variant="contained"
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddEntryForm;
