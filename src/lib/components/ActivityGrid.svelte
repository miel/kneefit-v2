<script>
  export let logs = [];
  export let mode = 'exercise'; // 'exercise' | 'pain'

  const WEEKS = 16;
  const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  // Always use local date to match how logs are stored
  function localISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function qualToNum(v) {
    return { 'no pain': 1, sensitive: 4, painful: 7, 'sharp pain': 10 }[v] ?? 0;
  }

  $: dataMap = (() => {
    const map = new Map();
    if (mode === 'exercise') {
      for (const log of logs) {
        map.set(log.date, (map.get(log.date) ?? 0) + 1);
      }
    } else {
      const acc = new Map();
      for (const a of logs) {
        const vals = [a.restPain, a.activityPain, a.touchPain].map(v =>
          a.scaleType === 'numeric' ? Number(v) : qualToNum(v)
        );
        const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
        if (!acc.has(a.date)) acc.set(a.date, []);
        acc.get(a.date).push(avg);
      }
      for (const [date, vals] of acc) {
        map.set(date, vals.reduce((s, v) => s + v, 0) / vals.length);
      }
    }
    return map;
  })();

  $: grid = (() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = localISO(today);

    const dow = (today.getDay() + 6) % 7; // Mon = 0
    const thisMonday = new Date(today);
    thisMonday.setDate(today.getDate() - dow);

    const start = new Date(thisMonday);
    start.setDate(thisMonday.getDate() - (WEEKS - 1) * 7);

    const weeks = [];
    const cur = new Date(start);

    for (let w = 0; w < WEEKS; w++) {
      const days = [];
      let monthLabel = null;
      for (let d = 0; d < 7; d++) {
        const iso = localISO(cur);
        if (d === 0 && cur.getDate() <= 7) {
          monthLabel = cur.toLocaleDateString('en', { month: 'short' });
        }
        days.push({
          iso,
          value: dataMap.get(iso) ?? 0,
          future: iso > todayISO,
          isToday: iso === todayISO
        });
        cur.setDate(cur.getDate() + 1);
      }
      weeks.push({ days, monthLabel });
    }
    return weeks;
  })();

  const EXERCISE_SHADES = [
    null,                    // 0
    'rgba(0,212,170,0.15)',  // 1
    'rgba(0,212,170,0.30)',  // 2
    'rgba(0,212,170,0.45)',  // 3
    'rgba(0,212,170,0.60)',  // 4
    'rgba(0,212,170,0.78)',  // 5
    '#00d4aa',               // 6+
  ];

  function cellBg(value, future) {
    if (future || value === 0) return null;
    if (mode === 'exercise') {
      return EXERCISE_SHADES[Math.min(value, 6)];
    } else {
      if (value <= 3) return 'rgba(0,212,170,0.75)';
      if (value <= 6) return '#ffb347';
      return '#ff6b6b';
    }
  }

  function cellTitle(day) {
    if (day.future || day.value === 0) return day.iso;
    if (mode === 'exercise') return `${day.iso} · ${day.value} session${day.value !== 1 ? 's' : ''}`;
    return `${day.iso} · pain ${day.value.toFixed(1)}/10`;
  }

  $: legend = mode === 'exercise'
    ? EXERCISE_SHADES.map((bg, i) => ({ bg, label: i === 6 ? '6+' : String(i) }))
    : [
        { bg: null,                    label: '0' },
        { bg: 'rgba(0,212,170,0.75)',  label: 'Low' },
        { bg: '#ffb347',               label: 'Mid' },
        { bg: '#ff6b6b',               label: 'High' },
      ];
</script>

<div class="wrap">
  <!-- month labels -->
  <div class="month-row">
    <div class="corner"></div>
    {#each grid as week}
      <div class="month-label">{week.monthLabel ?? ''}</div>
    {/each}
  </div>

  <!-- day rows -->
  {#each DAY_LABELS as label, d}
    <div class="day-row">
      <div class="day-label">{label}</div>
      {#each grid as week}
        {@const day = week.days[d]}
        {@const bg = cellBg(day.value, day.future)}
        <div
          class="cell"
          class:today={day.isToday}
          style:background={bg}
          title={cellTitle(day)}
        ></div>
      {/each}
    </div>
  {/each}

  <!-- legend -->
  <div class="legend">
    <span class="legend-label">Less</span>
    {#each legend as item}
      <div class="legend-cell" style:background={item.bg} title={item.label}></div>
    {/each}
    <span class="legend-label">More</span>
  </div>
</div>

<style>
  .wrap {
    margin-bottom: 1.25rem;
    user-select: none;
  }

  .month-row,
  .day-row {
    display: grid;
    grid-template-columns: 1rem repeat(16, 1fr);
    gap: 3px;
  }

  .month-row { margin-bottom: 3px; }
  .day-row   { margin-bottom: 3px; }

  .month-label {
    font-size: 0.55rem;
    color: var(--color-text-muted);
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    line-height: 1;
    align-self: end;
  }

  .day-label {
    font-size: 0.6rem;
    color: var(--color-text-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .cell {
    aspect-ratio: 1;
    border-radius: 3px;
    background: var(--color-surface-2);
    min-width: 0;
  }

  .cell.today {
    box-shadow: inset 0 0 0 2px var(--color-accent-dim);
  }

  .legend {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 3px;
    margin-top: 6px;
  }

  .legend-label {
    font-size: 0.6rem;
    color: var(--color-text-muted);
    margin: 0 2px;
  }

  .legend-cell {
    width: 10px;
    height: 10px;
    border-radius: 2px;
    background: var(--color-surface-2);
    flex-shrink: 0;
  }
</style>
