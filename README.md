# Roster / 班表管理

A client-side shift work roster editor. No server, no account — everything runs in your browser.

## Features

### 🎨 Painter-style shift assignment
Shifts are managed like a paint palette. Define your shift types first, select one as the active "brush", then click or drag across calendar dates to apply it. An eraser tool lets you remove shifts just as easily. Right-click any painted date to reassign it to a different shift without clearing it first.

### 📅 Year and month views
Switch between a full-year overview (12 mini calendars at once) and a detailed single-month view. Click any month header in the year view to zoom in. Month-tab buttons along the top let you jump directly to any month.

### 🗂️ Shift type management
Add custom shift types with a name, start/end time, reminder offset, display colour, and optional note. Eight built-in presets (Morning, Midday, Evening, Night, Day Off, Leave, Training, Comp) are available as one-click templates when creating a new type.

### ✏️ Multi-date selection
With a shift brush active, click or drag to paint multiple dates in one gesture. Without a brush active, clicking dates adds them to a selection set. The selection bar lets you apply a shift, clear shifts, add a shared note, or deselect all in bulk.

### 💾 Local storage persistence
All roster data and shift definitions are saved automatically to browser localStorage and restored on next visit. No data leaves your device.

### 📤 JSON export / import
Export the full roster (shift definitions + every assigned date) as a structured JSON file. The export includes human-readable fields (`shiftName`, `shiftStart`, `shiftEnd`, `shiftColor`) alongside the raw data for easy inspection. Import merges incoming data: existing shift UIDs keep their local definitions (colour, name, times unchanged); only genuinely new shift types are added. Supports `rgb(...)` colours from third-party exports via automatic hex conversion.

### 📅 ICS export / import
Export scheduled shifts as an `.ics` calendar file compatible with Apple Calendar, Google Calendar, Outlook, and any RFC 5545-compliant app. Times are written as floating local time (no UTC offset) so events always appear at the correct local hour regardless of timezone. Reminder alerts are included for each shift. ICS import reads `DTSTART` and `SUMMARY` fields and matches them to existing shift types by name.

### 🌍 Nine interface languages
The UI auto-detects your browser language on first load and switches accordingly. You can change it at any time via the settings panel. Supported languages: 中文, English, Deutsch, 日本語, 한국어, Français, Italiano, Русский, ภาษาไทย. Preset shift names are also localised for each language.

### 🌙 Light / Dark / Auto theme
Three theme modes: Dark, Light, and Auto (follows your OS preference). The setting persists across sessions. The theme button shows the current mode label in whichever language is active.

### 🔤 Adjustable calendar font size
A slider in the settings panel scales all calendar cell text from 70% to 200%. The chosen size is saved to localStorage.

### ⚙️ Settings panel
Theme, language, and font size are grouped in a collapsible settings panel (⚙️ button, top-right). It is closed by default and can be dismissed by clicking anywhere outside it.

### 📱 Responsive layout
The shift palette collapses to a slide-in drawer on narrow screens. The calendar grid adapts to available width. Pointer Events API unifies mouse and touch input, including drag-painting across cells.

## Usage

Clone the repository and open `index.html` in any modern browser — no build step, no dependencies, no internet required after the page loads.

```bash
git clone https://github.com/leoncoolmoon/workCalender.git
cd workCalender
open index.html   # or just double-click the file
```

You can also drag and drop a `.json` or `.ics` file anywhere onto the page to import it.

## Data storage

Roster data is stored in `localStorage` under the keys `wc3_shifts` and `wc3_roster`. Clearing your browser's site data will erase it. Use the JSON export regularly as a backup, especially before switching browsers or devices.

## License

MIT License
