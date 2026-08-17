export const calculateBmi = (heightCm: number, weightKg: number): string => {
  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error('Height and weight must be positive numbers.');
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (bmi < 16.0) return 'Underweight (Severe thinness)';
  if (bmi < 17.0) return 'Underweight (Moderate thinness)';
  if (bmi < 18.5) return 'Underweight (Mild thinness)';
  if (bmi < 25.0) return 'Normal range';
  if (bmi < 30.0) return 'Overweight';
  if (bmi < 35.0) return 'Obese (Class I)';
  if (bmi < 40.0) return 'Obese (Class II)';
  return 'Obese (Class III)';
};

// Check if running directly via CLI
if (process.argv[1] && (process.argv[1].endsWith('bmiCalculator.ts') || process.argv[1].endsWith('bmiCalculator.js'))) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Error: Missing height and weight arguments.');
    console.log('Usage: npm run calculateBmi <height_cm> <weight_kg>');
    process.exit(1);
  }
  const height = Number(args[0]);
  const weight = Number(args[1]);

  if (isNaN(height) || isNaN(weight)) {
    console.log('Error: Height and weight must be numbers.');
    process.exit(1);
  }

  try {
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log('Error:', error.message);
    } else {
      console.log('An unknown error occurred.');
    }
    process.exit(1);
  }
}
