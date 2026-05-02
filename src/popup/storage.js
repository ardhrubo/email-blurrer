(() => {
  const ns = (window.EmailHiderPopup = window.EmailHiderPopup || {});

  ns.defaults = {
    enabled: true,
    mode: "blur",
    blurPx: 6,
    revealOnHover: false,
    screenRecordingMode: false,
    hideDisplayName: false,
  };

  ns.storage = {
    getSettings(callback) {
      chrome.storage.sync.get(ns.defaults, callback);
    },
    saveSettings(nextSettings) {
      chrome.storage.sync.set(nextSettings);
    },
  };
})();
