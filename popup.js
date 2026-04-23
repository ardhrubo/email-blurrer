(() => {
  const ns = window.EmailHiderPopup;
  const elements = ns.ui.findElements();

  ns.storage.getSettings((settings) => {
    ns.ui.render(elements, settings);
  });

  ns.ui.bindEvents(elements, {
    onChange(newSettings) {
      ns.storage.saveSettings(newSettings);
    }
  });
})();
