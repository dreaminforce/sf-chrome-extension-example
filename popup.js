document.getElementById('fetchBtn').addEventListener('click', () => {
  const container = document.getElementById('apexClasses');
  container.textContent = "Loading...";
  
  chrome.runtime.sendMessage({ action: "fetchApexClasses" }, (response) => {
    if (response.error) {
      container.textContent = "Error: " + response.error;
    } else if (response.apexClasses) {
      const list = response.apexClasses;
      if (list.length === 0) {
        container.textContent = "No Apex Classes found.";
      } else {
        let html = "<ul>";
        list.forEach(cls => {
          html += `<li>${cls.Name} (${cls.Id})</li>`;
        });
        html += "</ul>";
        container.innerHTML = html;
      }
    } else {
      container.textContent = "No response received.";
    }
  });
});
