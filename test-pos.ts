import { ALL_POS_GROUPS } from './src/data/parts-of-speech-groups';
import { generatePOSExercises } from './src/data/parts-of-speech-exercises';

console.log("Groups loaded:", ALL_POS_GROUPS.length);

for (const group of ALL_POS_GROUPS) {
  if (group.isCheckpoint) continue;
  
  try {
    const round1 = generatePOSExercises(group.id, 'round1');
    console.log(`Group: ${group.id} - Round 1 Exercises: ${round1.length}`);
    if (round1.length === 0) {
      console.error(`ERROR: Round 1 for ${group.id} generated 0 exercises!`);
    }

    const round2 = generatePOSExercises(group.id, 'round2');
    console.log(`Group: ${group.id} - Round 2 Exercises: ${round2.length}`);
    if (round2.length === 0) {
      console.error(`ERROR: Round 2 for ${group.id} generated 0 exercises!`);
    }
  } catch (err: any) {
    console.error(`Error generating exercises for ${group.id}:`, err.message);
  }
}
