(() => {
  const ns = window.EmailHider;
  const constants = ns.constants;

  function createEmailRegex() {
    return new RegExp(constants.EMAIL_PATTERN, constants.EMAIL_FLAGS);
  }

  function containsEmail(text) {
    if (!text) {
      return false;
    }

    return createEmailRegex().test(text);
  }

  function shouldIgnoreTextNode(node) {
    if (!node || !node.parentElement) {
      return true;
    }

    return Boolean(node.parentElement.closest(constants.IGNORE_SELECTOR));
  }

  function maskEmail(email) {
    return "•".repeat(Math.max(4, email.length));
  }

  function createMaskedNode(email, settings) {
    const span = document.createElement("span");
    const modeClass = settings.mode === "hide" ? constants.HIDE_CLASS : constants.BLUR_CLASS;

    span.className = `${constants.EMAIL_WRAPPER_CLASS} ${modeClass}`;
    span.setAttribute("data-email-hider-original", email);
    span.textContent = settings.mode === "hide" ? maskEmail(email) : email;

    return span;
  }

  function unwrapAll() {
    const selectors = `.${constants.EMAIL_WRAPPER_CLASS}`;
    const nodes = Array.from(document.querySelectorAll(selectors));

    for (const node of nodes) {
      const original = node.getAttribute("data-email-hider-original") || node.textContent || "";
      node.replaceWith(document.createTextNode(original));
    }
  }

  function wrapEmailsInTextNode(textNode, settings) {
    if (shouldIgnoreTextNode(textNode)) {
      return;
    }

    const text = textNode.nodeValue || "";
    const regex = createEmailRegex();

    if (!regex.test(text)) {
      return;
    }

    regex.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let cursor = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const email = match[0];
      const index = match.index;

      if (index > cursor) {
        fragment.appendChild(document.createTextNode(text.slice(cursor, index)));
      }

      fragment.appendChild(createMaskedNode(email, settings));
      cursor = index + email.length;
    }

    if (cursor < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(cursor)));
    }

    textNode.replaceWith(fragment);
  }

  function scan(root, settings) {
    if (!root || !settings.enabled) {
      return;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }

        if (shouldIgnoreTextNode(node)) {
          return NodeFilter.FILTER_REJECT;
        }

        return containsEmail(node.nodeValue)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });

    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    for (const textNode of textNodes) {
      wrapEmailsInTextNode(textNode, settings);
    }
  }

  ns.masking = {
    unwrapAll,
    scan,
  };
})();
