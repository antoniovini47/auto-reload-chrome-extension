document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    const tabsContainer = document.getElementById("tabs-container");
    tabs.forEach((tab) => {
      const tabElement = document.createElement("div");
      tabElement.className = "tab";
      tabElement.innerHTML = `
                <input type="checkbox" id="active-${tab.id}">
                <label for="active-${tab.id}">${tab.title}</label>
                <input type="number" id="time-${tab.id}" min="1" value="1">
                <select id="unit-${tab.id}">
                    <option value="seconds">Seconds</option>
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                </select>
            `;
      tabsContainer.appendChild(tabElement);

      document.getElementById(`active-${tab.id}`).addEventListener("change", function () {
        const isActive = this.checked;
        const time = document.getElementById(`time-${tab.id}`).value;
        const unit = document.getElementById(`unit-${tab.id}`).value;
        chrome.runtime.sendMessage({
          tabId: tab.id,
          isActive,
          time,
          unit,
        });
      });
    });
  });
});
