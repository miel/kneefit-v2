export function exportToCSV(logs, assessments) {
  const header = 'Type,Date,Time Slot,Exercise,Sets,Rest Time,Weight,Reps,Pain at Rest,Pain During Activity,Pain When Touched,Scale Type,Notes';
  const rows = [];

  for (const log of logs) {
    for (const ex of log.exercises) {
      rows.push([
        'Exercise', log.date, log.timeSlot,
        ex.exercise, ex.sets, ex.restTime, ex.weight, ex.reps,
        '', '', '', '', log.notes ?? ''
      ].map(csvCell).join(','));
    }
  }

  for (const a of assessments) {
    rows.push([
      'Pain', a.date, a.timeSlot,
      '', '', '', '', '',
      a.restPain, a.activityPain, a.touchPain, a.scaleType, a.notes ?? ''
    ].map(csvCell).join(','));
  }

  const now = new Date();
  const stamp = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') + '-' +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0');
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kneefit-${stamp}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function csvCell(val) {
  const s = String(val ?? '');
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}

export function parseV1CSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const errors = [];
  const logs = [];
  const assessments = [];
  let idOffset = 0;

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 13) {
      errors.push(`Row ${i + 1}: too few columns`);
      continue;
    }

    const [type, date, timeSlot, exercise, sets, restTime, weight, reps,
      restPain, activityPain, touchPain, scaleType, notes] = cols.map(c => c.trim());

    const syntheticId = Date.now() + idOffset++;

    if (type === 'Exercise') {
      logs.push({
        id: syntheticId,
        date,
        timeSlot,
        exercises: [{
          exercise,
          sets: Number(sets) || 0,
          restTime: Number(restTime) || 0,
          weight: Number(weight) || 0,
          reps: Number(reps) || 0
        }],
        notes: notes || ''
      });
    } else if (type === 'Pain') {
      assessments.push({
        id: syntheticId,
        date,
        timeSlot,
        restPain: scaleType === 'numeric' ? Number(restPain) : restPain,
        activityPain: scaleType === 'numeric' ? Number(activityPain) : activityPain,
        touchPain: scaleType === 'numeric' ? Number(touchPain) : touchPain,
        scaleType,
        notes: notes || ''
      });
    }
  }

  return { logs, assessments, errors };
}

function parseCSVLine(line) {
  const cells = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuote) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') { inQuote = false; }
      else { cur += ch; }
    } else {
      if (ch === '"') { inQuote = true; }
      else if (ch === ',') { cells.push(cur); cur = ''; }
      else { cur += ch; }
    }
  }
  cells.push(cur);
  return cells;
}
