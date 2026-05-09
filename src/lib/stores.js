import { writable, derived } from 'svelte/store';
import { BUILTIN_EXERCISES } from './constants.js';
import * as db from './db.js';

export const exerciseLogs = writable([]);
export const painAssessments = writable([]);
export const customExercises = writable([]);
export const toast = writable(null);

export const allExerciseNames = derived(customExercises, ($custom) =>
  [...BUILTIN_EXERCISES, ...$custom].sort((a, b) => a.localeCompare(b))
);

export const lastExerciseLog = derived(exerciseLogs, ($logs) => $logs[0] ?? null);

let toastTimer;
export function showToast(message, type = 'success') {
  clearTimeout(toastTimer);
  toast.set({ message, type, id: Date.now() });
  toastTimer = setTimeout(() => toast.set(null), 2500);
}

export async function logExercise(entry) {
  await db.addLog(entry);
  exerciseLogs.update(logs => [entry, ...logs]);
}

export async function logPain(entry) {
  await db.addPainAssessment(entry);
  painAssessments.update(list => [entry, ...list]);
}

export async function editLog(updated) {
  await db.updateLog(updated);
  exerciseLogs.update(logs => logs.map(l => l.id === updated.id ? updated : l));
}

export async function removeLog(id) {
  await db.deleteLog(id);
  exerciseLogs.update(logs => logs.filter(l => l.id !== id));
}

export async function removePain(id) {
  await db.deletePainAssessment(id);
  painAssessments.update(list => list.filter(a => a.id !== id));
}

export async function addCustomExercise(name) {
  await db.addCustomExercise(name);
  customExercises.update(list => [...list, name].sort());
}

export async function removeCustomExercise(name) {
  await db.deleteCustomExercise(name);
  customExercises.update(list => list.filter(n => n !== name));
}

export async function importLogs(logs, assessments) {
  await db.bulkImportLogs(logs);
  await db.bulkImportPainAssessments(assessments);
  const [updatedLogs, updatedPain] = await Promise.all([db.getLogs(), db.getPainAssessments()]);
  exerciseLogs.set(updatedLogs);
  painAssessments.set(updatedPain);
}
