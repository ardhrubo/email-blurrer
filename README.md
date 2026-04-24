<div align="center">
  <img src="icon.png" width="96" height="96" alt="Email Blurrer Logo">
  <h1>Email Blurrer v1.0.0</h1>
  <p><b>Never accidentally leak your email on a screen recording again.</b></p>
</div>

<br/>

Have you ever been recording a tutorial, leading a team meeting, or sharing your screen, only to accidentally hover over your profile picture and expose your personal email to the entire universe? Yeah, we've been there. The slight panic. The rush to find the blur tool in your video editor. The sudden urge to throw your laptop out the window.

**Fear no more.** 

**Email Blurrer** is a sleek, modern, and slightly over-engineered Chrome extension built specifically to protect your privacy while screen recording or broadcasting. It finds emails anywhere on the page and cloaks them in glorious, unreadable obscurity. Best of all? It doesn't cost a dime.

---

## ✨ Why You Need This
* 🦅 **It's 100% Open Source and Free:** No subscription fees. No ads. No stealing your data. Just pure, unadulterated privacy tech for the people.
* 🛡️ **Safe Mode for Screen Recordings:** Engage "Safe Mode" and we slap a solid black redaction bar over all emails. Hovering won't unmask it. The CIA couldn't unmask it. You're safe.
* 🔎 **Deep Anti-Scraping Tech:** We don't just blur plain text. We pierce right through Web Component Shadow DOMs and intercept sneaky invisible zero-width spaces (`\u200B` looking at you, Google account popups).
* ⚡ **Ninja Hotkey:** Type `Alt+Shift+H` (or `MacCtrl+Shift+H` on Mac) to toggle protection in less time than it takes to blink.

---

## 🚀 Installation

Since we're indie and open source, you won't find us hunting for your wallet on the Chrome Web Store. Instead, follow these three simple steps to unlock ultimate power:

1. Open Chrome and head to `chrome://extensions`
2. Flick that ultra-cool **Developer mode** switch in the top right corner.
3. Click **Load unpacked** and select this project folder.
4. *(Optional but recommended)* Pin the extension to your toolbar so you can gaze at its beautiful icon.

---

## 🛠️ How It Works (For the Nerds)

The extension is modular and watches your active document using a highly optimized `MutationObserver` operating strictly in `document_idle`. 

- **`content/masking.js`**: Home to the deep-DOM regex scanner. It rips through text nodes, attributes (`aria-label`, `title`), and iframes to execute the masking.
- **`content/runtime.js`**: The brains of the operation orchestrates dynamically loaded changes and injects our robust CSS blocks.
- **`manifest.json`**: Uses MV3 principles, injecting safely into cross-origin iframes (because iframes are sneaky).
- **`popup/ui.js`**: Powers the premium dark-mode interface where you flip the switches.

---

## ⚖️ Pricing & License

**Cost:** $0.00 forever.  
**License:** Open Source. Use it, fork it, break it, fix it, send a PR. 

*If this saved your job or your YouTube video, give the repo a star. Or don't. We're not your boss.* 😉