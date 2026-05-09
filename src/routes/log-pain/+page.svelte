<script>
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import PainScaleInput from '$lib/components/PainScaleInput.svelte';
  import { logPain, showToast } from '$lib/stores.js';
  import { todayISO, autoTimeSlot } from '$lib/utils.js';
  import { TIME_SLOTS } from '$lib/constants.js';

  let date = todayISO();
  let timeSlot = autoTimeSlot();
  let scaleType = 'numeric';
  let restPain = 5;
  let activityPain = 5;
  let touchPain = 5;
  let notes = '';
  let submitting = false;

  async function handleSubmit(e) {
    e.preventDefault();
    submitting = true;
    const assessment = {
      id: Date.now(),
      date,
      timeSlot,
      restPain,
      activityPain,
      touchPain,
      scaleType,
      notes
    };
    await logPain(assessment);
    showToast('Pain logged');
    goto(`${base}/history`);
  }
</script>

<div class="page">
  <h1>Log Pain</h1>

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

    <fieldset class="field pain-fieldset">
      <legend class="field-legend">Pain Scale</legend>
      <PainScaleInput
        bind:scaleType
        bind:restPain
        bind:activityPain
        bind:touchPain
      />
    </fieldset>

    <div class="field">
      <label for="notes">Notes</label>
      <textarea id="notes" bind:value={notes} rows="2" placeholder="Optional notes…"></textarea>
    </div>

    <button type="submit" class="submit-btn" disabled={submitting}>
      {submitting ? 'Saving…' : 'Save Assessment'}
    </button>
  </form>
</div>

<style>
  .page { padding-top: 0.5rem; }
  h1 { margin-bottom: 1.5rem; }

  form { display: flex; flex-direction: column; gap: 1rem; }

  .field { display: flex; flex-direction: column; gap: 0.4rem; }

  .field label {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
  }

  .submit-btn {
    margin-top: 0.5rem;
    padding: 1rem;
    border-radius: var(--radius);
    background: var(--color-accent);
    color: #0d1b2a;
    font-weight: 700;
    font-size: 1rem;
  }

  .submit-btn:disabled { opacity: 0.6; }

  .pain-fieldset {
    border: none;
    padding: 0;
  }

  .field-legend {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
    margin-bottom: 0.4rem;
  }
</style>
