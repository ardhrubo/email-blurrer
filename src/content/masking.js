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

  function maskEmail(email, char = "•") {
    return char.repeat(Math.max(4, email.length));
  }

  function createMaskedNode(email, settings) {
    const span = document.createElement("span");
    let modeClass = constants.BLUR_CLASS;
    if (settings.mode === "hide") modeClass = constants.HIDE_CLASS;
    else if (settings.mode === "redact") modeClass = constants.REDACT_CLASS;

    span.className = `${constants.EMAIL_WRAPPER_CLASS}`;
    span.setAttribute("data-email-hider-original", email);
    span.textContent = email; // Always use real email so CSS hover can reveal it
    span.classList.add(modeClass);

    return span;
  }

  // ─── Display Name Masking ──────────────────────────────────────────────────

  /**
   * Returns the CSS mode class based on current settings.
   */
  function getModeClass(settings) {
    if (settings.mode === "hide") return constants.HIDE_CLASS;
    if (settings.mode === "redact") return constants.REDACT_CLASS;
    return constants.BLUR_CLASS;
  }

  /**
   * Wraps only the leaf text nodes of a display-name element in masked spans.
   * Skips elements that are inside ignored zones or are images themselves.
   */
  function maskDisplayNameElement(el, settings) {
    if (el.querySelector(`.${constants.DISPLAY_NAME_WRAPPER_CLASS}`)) return;
    if (el.closest(constants.IGNORE_SELECTOR)) return;
    if (el.tagName === 'IMG' || el.tagName === 'SVG') return;

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && node.parentElement.closest(constants.IGNORE_SELECTOR)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    if (textNodes.length === 0) return;

    const modeClass = getModeClass(settings);

    for (const node of textNodes) {
      const wrapper = document.createElement("span");
      wrapper.className = `${constants.DISPLAY_NAME_WRAPPER_CLASS} ${modeClass}`;
      wrapper.setAttribute("data-display-name-hider-original", node.nodeValue);
      wrapper.textContent = node.nodeValue;
      node.replaceWith(wrapper);
    }
    
    el.setAttribute("data-email-hider-name-masked", "true");
  }

  /**
   * Removes all display-name masking spans, restoring original text nodes.
   */
  function unwrapDisplayNames() {
    const maskedSpans = document.querySelectorAll(`.${constants.DISPLAY_NAME_WRAPPER_CLASS}`);
    for (const wrapper of maskedSpans) {
      const original = wrapper.getAttribute("data-display-name-hider-original") || wrapper.textContent || "";
      wrapper.replaceWith(document.createTextNode(original));
    }
    const markedParents = document.querySelectorAll("[data-email-hider-name-masked]");
    for (const el of markedParents) {
      el.removeAttribute("data-email-hider-name-masked");
    }
  }

  /**
   * Scans a root for display name elements and masks them.
   */
  function maskDisplayNames(root, settings) {
    if (!root.querySelectorAll) return;

    for (const selector of constants.DISPLAY_NAME_SELECTORS) {
      let elements;
      try {
        elements = root.querySelectorAll(selector);
      } catch (_) {
        continue; // Skip invalid selectors gracefully
      }
      for (const el of elements) {
        maskDisplayNameElement(el, settings);
      }
    }
  }

  // ─── Profile Picture Masking (Safe Mode Only) ────────────────────────────

  function maskProfilePics(root, settings) {
    if (!settings.screenRecordingMode) return;
    if (!root.querySelectorAll) return;

    for (const selector of constants.PROFILE_PIC_SELECTORS) {
      let elements;
      try {
        elements = root.querySelectorAll(selector);
      } catch (_) { continue; }

      for (const el of elements) {
        if (el.closest(constants.IGNORE_SELECTOR)) continue;
        if (el.tagName === 'IMG' || el.tagName === 'SVG' || el.tagName === 'DIV') {
          if (!el.classList.contains(constants.PROFILE_PIC_CLASS)) {
            el.classList.add(constants.PROFILE_PIC_CLASS);
            el.setAttribute("data-email-hider-profile-masked", "true");
          }
        }
      }
    }
  }

  function unmaskProfilePics() {
    const masked = document.querySelectorAll(`[data-email-hider-profile-masked="true"]`);
    for (const el of masked) {
      el.classList.remove(constants.PROFILE_PIC_CLASS);
      el.removeAttribute("data-email-hider-profile-masked");
    }
  }

  // ─── Email Text Node Masking ───────────────────────────────────────────────

  function unwrapAll() {
    const selectors = `.${constants.EMAIL_WRAPPER_CLASS}`;
    const nodes = Array.from(document.querySelectorAll(selectors));

    for (const node of nodes) {
      const original = node.getAttribute("data-email-hider-original") || node.textContent || "";
      node.replaceWith(document.createTextNode(original));
    }

    unwrapDisplayNames();
    unmaskProfilePics();
    unmaskAttributes();
    unmaskInputs();
  }

  function unmaskAttributes() {
    for (const attr of constants.ATTRIBUTES_TO_MASK) {
      const originalDataAttr = constants.ATTRIBUTE_DATA_PREFIX + attr;
      const elements = document.querySelectorAll(`[${CSS.escape(originalDataAttr)}]`);
      for (const el of elements) {
        el.setAttribute(attr, el.getAttribute(originalDataAttr));
        el.removeAttribute(originalDataAttr);
      }
    }
  }

  function unmaskInputs() {
    const elements = document.querySelectorAll('[data-email-hider-blurred-input]');
    for (const el of elements) {
      restoreInputFilter(el);
      el.removeAttribute('data-email-hider-blurred-input');
    }
  }

  function getBlurredInputOriginalFilterAttribute() {
    return 'data-email-hider-original-filter';
  }

  function restoreInputFilter(el) {
    const originalFilterAttr = getBlurredInputOriginalFilterAttribute();
    if (el.hasAttribute(originalFilterAttr)) {
      const originalFilter = el.getAttribute(originalFilterAttr) || '';
      if (originalFilter) {
        el.style.setProperty('filter', originalFilter);
      } else {
        el.style.removeProperty('filter');
      }
      el.removeAttribute(originalFilterAttr);
      return;
    }

    el.style.removeProperty('filter');
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

  function getAllRoots(node) {
    const roots = [node];
    if (!node.querySelectorAll) return roots;
    const elements = node.querySelectorAll('*');
    for (const el of elements) {
      if (el.shadowRoot) {
        roots.push(...getAllRoots(el.shadowRoot));
      }
    }
    return roots;
  }

  function scan(rootNode, settings) {
    if (!rootNode || !settings.enabled) {
      return;
    }

    const roots = getAllRoots(rootNode);

    for (const root of roots) {
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
      
      if (root.querySelectorAll) {
        maskAttributes(root, settings);
        maskInputs(root, settings);

        // Mask display names if enabled OR if safe mode is on
        if (settings.hideDisplayName || settings.screenRecordingMode) {
          maskDisplayNames(root, settings);
        }

        // Mask profile pics (aggressively redactions in safe mode only)
        maskProfilePics(root, settings);
      }
    }
  }

  function maskAttributes(root, settings) {
    const useRedactChar = settings.mode === "redact" || settings.screenRecordingMode;
    const char = useRedactChar ? "█" : "•";

    for (const attr of constants.ATTRIBUTES_TO_MASK) {
      const elements = root.querySelectorAll(`[${CSS.escape(attr)}]`);
      for (const el of elements) {
        if (el.closest(constants.IGNORE_SELECTOR)) continue;
        
        const value = el.getAttribute(attr);
        if (containsEmail(value)) {
          const originalDataAttr = constants.ATTRIBUTE_DATA_PREFIX + attr;
          if (!el.hasAttribute(originalDataAttr)) {
            el.setAttribute(originalDataAttr, value);
          }
          
          const regex = createEmailRegex();
          const maskedValue = value.replace(regex, (match) => maskEmail(match, char));
          el.setAttribute(attr, maskedValue);
        }
      }
    }
  }

  function maskInputs(root, settings) {
    const inputs = root.querySelectorAll('input:not([type="password"]), textarea');
    for (const el of inputs) {
      if (el.closest("[data-email-hider-ignore='true']")) continue;
      
      const val = el.value || el.placeholder || "";
      if (containsEmail(val)) {
        const originalFilterAttr = getBlurredInputOriginalFilterAttribute();
        if (!el.hasAttribute(originalFilterAttr)) {
          el.setAttribute(originalFilterAttr, el.style.filter);
        }

        const blurAmount = settings.screenRecordingMode ? 12 : settings.blurPx;
        el.style.setProperty('filter', `blur(${blurAmount}px)`, 'important');
        el.setAttribute('data-email-hider-blurred-input', 'true');
      }
    }
  }

  ns.masking = {
    unwrapAll,
    scan,
  };
})();
