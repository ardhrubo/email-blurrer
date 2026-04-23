(() => {
  const ns = (window.EmailHider = window.EmailHider || {});

  ns.constants = {
    DEFAULT_SETTINGS: {
      enabled: true,
      mode: "blur",
      blurPx: 6,
    },
    EMAIL_PATTERN: "\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b",
    EMAIL_FLAGS: "gi",
    EMAIL_WRAPPER_CLASS: "email-hider-email",
    BLUR_CLASS: "email-hider-mode-blur",
    HIDE_CLASS: "email-hider-mode-hide",
    IGNORE_SELECTOR: [
      "script",
      "style",
      "noscript",
      "textarea",
      "input",
      "code",
      "pre",
      "svg",
      "math",
      "[contenteditable='true']",
      ".email-hider-email",
      "[data-email-hider-ignore='true']",
    ].join(","),
  };
})();
