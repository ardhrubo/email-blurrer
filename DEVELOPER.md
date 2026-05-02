# 📧 Email Blurrer - Developer Documentation

Welcome to the developer documentation for the Email Blurrer browser extension. This guide will help you get the project set up for development and understand its structure.

---

## 🚀 Getting Started

This project uses **Node.js** and **npm** to manage development dependencies. These are tools that help us automate tasks and manage the code, but they are **not** included in the final, packaged extension.

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (which includes npm) installed on your machine.

### 2. Installation

Clone the repository and install the development dependencies by running the following command in your terminal:

```bash
npm install
```

This command reads the `package.json` file and downloads the necessary tools (like `puppeteer`) into a `node_modules` folder.

> **Note:** The `node_modules` folder is only for development and will **not** be bundled into the final extension that users install. The `.gitignore` file ensures this folder is kept out of the production build.

---

## 📂 Project Structure

The workspace is organized to separate the extension's core logic from development scripts.

```
.
├── content/              # Core content scripts for email masking
│   ├── constants.js
│   ├── masking.js
│   └── runtime.js
├── popup/                # UI and logic for the extension popup
│   ├── storage.js
│   └── ui.js
├── scripts/              # Node.js scripts for development & testing
│   ├── browse.js
│   └── convert.js
├── styles/               # CSS for the extension
│   └── styles.css
├── manifest.json         # The extension's manifest file
├── popup.html            # The HTML for the extension's popup
├── package.json          # Lists development dependencies (for Node.js)
└── DEVELOPER.md          # This file!
```

---

## 🛠️ Development Scripts

The `scripts/` directory contains helper scripts for development and testing.

### `browse.js`

This script uses Node.js to fetch the source code of a webpage (e.g., google.com). It's a lightweight way to test how the extension might interact with the structure of real-world websites without needing to load a full browser instance.

**Usage:**

```bash
node scripts/browse.js
```

### `convert.js`

This script is a placeholder for any future build or conversion tasks. It can be adapted to automate image optimization, code minification, or other tasks that prepare the extension for production.
