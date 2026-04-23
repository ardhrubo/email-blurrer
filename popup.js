(() => {
  const ns = window.EmailHiderPopup;
  const elements = ns.ui.findElements();

  ns.storage.getSettings((settings) => {
    ns.ui.render(elements, settings);
  });

  ns.ui.bindEvents(elements, {
    onEnabledChange(enabled) {
      ns.storage.saveSettings({ enabled });
    },
    onModeChange(mode) {
      ns.storage.saveSettings({ mode });
    },
    onBlurChange(blurPx) {
      ns.storage.saveSettings({ blurPx });
    },
  });
})();
