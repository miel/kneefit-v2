<script>
  import { QUALITATIVE_OPTIONS } from '$lib/constants.js';
  export let scaleType = 'numeric';
  export let restPain = 5;
  export let activityPain = 5;
  export let touchPain = 5;
</script>

<div class="scale-toggle">
  <button class:active={scaleType === 'numeric'} on:click={() => scaleType = 'numeric'} type="button">
    Numeric
  </button>
  <button class:active={scaleType === 'qualitative'} on:click={() => scaleType = 'qualitative'} type="button">
    Qualitative
  </button>
</div>

{#if scaleType === 'numeric'}
  <div class="pain-inputs">
    <div class="pain-row">
      <label for="pain-rest">At rest</label>
      <div class="slider-wrap">
        <span class="slider-val">{restPain}</span>
        <input id="pain-rest" type="range" min="1" max="10" bind:value={restPain} />
      </div>
    </div>
    <div class="pain-row">
      <label for="pain-activity">During activity</label>
      <div class="slider-wrap">
        <span class="slider-val">{activityPain}</span>
        <input id="pain-activity" type="range" min="1" max="10" bind:value={activityPain} />
      </div>
    </div>
    <div class="pain-row">
      <label for="pain-touch">When touched</label>
      <div class="slider-wrap">
        <span class="slider-val">{touchPain}</span>
        <input id="pain-touch" type="range" min="1" max="10" bind:value={touchPain} />
      </div>
    </div>
  </div>
{:else}
  <div class="pain-inputs">
    <div class="pain-row">
      <label for="pain-rest-q">At rest</label>
      <select id="pain-rest-q" bind:value={restPain}>
        {#each QUALITATIVE_OPTIONS as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
    <div class="pain-row">
      <label for="pain-activity-q">During activity</label>
      <select id="pain-activity-q" bind:value={activityPain}>
        {#each QUALITATIVE_OPTIONS as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
    <div class="pain-row">
      <label for="pain-touch-q">When touched</label>
      <select id="pain-touch-q" bind:value={touchPain}>
        {#each QUALITATIVE_OPTIONS as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>
  </div>
{/if}

<style>
  .scale-toggle {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .scale-toggle button {
    flex: 1;
    padding: 0.6rem;
    border-radius: var(--radius-sm);
    background: var(--color-surface-2);
    color: var(--color-text-muted);
    font-weight: 600;
    font-size: 0.875rem;
    transition: background 0.15s, color 0.15s;
  }

  .scale-toggle button.active {
    background: var(--color-accent);
    color: #0d1b2a;
  }

  .pain-inputs {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .pain-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .pain-row label {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    font-weight: 500;
  }

  .slider-wrap {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .slider-val {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-accent);
    min-width: 2rem;
    text-align: center;
  }

  input[type="range"] {
    flex: 1;
    -webkit-appearance: none;
    height: 6px;
    border-radius: 3px;
    background: var(--color-surface-2);
    outline: none;
    padding: 0;
    border: none;
  }

  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--color-accent);
    cursor: pointer;
  }
</style>
