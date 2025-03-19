const reloadIntervals = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { tabId, isActive, time, unit } = message;
  if (isActive) {
    const interval = convertToMilliseconds(time, unit);
    reloadIntervals[tabId] = setInterval(() => {
      chrome.tabs.reload(tabId);
    }, interval);
  } else {
    clearInterval(reloadIntervals[tabId]);
    delete reloadIntervals[tabId];
  }
});

function convertToMilliseconds(time, unit) {
  switch (unit) {
    case "seconds":
      return time * 1000;
    case "minutes":
      return time * 60 * 1000;
    case "hours":
      return time * 60 * 60 * 1000;
    default:
      return time * 1000;
  }
}
