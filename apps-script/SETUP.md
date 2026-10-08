# Farm Dashboard on Google Apps Script

This version of the dashboard reads its harvest numbers from your **private
Google Sheet**. You share a link to the dashboard; nobody gets access to the
sheet itself, and only the harvest columns are ever sent to the page.

You need two files from this folder: **`Code.gs`** and **`Index.html`**.

## 1. Keep the sheet private

In the Google Sheet, click **Share** and check that **General access** is
**Restricted** (only the people listed can open it). Do **not** use
File → Share → *Publish to web*.

## 2. Find the sheet's ID

Copy it from the sheet's address: it's the long code between `/d/` and `/edit`.

    https://docs.google.com/spreadsheets/d/1AbC...xYz/edit
                                           ^^^^^^^^^ this part

## 3. Put the code in Apps Script

1. Open your Apps Script project.
2. In **`Code.gs`**: select all, delete, paste the new `apps-script/Code.gs`.
   At the top, paste your sheet's ID between the quotes:
   `const SHEET_ID = '1AbC...xYz';`
   If the harvest table isn't the **first tab** of the sheet, also type its tab
   name: `const HARVEST_TAB = 'Agriculture';`
3. In **`Index`**: select all, delete, paste the new `apps-script/Index.html`.
4. Click **Save**.

## 4. Test it

At the top of the editor, choose **getDashboardData** in the function list and
click **Run**. The first time, Google asks you to authorise the script to read
your sheet (see "Authorising" below). The **Execution log** should end with
"Execution completed" and no red error.

## 5. Choose who can see the dashboard and publish

Click **Deploy → Manage deployments**, click the **pencil**, set **Version** to
**New version**, choose the access settings below, and click **Deploy**.
(First time ever? Use **Deploy → New deployment → Web app** instead.)

Pick one of these:

| You want… | Execute as | Who has access | Notes |
|---|---|---|---|
| Only people in your organisation (Google Workspace) | Me | Anyone within *your organisation* | Best for internal use. The sheet stays private. |
| Anyone you give the link to, no sign-in | Me | Anyone | The sheet stays private, but anyone holding the link sees the dashboard's numbers. The link can't be guessed. |
| Only specific people (personal Gmail) | User accessing the web app | Anyone with Google account | Share the sheet as **Viewer** with exactly those people. Everyone else gets an error. Those people could also open the sheet read-only, and each must authorise the script once. |

The link stays the same when you publish a new version.

**Check what others see:** open the dashboard link in a private/incognito
window.

## Authorising

Google shows "Google hasn't verified this app" for personal scripts. Click
**Advanced → Go to … (unsafe)**, then **Allow**. "Unsafe" only means Google
hasn't reviewed it; it's your own script, and it only reads the sheet.

## Updating the numbers

Edit the Google Sheet. Anyone who opens or refreshes the dashboard sees the new
numbers right away.

- Keep the column titles in the first row (`Product`, `Type`,
  `Total Weight (KG)`, …). Capitals, accents and line breaks don't matter.
- Add a product by adding a row. Known names get their drawing (Amaranthe,
  Arachide, Aubergine, Bananier, Carotte, Choux, Concombre, Dossi, Gombo,
  Laitue, Oignon, Oranger, Papayer, Piment, Poivron, Pomme de terre, Tomate);
  others show a leaf.
- Extra columns or tabs are never sent to the dashboard.

## Gardens (later)

The Gardens section uses the dashboard's built-in data until the sheet has tabs
named **Gardens**, **Plots** and **Gardeners**; then it reads them instead.
Ask Claude for the column layout when you're ready.

## Updating the design

After a design change, run `python3 tools/build_apps_script.py`, paste the new
`apps-script/Index.html` into `Index`, and publish a new version (step 5).
