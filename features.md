# KneeFit — Feature Ideas

## 1. Pain trend chart
A line chart on the History page showing pain levels over time (rest / activity / touch as separate lines). Would make it immediately visible whether recovery is progressing. Chart.js or a lightweight SVG-based approach. Toggle between 7-day, 30-day, and all-time views.

## 2. Exercise progression chart
Per-exercise chart showing weight or reps over time — the core question during rehab: "am I getting stronger?" Select an exercise from a dropdown and see its progression plotted across sessions.

## 3. Session notes / journal entry
A freeform daily note independent of exercise or pain logging. Useful for capturing context ("felt stiff after long walk", "skipped physio appointment") that doesn't fit the structured fields. Stored as a third IndexedDB collection, shown in History.

## 4. Reminders / notifications
Push notifications at user-configured times (e.g. 08:00, 13:00, 20:00) prompting pain logging. The Notification API is available in installed PWAs on iOS 16.4+. Settings page would have a toggle and time pickers per slot.

## 5. Streak tracker
Count consecutive days with at least one exercise session or pain assessment logged. Display a flame icon + streak count on the Home page. Motivates consistent logging during a long rehabilitation period.

## 6. iCloud / Google Drive backup
Export the full IndexedDB dataset as a JSON file to a cloud provider on demand. Protects against data loss when the browser clears storage. Could use the File System Access API or a share-sheet export on iOS.

## 7. Physio report export
Generate a formatted PDF or HTML summary for a given date range: pain trend, exercises performed, progression. Intended to be shared with a physiotherapist or doctor at appointments. Could use the browser's print dialog with a print-specific stylesheet.

## 8. Body-weight / bodyweight mode
Toggle to track exercises without external weight (e.g. bodyweight squats, wall sits). Replace the weight field with a duration or difficulty rating for these movements. Relevant for early-stage rehabilitation where no weights are used.
