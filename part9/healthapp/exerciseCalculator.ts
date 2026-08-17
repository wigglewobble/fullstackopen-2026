export interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (dailyExercises: number[], target: number): ExerciseResult => {
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter(d => d > 0).length;
  const average = dailyExercises.reduce((sum, d) => sum + d, 0) / periodLength || 0;
  const success = average >= target;

  let rating = 1;
  let ratingDescription = 'too far off from the target';

  if (average >= target) {
    rating = 3;
    ratingDescription = 'great job, target met!';
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

// Check if running directly via CLI
if (process.argv[1] && (process.argv[1].endsWith('exerciseCalculator.ts') || process.argv[1].endsWith('exerciseCalculator.js'))) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Error: Missing target and daily exercise arguments.');
    console.log('Usage: npm run calculateExercises <target> <exercise_day_1> <exercise_day_2> ...');
    process.exit(1);
  }

  const target = Number(args[0]);
  const dailyExercises = args.slice(1).map(Number);

  if (isNaN(target) || dailyExercises.some(isNaN)) {
    console.log('Error: Target and daily exercises must be numbers.');
    process.exit(1);
  }

  console.log(calculateExercises(dailyExercises, target));
}
