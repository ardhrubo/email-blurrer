(() => {
  const ns = (window.EmailHider = window.EmailHider || {});

  ns.constants = {
    DEFAULT_SETTINGS: {
      enabled: true,
      mode: "blur",
      blurPx: 6,
      revealOnHover: false,
      screenRecordingMode: false,
      hideDisplayName: false,
    },
    // Adding zero-width characters \u200B-\u200D, \uFEFF to the match groups
    EMAIL_PATTERN: "(?:\\b|^)[A-Z0-9._%+\\-\\u200B\\u200C\\u200D\\uFEFF]+@[A-Z0-9.\\-\\u200B\\u200C\\u200D\\uFEFF]+\\.[a-zA-Z]{2,}(?:\\b|$)",
    EMAIL_FLAGS: "gi",
    EMAIL_WRAPPER_CLASS: "email-hider-email",
    DISPLAY_NAME_WRAPPER_CLASS: "email-hider-display-name",
    PROFILE_PIC_CLASS: "email-hider-profile-pic",
    BLUR_CLASS: "email-hider-mode-blur",
    HIDE_CLASS: "email-hider-mode-hide",
    REDACT_CLASS: "email-hider-mode-redact",
    SAFE_MODE_CLASS: "email-hider-screen-recording-mode",
    NO_HOVER_CLASS: "email-hider-no-hover",
    // Selectors for display name elements in Gmail and common email UIs
    DISPLAY_NAME_SELECTORS: [
      // Gmail: sender name in email list
      ".yW span[email]",
      ".yP span[email]",
      // Gmail: sender name in open email thread header
      ".gD",
      ".go",
      // Gmail: account name in top-right profile area
      ".gb_tb",
      ".gb_5b",
      // Gmail: profile name in "From" field compose
      ".vN",
      // Google Workspace / account name in header
      "[data-hovercard-id] .NKpSQ",
      // Generic: elements explicitly carrying a person's name alongside an email
      "[email]",
      "[data-email]",
      // Outlook Web
      ".ms-Persona-primaryText",
      ".o365cs-people-personaName",
      "[class*='senderName']",
      "[class*='sender-name']",
      "[class*='from-name']",
      "[class*='FromName']",
    ],
    // Selectors for profile pictures to hide securely in Safe Mode
    PROFILE_PIC_SELECTORS: [
      "img[src*='googleusercontent.com/a/']", // Google avatars
      "img[src*='googleusercontent.com/-']",
      "img.gb_Ba",
      "img.gb_Ca",
      "img.gb_Da",
      "img[class*='avatar' i]",
      "img[class*='profile' i]",
      "img[src*='avatar' i]",
      "img[src*='profile' i]",
      "img.ms-Persona-image",
      "img[class*='Persona-image']",
      "img[alt*='profile' i]",
      "img[alt*='avatar' i]"
    ],
    ATTRIBUTES_TO_MASK: [
      "title",
      "aria-label",
      "alt",
      "placeholder",
      "data-tooltip",
      "data-original-title",
    ],
    ATTRIBUTE_DATA_PREFIX: "data-email-hider-original-attr-",
    IGNORE_SELECTOR: [
      "script",
      "style",
      "noscript",
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
