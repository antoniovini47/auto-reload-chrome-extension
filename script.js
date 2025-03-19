document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    const tabsContainer = document.getElementById("tabs-container");
    tabsContainer.innerHTML = "";
    tabs.forEach((tab) => {
      const tabElement = document.createElement("div");
      tabElement.className = "tab";

      const savedConfig = JSON.parse(localStorage.getItem(`tab-${tab.id}`)) || {
        isActive: false,
        time: 1,
        unit: "seconds",
      };

      tabElement.innerHTML = `
                <input type="checkbox" id="active-${tab.id}" ${
        savedConfig.isActive ? "checked" : ""
      }>
                <label for="active-${tab.id}">${tab.title}</label>
                <input type="number" id="time-${tab.id}" min="1" value="${savedConfig.time}">
                <select id="unit-${tab.id}">
                    <option value="seconds" ${
                      savedConfig.unit === "seconds" ? "selected" : ""
                    }>Seconds</option>
                    <option value="minutes" ${
                      savedConfig.unit === "minutes" ? "selected" : ""
                    }>Minutes</option>
                    <option value="hours" ${
                      savedConfig.unit === "hours" ? "selected" : ""
                    }>Hours</option>
                </select>
            `;
      tabsContainer.appendChild(tabElement);

      const updateConfig = () => {
        const isActive = document.getElementById(`active-${tab.id}`).checked;
        const time = document.getElementById(`time-${tab.id}`).value;
        const unit = document.getElementById(`unit-${tab.id}`).value;

        // Clear previous config
        localStorage.removeItem(`tab-${tab.id}`);

        localStorage.setItem(`tab-${tab.id}`, JSON.stringify({ isActive, time, unit }));

        chrome.runtime.sendMessage({
          tabId: tab.id,
          isActive,
          time,
          unit,
        });

        document.getElementById("feedback").innerText = "Changes applied";
        setTimeout(() => {
          document.getElementById("feedback").innerText = "";
        }, 2000);
      };

      document.getElementById(`active-${tab.id}`).addEventListener("change", updateConfig);
      document.getElementById(`time-${tab.id}`).addEventListener("change", updateConfig);
      document.getElementById(`unit-${tab.id}`).addEventListener("change", updateConfig);
    });

    const feedbackElement = document.createElement("div");
    feedbackElement.id = "feedback";
    feedbackElement.className = "feedback";
    tabsContainer.appendChild(feedbackElement);
  });
});
