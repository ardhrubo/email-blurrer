(() => {
  const ns = window.EmailHiderPopup;

  function findElements() {
    return {
      enabled: document.getElementById("enabled"),
      screenRecordingMode: document.getElementById("screenRecordingMode"),
      revealOnHover: document.getElementById("revealOnHover"),
      mode: document.getElementById("mode"),
      blurPx: document.getElementById("blurPx"),
      blurPxValue: document.getElementById("blurPxValue"),
      hideDisplayName: document.getElementById("hideDisplayName"),
      advancedSettings: document.getElementById("advanced-settings"),
      blurSettings: document.getElementById("blur-settings"),
      recordingIndicator: document.getElementById("recording-indicator"),
    };
  }

  function render(elements, settings) {
    elements.enabled.checked = settings.enabled;
    elements.screenRecordingMode.checked = settings.screenRecordingMode;
    elements.revealOnHover.checked = settings.revealOnHover;
    elements.mode.value = settings.mode;
    elements.blurPx.value = String(settings.blurPx);
    elements.blurPxValue.textContent = String(settings.blurPx);
    elements.hideDisplayName.checked = settings.hideDisplayName;

    updateVisibility(elements, settings);
  }

  function updateVisibility(elements, settings) {
    if (!settings.enabled) {
      elements.advancedSettings.classList.add('disabled');
      elements.screenRecordingMode.disabled = true;
    } else {
      elements.advancedSettings.classList.remove('disabled');
      elements.screenRecordingMode.disabled = false;
    }

    if (settings.screenRecordingMode) {
      elements.advancedSettings.classList.add('disabled');
      elements.recordingIndicator.style.display = 'inline-block';
    } else {
      if (settings.enabled) elements.advancedSettings.classList.remove('disabled');
      elements.recordingIndicator.style.display = 'none';
    }

    if (settings.mode === 'blur') {
      elements.blurSettings.style.display = 'block';
    } else {
      elements.blurSettings.style.display = 'none';
    }
  }

  function bindEvents(elements, handlers) {
    const triggerUpdate = () => {
      const currentSettings = {
        enabled: elements.enabled.checked,
        screenRecordingMode: elements.screenRecordingMode.checked,
        revealOnHover: elements.revealOnHover.checked,
        mode: elements.mode.value,
        blurPx: Number(elements.blurPx.value),
        hideDisplayName: elements.hideDisplayName.checked
      };
      updateVisibility(elements, currentSettings);
      handlers.onChange(currentSettings);
    };

    elements.enabled.addEventListener("change", triggerUpdate);
    elements.screenRecordingMode.addEventListener("change", triggerUpdate);
    elements.revealOnHover.addEventListener("change", triggerUpdate);
    elements.mode.addEventListener("change", triggerUpdate);
    elements.hideDisplayName.addEventListener("change", triggerUpdate);
    
    elements.blurPx.addEventListener("input", () => {
      elements.blurPxValue.textContent = elements.blurPx.value;
    });
    elements.blurPx.addEventListener("change", triggerUpdate);
  }

  ns.ui = {
    findElements,
    render,
    bindEvents,
  };
})();
