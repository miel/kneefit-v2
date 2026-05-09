<script>
  import { BUILTIN_EXERCISES } from '$lib/constants.js';
  import { customExercises } from '$lib/stores.js';
  export let value = '';
</script>

<select bind:value>
  <option value="" disabled>Select exercise</option>
  <optgroup label="Built-in exercises">
    {#each BUILTIN_EXERCISES as ex}
      <option value={ex}>{ex}</option>
    {/each}
  </optgroup>
  {#if $customExercises.length > 0}
    <optgroup label="My exercises">
      {#each $customExercises as ex}
        <option value={ex}>{ex}</option>
      {/each}
    </optgroup>
  {/if}
</select>
