# Salesforce Apex Classes Chrome Extension

A simple Chrome extension that connects with a Salesforce org to fetch and display a list of Apex classes. This project demonstrates how to build a Chrome extension that integrates with Salesforce, showcasing a basic interaction between the extension and Salesforce data.

## Table of Contents

- **Features**
- **Prerequisites**
- **Installation**
- **Usage**
- **Code Overview**
- **Salesforce Integration Details**
- **Contributing**
- **License**

## Features

- **Salesforce Integration:** Connects with an open Salesforce org to fetch data.
- **Fetch Apex Classes:** Retrieves and displays a list of all Apex classes available in the Salesforce org.
- **User-Friendly Interface:** Simple popup UI with a button to initiate data fetch.
- **Demonstrative:** Serves as a starting point for developers looking to build Chrome extensions that work with Salesforce.

## Prerequisites

- **Google Chrome:** The extension is built for the Chrome browser.
- **Salesforce Org:** An active Salesforce org (with necessary API permissions) should be open in a tab.
- **Basic Knowledge:** Familiarity with Chrome extensions and Salesforce API concepts.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/dreaminforce/sf-chrome-extension-example
   cd sf-chrome-extension-example

2. **Load the Extension in Chrome**

- Open Chrome and navigate to chrome://extensions/
- Enable Developer Mode by toggling the switch in the top-right corner.
- Click Load unpacked and select the repository folder.
- Verify Host Permissions

3. The extension is pre-configured to work with Salesforce domains:

- **https://*.force.com/***
- **https://*.salesforce.com/***
- **Make sure you are logged into your Salesforce Org in an active tab.**

## Usage
- Open Salesforce
- Log in to your Salesforce Org (either in Classic or Lightning Experience).
- Activate the Extension
- Click on the extension icon in the Chrome toolbar.
- A popup will appear with a "Fetch Apex Classes" button.
- Click the Fetch Apex Classes button.
- The extension will display a list of Apex classes from your Salesforce Org.
- If no classes are found, you'll see a message indicating so. In case of errors (e.g., missing session cookie), an error message will be displayed.

## Screenshots
  ![Screenshot 2025-02-04 205815](https://github.com/user-attachments/assets/f82515b0-f9a0-49a5-8f4b-ccd02e9ecb68)
  ![Screenshot 2025-02-04 205939](https://github.com/user-attachments/assets/16abcc41-d928-43b3-8cdf-fc4452266adf)



## Code Overview
### manifest.json

Configures the extension with:

- Manifest version 3.
- Popup (popup.html) and background script (background.js).
- Permissions such as activeTab and cookies.
- Host permissions for Salesforce domains.

### popup.html

Provides the user interface for the extension popup, including the "Fetch Apex Classes" button and a container for displaying results.

### popup.js

Listens for the button click, sends a message to the background script, and then displays the fetched Apex classes or error messages.

### background.js

Handles the core logic:

- Determines whether the Salesforce Org is in Classic or Lightning mode.
- Retrieves the session ID (sid) from cookies.
- Constructs the appropriate API URL for Salesforce's Tooling API.
- Fetches the list of Apex classes using a SOQL query (SELECT Id, Name FROM ApexClass).


## Salesforce Integration Details

The extension connects to Salesforce by:

- **Session Detection**: Identifying whether the active tab is in Classic or Lightning mode based on the URL.
- **Cookie Retrieval**: Using Chrome's cookies API to fetch the Salesforce session ID (sid).
- **API Request**: Building the API URL and making a fetch call to Salesforce’s Tooling API to retrieve Apex classes.


## Contributing
Contributions are welcome! If you have ideas for improvements or encounter any issues, please:


## License
This project is licensed under the MIT License.

## Disclaimer
This extension is provided for demonstration purposes only. Use it at your own risk. The author is not responsible for any misuse or issues arising from its use in production environments.
