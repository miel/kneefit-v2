export const ssr = false;
export const prerender = false;

import { getLogs, getPainAssessments, getCustomExercises } from '$lib/db.js';
import { exerciseLogs, painAssessments, customExercises } from '$lib/stores.js';

export async function load() {
  const [logs, pains, customs] = await Promise.all([
    getLogs(),
    getPainAssessments(),
    getCustomExercises()
  ]);
  exerciseLogs.set(logs);
  painAssessments.set(pains);
  customExercises.set(customs);
}
