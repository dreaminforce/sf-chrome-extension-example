'use strict';

// Helper: Convert a Response object to JSON.
function toJson(response) {
  return response.json();
}

// Fetch Apex classes using the Tooling API.
async function getApexClasses(apiHost, headers) {
  const query = encodeURIComponent("SELECT Id, Name FROM ApexClass");
  const url = apiHost + '/services/data/v37.0/tooling/query/?q=' + query;
  return await fetch(url, { headers: headers })
    .then(toJson)
    .then(data => data.records);
}

// For Classic: Retrieve the SID cookie for the current URL.
async function getTokenAndDomainInClassic(url) {
  return new Promise((resolve, reject) => {
    chrome.cookies.getAll({ url: url, name: "sid" }, function(cookies) {
      if (cookies && cookies.length > 0) {
        resolve([cookies[0].value, cookies[0].domain]);
      } else {
        reject(new Error("No SID cookie found"));
      }
    });
  });
}

// For Lightning: Retrieve all SID cookies for "salesforce.com" and choose the one matching the custom domain.
async function getTokenAndDomainInLightning(url, customDomain) {
  return new Promise((resolve, reject) => {
    chrome.cookies.getAll({ domain: "salesforce.com", name: "sid" }, function(cookies) {
      resolve(cookies);
    });
  }).then(cookies => {
    let token = "";
    let domain = "";
    for (let cookie of cookies) {
      if (cookie.domain.startsWith(customDomain + ".")) {
        token = cookie.value;
        domain = cookie.domain;
        break;
      }
    }
    if (!token) {
      throw new Error("No matching SID cookie found for custom domain: " + customDomain);
    }
    return [token, domain];
  });
}

// Core function: Given a tab, determine the session and fetch Apex classes.
async function fetchApexClassesInternal(tab) {
  const urlObj = new URL(tab.url);
  const protocol = urlObj.protocol; // e.g. "https:"
  const host = urlObj.host;         // e.g. "instance.lightning.force.com" or "instance.salesforce.com"
  const path = urlObj.pathname;
  let isLightningMode = host.includes("lightning.force.com");

  let sid, domain;
  if (isLightningMode) {
    // For Lightning, extract the custom domain (the part before ".lightning.force.com")
    let customDomain = host.substring(0, host.indexOf(".lightning.force.com"));
    [sid, domain] = await getTokenAndDomainInLightning(protocol + '//' + host, customDomain);
  } else {
    if (!path.match(/\/\w{15,18}/)) {
      throw new Error("URL does not match expected Classic pattern.");
    }
    [sid, domain] = await getTokenAndDomainInClassic(protocol + '//' + host);
  }

  // Determine the API host: for Lightning, use the cookie domain; for Classic, use the active host.
  let apiHost = protocol + '//' + (isLightningMode ? domain : host);
  let headers = {
    "Authorization": `Bearer ${sid}`,
    "Content-Type": "application/json"
  };

  let apexClasses = await getApexClasses(apiHost, headers);
  return apexClasses;
}

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchApexClasses") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        sendResponse({ error: "No active tab" });
        return;
      }
      fetchApexClassesInternal(tabs[0])
        .then(apexClasses => {
          sendResponse({ apexClasses: apexClasses });
        })
        .catch(err => {
          sendResponse({ error: err.message });
        });
    });
    // Return true to indicate that the response will be sent asynchronously.
    return true;
  }
});
