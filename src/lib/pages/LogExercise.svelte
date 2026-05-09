<script>
  import ExerciseSelect from '$lib/components/ExerciseSelect.svelte';
  import { lastExerciseLog, logExercise, showToast } from '$lib/stores.js';
  import { navigate } from '$lib/navigation.js';
  import { todayISO, autoTimeSlot } from '$lib/utils.js';
  import { TIME_SLOTS } from '$lib/constants.js';

  let date = todayISO();
  let timeSlot = autoTimeSlot();
  let exercise = $lastExerciseLog?.exercises[0]?.exercise ?? '';
  let sets = $lastExerciseLog?.exercises[0]?.sets ?? 3;
  let restTime = $lastExerciseLog?.exercises[0]?.restTime ?? 60;
  let weight = $lastExerciseLog?.exercises[0]?.weight ?? 0;
  let reps = $lastExerciseLog?.exercises[0]?.reps ?? 10;
  let notes = '';
  let submitting = false;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!exercise) { showToast('Select an exercise', 'error'); return; }
    submitting = true;
    const log = {
      id: Date.now(),
      date,
      timeSlot,
      exercises: [{ exercise, sets: Number(sets), restTime: Number(restTime), weight: Number(weight), reps: Number(reps) }],
      notes
    };
    await logExercise(log);
    showToast('Session logged');
    navigate('history');
  }
</script>

<div class="page">
  <h1>Log Exercise</h1>

  <form on:submit={handleSubmit}>
    <div class="field">
      <label for="date">Date</label>
      <input id="date" type="date" bind:value={date} required />
    </div>

    <div class="field">
      <label for="timeslot">Time</label>
      <select id="timeslot" bind:value={timeSlot}>
        {#each TIME_SLOTS as ts}
          <option value={ts.value}>{ts.label}</option>
        {/each}
      </select>
    </div>

    <div class="field">
      <label for="exercise">Exercise</label>
      <ExerciseSelect bind:value={exercise} />
    </div>

    <div class="field-row">
      <div class="field">
        <label for="sets">Sets</label>
        <input id="sets" type="number" bind:value={sets} min="1" required />
      </div>
      <div class="field">
        <label for="reps">Reps</label>
        <input id="reps" type="number" bind:value={reps} min="1" required />
      </div>
    </div>

    <div class="field-row">
      <div class="field">
        <label for="weight">Weight (kg)</label>
        <input id="weight" type="number" bind:value={weight} min="0" step="0.5" required />
      </div>
      <div class="field">
        <label for="rest">Rest (sec)</label>
        <input id="rest" type="number" bind:value={restTime} min="0" required />
      </div>
    </div>

    <div class="field">
      <label for="notes">Notes</label>
      <textarea id="notes" bind:value={notes} rows="2" placeholder="Optional notes…"></textarea>
    </div>

    <button type="submit" class="submit-btn" disabled={submitting}>
      {submitting ? 'Saving…' : 'Save Session'}
    </button>
  </form>
</div>

<style>
  .page { padding-top: 0.5rem; }
  h1 { margin-bottom: 1.5rem; }
  form { display: flex; flex-direction: column; gap: 1rem; }
  .field { display: flex; flex-direction: column; gap: 0.4rem; }
  .field label { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  .submit-btn { margin-top: 0.5rem; padding: 1rem; border-radius: var(--radius); background: var(--color-accent); color: #0d1b2a; font-weight: 700; font-size: 1rem; letter-spacing: 0.02em; }
  .submit-btn:disabled { opacity: 0.6; }
</style>
