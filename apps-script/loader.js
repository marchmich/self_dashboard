// Apps Script version: fetch the numbers from the Google Sheet, then draw the page.
(function () {
  const statusEl = document.getElementById("load-status");
  const setStatus = (text, isError) => {
    statusEl.textContent = text;
    statusEl.classList.toggle("error", !!isError);
    statusEl.hidden = !text;
  };

  // Gardens use the built-in data until the sheet has a Gardens tab.
  renderGardens(GARDENS, GARDENERS);

  setStatus("Loading data from the Google Sheet…");
  google.script.run
    .withSuccessHandler((data) => {
      setStatus("");
      renderAgriculture(data.vegetables || []);
      if (data.gardens) renderGardens(data.gardens, data.gardeners || {});
    })
    .withFailureHandler((err) => {
      setStatus(`Could not load the data: ${(err && err.message) || err}`, true);
    })
    .getDashboardData();
})();
