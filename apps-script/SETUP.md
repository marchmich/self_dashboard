# Farm Dashboard on Google Apps Script

This version of the dashboard reads its numbers from a **private Google Sheet**.
You share a link to the dashboard; nobody gets access to the sheet itself, and
only the columns the dashboard shows are ever sent to the page.

You need two files from this folder: **`Code.gs`** and **`Index.html`**.

## 1. Create the Google Sheet

1. In Google Drive, click **New → File upload** and pick `Farm-Dashboard-Sheet.xlsx`
   (the starter sheet with all the gardens, gardeners and vegetables).
2. Open it and choose **File → Save as Google Sheets**. Use that Google Sheets copy
   from now on; you can delete the uploaded `.xlsx`.

Keep the sheet **private** (don't use "Publish to web", and only share it with
people who should edit the numbers).

## 2. Add the dashboard to the sheet

1. In the Google Sheet, open **Extensions → Apps Script**.
2. In the file `Code.gs`, delete what's there and paste the full contents of
   `apps-script/Code.gs`.
3. Click **＋ (Add a file) → HTML**, name it **`Index`** (exactly; Apps Script
   adds `.html` itself), delete what's there, and paste the full contents of
   `apps-script/Index.html`.
4. Click **Save** (the disk icon).

## 3. Publish the dashboard

1. Click **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** *Me*
   - **Who has access:** pick who may open the dashboard:
     - *Anyone within [your organisation]* — only people signed in with your
       organisation's Google accounts (Google Workspace only). Best for internal use.
     - *Anyone* — anyone who has the link, no sign-in.
     - *Only myself* — for testing.
4. Click **Deploy**. Google asks you to authorise the script to read your sheet:
   click **Authorise access**, pick your account and allow it. (If you see
   "Google hasn't verified this app", click **Advanced → Go to … (unsafe)**: it's
   your own script.)
5. Copy the **Web app URL** (`https://script.google.com/macros/s/…/exec`).
   That's the link you share.

## Updating the numbers

Just edit the Google Sheet. Anyone who opens or refreshes the dashboard sees
the new numbers right away.

Sheet rules:

- Keep the tab names: **Gardens**, **Plots**, **Gardeners**, **Vegetables**.
- Keep the column titles in the first row. Capitals, accents and units in
  brackets don't matter (`Width (m)` and `width` both work).
- A garden name in Plots or Gardeners must match a name in the Gardens tab;
  rows that don't match are skipped.
- Leave a gardener's stats empty and the dashboard shows "—".
- In Vegetables, the **Icon** column has a dropdown of the drawings the
  dashboard knows. An unknown name shows a leaf.
- You can add your own extra columns or tabs (notes, phone numbers…). They are
  never sent to the dashboard.

## Updating the design

The design lives in the main files of this repository (`index.html`,
`styles.css` and the `.js` files). After a design change:

1. Rebuild the Apps Script file: `python3 tools/build_apps_script.py`
   (this rewrites `apps-script/Index.html`).
2. In Apps Script, replace the contents of `Index` (and `Code.gs` if it changed)
   and click **Save**.
3. Click **Deploy → Manage deployments**, click the pencil, set **Version** to
   *New version*, and click **Deploy**.

Use **Manage deployments**, not "New deployment": that keeps the same link.
