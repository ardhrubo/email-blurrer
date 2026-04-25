chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-protection") {
    const defaults = { enabled: true };
    chrome.storage.sync.get(defaults, (data) => {
      chrome.storage.sync.set({ enabled: !data.enabled });
    });
  }
});
