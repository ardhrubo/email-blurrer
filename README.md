# Email Hider Chrome Extension

Hides or blurs email addresses found in web pages.

## Features

- Blurs email addresses in visible text
- Optional hide mode for stronger masking
- Watches dynamic pages with a `MutationObserver`
- Simple popup to toggle protection and adjust blur strength

## Project structure

- `content/constants.js` → shared config/constants for content scripts
- `content/masking.js` → email detection + DOM wrapping/unwrapping
- `content/runtime.js` → settings, observer, and orchestration
- `content.js` → tiny bootstrap entry
- `popup/storage.js` → read/write settings from `chrome.storage.sync`
- `popup/ui.js` → popup element wiring and rendering
- `popup.js` → popup orchestration entry

## Install locally

1. Open Chrome and go to `chrome://extensions`
2. Enable Developer mode
3. Click Load unpacked
4. Select this folder

## Notes

- Works on visible text in regular web pages
- Does not perform OCR on images or screenshots
- Ignores scripts, code blocks, inputs, and editable regions