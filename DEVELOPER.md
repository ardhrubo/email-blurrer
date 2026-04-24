# Email Blurrer Developer Documentation

This document provides instructions for setting up the development environment and running the project's scripts.

## Project Structure

The project is organized into the following directories:

-   `content/`: Contains the core content scripts responsible for email masking on web pages.
-   `popup/`: Contains the UI and logic for the extension's popup.
-   `scripts/`: Contains Node.js scripts used for development and testing purposes.
-   `styles/`: Contains the CSS for the extension.

## Development Setup

This project uses Node.js and `npm` for managing development dependencies. The only development dependency is `puppeteer`, which is used by the scripts in the `scripts/` directory.

### Installation

To install the development dependencies, run the following command in your terminal:

```bash
npm install
```

This will create a `node_modules` directory containing `puppeteer`. This directory is excluded from the final extension build by the `.gitignore` file.

## Development Scripts

The `scripts/` directory contains helper scripts for development.

### `browse.js`

This script fetches the Google homepage and extracts the HTML of the login/profile area. It's useful for testing how the extension might interact with complex, dynamic web pages.

### `convert.js`

This script is intended for any future automated conversion or build tasks. It currently serves as a template for `puppeteer`-based automation.
