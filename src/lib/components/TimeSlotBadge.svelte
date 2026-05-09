<script>
  export let slot;
</script>

<span class="badge {slot}">{slot}</span>

<style>
  .badge {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 0.2rem 0.6rem;
    border-radius: 2rem;
  }

  .morning  { background: rgba(255,179,71,0.2);  color: var(--color-morning);   }
  .afternoon{ background: rgba(79,195,247,0.2);  color: var(--color-afternoon); }
  .evening  { background: rgba(149,117,205,0.2); color: var(--color-evening);   }
</style>
