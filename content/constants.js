(() => {
  const ns = (window.EmailHider = window.EmailHider || {});

  ns.constants = {
    DEFAULT_SETTINGS: {
      enabled: true,
      mode: "blur",
      blurPx: 6,
      revealOnHover: false,
      screenRecordingMode: false,
    },
    // Adding zero-width characters \u200B-\u200D, \uFEFF to the match groups
    EMAIL_PATTERN: "(?:\\b|^)[A-Z0-9._%+\\-\\u200B\\u200C\\u200D\\uFEFF]+@[A-Z0-9.\\-\\u200B\\u200C\\u200D\\uFEFF]+\\.[a-zA-Z]{2,}(?:\\b|$)",
    EMAIL_FLAGS: "gi",
    EMAIL_WRAPPER_CLASS: "email-hider-email",
    BLUR_CLASS: "email-hider-mode-blur",
    HIDE_CLASS: "email-hider-mode-hide",
    REDACT_CLASS: "email-hider-mode-redact",
    SAFE_MODE_CLASS: "email-hider-screen-recording-mode",
    NO_HOVER_CLASS: "email-hider-no-hover",
    ATTRIBUTES_TO_MASK: [
      "title",
      "aria-label",
      "alt",
      "data-tooltip",
      "data-original-title",
    ],
    ATTRIBUTE_DATA_PREFIX: "data-email-hider-original-attr-",
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
