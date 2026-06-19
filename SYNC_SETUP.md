# Google Sheets Sync Setup

The app can sync actual kilometres, notes, done status, and changed planned sessions through a free Google Sheet.

## Create the Sheet

1. Go to [sheets.new](https://sheets.new).
2. Rename it to `Comrades Training Sync`.
3. Go to Extensions -> Apps Script.
4. Delete the starter code and paste the contents of `google-apps-script.js`.
5. Change `CHANGE_THIS_PASSWORD` to your own private sync password.
6. Click Save.

## Deploy the Script

1. In Apps Script, click Deploy -> New deployment.
2. Select type: Web app.
3. Execute as: Me.
4. Who has access: Anyone.
5. Click Deploy and allow the requested permissions.
6. Copy the Web app URL.

## Connect the Calendar

1. Open the calendar app.
2. Go to the Sync tab.
3. Paste the Apps Script URL.
4. Enter the same sync password.
5. Tap Save.

Do the same on your iPhone and desktop. After that, edits on either device will sync through the Google Sheet.

If a device still shows an old app version, open the live link in Safari/Chrome and reinstall the Home Screen or desktop app shortcut.
