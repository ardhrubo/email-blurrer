(() => {
  const ns = window.EmailHiderPopup;

  function findElements() {
    return {
      enabled: document.getElementById("enabled"),
      mode: document.getElementById("mode"),
      blurPx: document.getElementById("blurPx"),
      blurPxValue: document.getElementById("blurPxValue"),
    };
  }

  function render(elements, settings) {
    elements.enabled.checked = settings.enabled;
    elements.mode.value = settings.mode;
    elements.blurPx.value = String(settings.blurPx);
    elements.blurPxValue.textContent = String(settings.blurPx);
  }

  function bindEvents(elements, handlers) {
    elements.enabled.addEventListener("change", () => {
      handlers.onEnabledChange(elements.enabled.checked);
    });

    elements.mode.addEventListener("change", () => {
      handlers.onModeChange(elements.mode.value);
    });

    elements.blurPx.addEventListener("input", () => {
      elements.blurPxValue.textContent = elements.blurPx.value;
    });

    elements.blurPx.addEventListener("change", () => {
      handlers.onBlurChange(Number(elements.blurPx.value));
    });
  }

  ns.ui = {
    findElements,
    render,
    bindEvents,
  };
})();
