import express from 'express';
import { calculateBmi } from './bmiCalculator.js';
import { calculateExercises } from './exerciseCalculator.js';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const heightStr = req.query.height;
  const weightStr = req.query.weight;

  if (!heightStr || !weightStr) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const height = Number(heightStr);
  const weight = Number(weightStr);

  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  try {
    const bmiResult = calculateBmi(height, weight);
    return res.json({
      weight,
      height,
      bmi: bmiResult
    });
  } catch {
    return res.status(400).json({ error: 'malformatted parameters' });
  }
});

app.post('/exercises', (req, res) => {
  const body = req.body as { daily_exercises?: unknown; target?: unknown };
  const dailyExercises = body.daily_exercises;
  const target = body.target;

  if (dailyExercises === undefined || target === undefined) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  if (!Array.isArray(dailyExercises) || isNaN(Number(target))) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const dailyExercisesNums: number[] = [];
  for (const day of dailyExercises) {
    const val = Number(day);
    if (isNaN(val)) {
      return res.status(400).json({ error: 'malformatted parameters' });
    }
    dailyExercisesNums.push(val);
  }

  const result = calculateExercises(dailyExercisesNums, Number(target));
  return res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
