# Skill: JSON Roster → ICS Calendar Export

Convert a shift-roster JSON (with shift definitions + daily assignments) into a
valid RFC 5545 `.ics` file that imports correctly into Apple Calendar, Google
Calendar, Outlook, etc.

---

## Input format

```json
{
  "shifts": [
    {
      "uid": "abc123",
      "name": "早班",
      "start": "07:00",
      "end": "15:00",
      "alarm": 30,
      "color": "#e8834f",
      "desc": ""
    }
  ],
  "roster": {
    "2026-05-08": { "uid": "abc123", "note": "optional note" },
    "2026-05-09": { "uid": "abc123" }
  }
}
```

- `shifts[].alarm` — minutes before start to fire a reminder; `0` = no reminder
- `roster` keys are `YYYY-MM-DD` strings
- `roster[].note` is optional

---

## Critical rules

### 1. Use floating local time — NO trailing Z

```
DTSTART:20260508T070000     ✅ floating — calendar renders in device timezone
DTSTART:20260508T070000Z    ❌ UTC — will be offset by the user's UTC offset
```

- `DTSTART` and `DTEND` must NOT have a `Z` suffix and must NOT use `TZID=`
- The calendar app reads the time as local wall-clock time on the device
- This is the correct approach for shift/work schedules where the user is always
  in the same timezone as the shifts

### 2. DTSTAMP must still be UTC

```
DTSTAMP:20260101T000000Z    ✅ metadata timestamp, always UTC per RFC 5545
```

### 3. Midnight-crossing shifts

If `end <= start` (comparing HH:MM), the shift crosses midnight.
End date = next calendar day.

```js
// m is already 0-indexed (parsed as +slice - 1 earlier)
const tmp = new Date(y, m, d + 1);
const ey = tmp.getFullYear(), em = tmp.getMonth(), ed = tmp.getDate();
```

**Do NOT write** `new Date(y, m - 1, d + 1)` — m is already 0-indexed.

### 4. Alarm trigger mapping

| alarm (minutes) | TRIGGER value |
|-----------------|---------------|
| 0               | skip VALARM entirely |
| 5               | `-PT5M` |
| 10              | `-PT10M` |
| 15              | `-PT15M` |
| 20              | `-PT20M` |
| 30              | `-PT30M` |
| 45              | `-PT45M` |
| 60              | `-PT1H` |
| 90              | `-PT1H30M` |
| 120             | `-PT2H` |

For values not in the table, round down to the nearest key.
Shifts with `alarm = 0` are silently skipped (not exported).

---

## Output skeleton

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YourApp//ZH
BEGIN:VEVENT
UID:{unique-id}@yourdomain
DTSTAMP:{YYYYMMDDTHHmmSS}Z
DTSTART:{YYYYMMDDTHHmmSS}
DTEND:{YYYYMMDDTHHmmSS}
SUMMARY:{shiftName}{-note if present}
BEGIN:VALARM
TRIGGER:-PT30M
ACTION:DISPLAY
DESCRIPTION:{shiftName}{-note if present}
END:VALARM
END:VEVENT
END:VCALENDAR
```

Multiple VEVENTs are concatenated inside one VCALENDAR block.

---

## Reference implementation (JavaScript)

```js
function exportIcs(shifts, roster) {
  const pad = n => n < 10 ? '0' + n : '' + n;

  // Floating local time — no Z
  const fmtLocal = (y, m, d, h, min) =>
    `${y}${pad(m + 1)}${pad(d)}T${pad(h)}${pad(min)}00`;

  // DTSTAMP — UTC with Z
  const fmtUTC = dt =>
    dt.getUTCFullYear() + pad(dt.getUTCMonth() + 1) + pad(dt.getUTCDate()) +
    'T' + pad(dt.getUTCHours()) + pad(dt.getUTCMinutes()) + '00Z';

  const alarmTrigger = min => {
    const map = {
      0:'', 5:'-PT5M', 10:'-PT10M', 15:'-PT15M', 20:'-PT20M',
      30:'-PT30M', 45:'-PT45M', 60:'-PT1H', 90:'-PT1H30M', 120:'-PT2H'
    };
    const keys = Object.keys(map).map(Number).sort((a, b) => a - b);
    let best = 0;
    keys.forEach(k => { if (k <= Number(min)) best = k; });
    return map[best];
  };

  const byUid = u => shifts.find(s => s.uid === u);
  const genUid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

  const ev = [];

  Object.entries(roster).forEach(([k, v]) => {
    if (!v.uid) return;
    const st = byUid(v.uid);
    if (!st || !st.alarm) return; // skip if no alarm

    const y = +k.slice(0, 4), m = +k.slice(5, 7) - 1, d = +k.slice(8, 10);
    const [sh, sm] = st.start.split(':').map(Number);
    const [eh, em] = st.end.split(':').map(Number);

    // Midnight-crossing: end time is on the next day
    let ey = y, em2 = m, ed = d;
    if (eh < sh || (eh === sh && em <= sm)) {
      const tmp = new Date(y, m, d + 1); // m is already 0-indexed
      ey = tmp.getFullYear(); em2 = tmp.getMonth(); ed = tmp.getDate();
    }

    const dtStart = fmtLocal(y, m, d, sh, sm);
    const dtEnd   = fmtLocal(ey, em2, ed, eh, em);
    const tr      = alarmTrigger(st.alarm);
    const note    = v.note ? '-' + v.note : '';

    const alarm = tr
      ? `BEGIN:VALARM\nTRIGGER:${tr}\nACTION:DISPLAY\nDESCRIPTION:${st.name}${note}\nEND:VALARM\n`
      : '';

    ev.push(
      `BEGIN:VEVENT\n` +
      `UID:${genUid()}@workcal\n` +
      `DTSTAMP:${fmtUTC(new Date())}\n` +
      `DTSTART:${dtStart}\n` +
      `DTEND:${dtEnd}\n` +
      `SUMMARY:${st.name}${note}\n` +
      `${alarm}END:VEVENT`
    );
  });

  if (!ev.length) return null; // nothing to export

  return 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//WorkCal//v3//ZH\n' +
         ev.join('\n') + '\nEND:VCALENDAR';
}
```

---

## Common mistakes to avoid

| Mistake | Why it's wrong |
|---------|---------------|
| `DTSTART:...Z` | Treated as UTC; shifts appear hours off in local timezone |
| `DTSTART;TZID=Asia/Shanghai:...` | Requires full VTIMEZONE block in the file |
| `new Date(y, m-1, d+1)` for next day | Double-subtracts month; m is already 0-indexed |
| `Date.UTC(y, m, d, h, min)` for local time | Constructs UTC instant, not local wall time |
| Omitting DTSTAMP | RFC 5545 violation; some clients reject the file |
