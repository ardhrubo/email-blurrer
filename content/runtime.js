(() => {
  const ns = window.EmailHider;
  const constants = ns.constants;

  let settings = { ...constants.DEFAULT_SETTINGS };
  let observer = null;
  let scanQueued = false;
  let ready = false;
  let initialized = false;

  function applyBlurAmount() {
    document.documentElement.style.setProperty("--email-hider-blur", `${settings.blurPx}px`);

    if (document.body) {
      document.body.classList.toggle(constants.NO_HOVER_CLASS, !settings.revealOnHover);
      document.body.classList.toggle(constants.SAFE_MODE_CLASS, settings.screenRecordingMode);
    }
  }

  function isInterestingNode(node) {
    return node && (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE);
  }

  function runFullScan() {
    ns.masking.unwrapAll();
    ns.masking.scan(document.body, settings);
  }

  function scheduleScan() {
    if (scanQueued || !ready || !settings.enabled) {
      return;
    }

    scanQueued = true;
    queueMicrotask(() => {
      scanQueued = false;
      ns.masking.scan(document.body, settings);
    });
  }

  function startObserver() {
    if (observer) {
      return;
    }

    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes') {
          if (constants.ATTRIBUTES_TO_MASK.includes(mutation.attributeName)) {
            scheduleScan();
            return;
          }
        } else if (mutation.type === 'characterData') {
          scheduleScan();
          return;
        } else {
          for (const node of mutation.addedNodes) {
            if (isInterestingNode(node)) {
              scheduleScan();
              return;
            }
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: constants.ATTRIBUTES_TO_MASK,
    });
  }

  function stopObserver() {
    if (!observer) {
      return;
    }

    observer.disconnect();
    observer = null;
  }

  function applySettings(nextSettings) {
    settings = {
      ...settings,
      ...nextSettings,
    };

    applyBlurAmount();

    if (!settings.enabled) {
      stopObserver();
      ns.masking.unwrapAll();
      return;
    }

    startObserver();
    runFullScan();
  }

  function loadSettings() {
    chrome.storage.sync.get(constants.DEFAULT_SETTINGS, (stored) => {
      applySettings(stored);
      ready = true;
    });
  }

  function onStorageChanged(changes, areaName) {
    if (areaName !== "sync") {
      return;
    }

    const nextSettings = {};
    for (const [key, value] of Object.entries(changes)) {
      nextSettings[key] = value.newValue;
    }

    applySettings(nextSettings);
  }

  function init() {
    if (initialized) {
      return;
    }

    initialized = true;
    chrome.storage.onChanged.addListener(onStorageChanged);

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", loadSettings, { once: true });
      return;
    }

    loadSettings();
  }

  ns.runtime = {
    init,
  };
})();
