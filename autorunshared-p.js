// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Contains code for event-based activation on Outlook on web, on Windows, and on Mac (new UI preview).

// VERSION INFO - Update this whenever you deploy new changes
const ADDIN_VERSION = "1.1.0";
const LAST_UPDATED = "2025-11-06";

// Cache duration: 7 days in milliseconds
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

// Location code mapping for Lilly facilities
const LOCATION_MAP = {
  "MC": "Lilly Corporate Center, Indianapolis, IN 46285 USA",
  "IC": "Lilly Tech Center South, Indianapolis, IN 46221 USA",
  "KY": "Lilly Tech Center North, Indianapolis, IN 46221 USA",
  "LEP": "Lilly LEAP Lebanon Manufacturing, Lebanon, IN 46052 USA",
  "LP1": "Lebanon Plant Site, Lebanon, IN 46052 USA",
  "LP2": "Lebanon Plant Site 2, Lebanon, IN 46052 USA",
  "IMC": "ImClone Systems, Branchburg, NJ 08853 USA",
  "GUR": "Warehouse, Gurnee, IL 60031 USA",
  "BOS": "Lilly Seaport Innovation Center, Boston, MA USA",
  "CAM": "Lilly Cambridge Office, Cambridge, MA USA",
  "CON": "Lilly Manufacturing Concord, Concord, NC USA",
  "HOM": "Works from Home",
  "CA": "Eli Lilly Canada Inc., Toronto, Canada",
  "LIM": "Lilly Manufacturing Limerick, Limerick, Ireland",
  "CK": "Kinsale Manufacturing Operations, Kinsale, Ireland",
  "FR": "Lilly France Manufacturing, Fegersheim, France"
};

// Function to get formatted location from office location code
function getLocationFromCode(officeLocationCode) {
  if (!officeLocationCode) return "";
  const facilityCode = officeLocationCode.split('/')[0].toUpperCase();
  return LOCATION_MAP[facilityCode] || "";
}

// Fallback user data if Graph API fails or returns incomplete data
const FALLBACK_USER_INFO = {
  name: "",
  email: "",
  mobilePhone: "",
  officePhone: "",
  jobTitle: "",
  department: "",
  officeLocation: "",
  country: "",
  companyName: null,
  pronoun: "",
  pronunciation: "",
  functionalArea: "",
  companyAddress: "",
  companyWebsite: "",
  greeting: "Best regards,"
};

/**
 * Checks if signature exists.
 * Uses DUAL CACHE: sessionStorage (for OWA page reloads) + roamingSettings (for long-term)
 * Only fetches from Graph API if both caches are missing or stale.
 * Auto-detects contractor vs. employee based on companyName field.
 * @param {*} eventObj Office event object
 */
function checkSignature(eventObj) {
  // VISIBLE DEBUG: Alert to confirm autorun is triggering
  try {
    Office.context.mailbox.item.notificationMessages.addAsync("autorun-test", {
      type: "informationalMessage",
      message: "🚀 Autorun triggered! GitHub Pages working!",
      icon: "icon1",
      persistent: false
    });
  } catch(e) {
    // Notification failed, continue anyway
  }
  
  let user_email = Office.context.mailbox.userProfile.emailAddress;
  let user_displayName = Office.context.mailbox.userProfile.displayName;
  
  console.log("\n🚀 ═══════════════════════════════════════════════════");
  console.log("🚀 AUTORUN TRIGGERED!");
  console.log("🚀 ═══════════════════════════════════════════════════");
  
  // TEMPORARY HARDCODE: Map mailbox emails to actual user account emails
  const EMAIL_MAPPING = {
    'AM_New_Outlook_2025@lilly.com': 'AM_New_Outlook_2025@elililly.onmicrosoft.com'
    // Add more mappings here as needed
  };
  
  // Check if this mailbox needs email override
  if (EMAIL_MAPPING[user_email]) {
    console.log("🔄 Mailbox email mapping:");
    console.log("  Mailbox:", user_email);
    console.log("  Actual user:", EMAIL_MAPPING[user_email]);
    user_email = EMAIL_MAPPING[user_email];
  }
  
  console.log("checkSignature triggered for:", user_email);
  console.log("Platform:", Office.context.mailbox.diagnostics.hostName);
  
  // CACHE LAYER 1: Try sessionStorage FIRST (survives OWA page reloads within same browser session)
  if (typeof sessionStorage !== 'undefined') {
    try {
      var session_cache = sessionStorage.getItem('user_info_session_cache');
      if (session_cache) {
        console.log("✓ Using sessionStorage cache (OWA page reload)");
        var cached_data = JSON.parse(session_cache);
        
        // Handle new format (object with user_info + template) OR old format (direct user_info)
        var user_info = cached_data.user_info || cached_data;
        var saved_template = cached_data.template;
        
        // If user saved a template preference from taskpane, use it
        if (saved_template) {
          console.log("✓ Using saved template preference from taskpane: " + saved_template);
          insertSignatureWithTemplate(saved_template, user_info, eventObj);
          return;
        }
        
        // Otherwise auto-detect template based on contractor status
        var template = determineDefaultTemplate(user_info);
        insertSignatureWithTemplate(template, user_info, eventObj);
        return;
      }
    } catch(e) {
      console.warn("sessionStorage not available or failed:", e);
    }
  }
  
  // CACHE LAYER 2: Check roamingSettings (long-term cache, 7 days)
  // NEW: Check lilly_user_info first (saved from taskpane), then fall back to user_info_cache (from Graph API)
  var cached_user_info_str = Office.context.roamingSettings.get("lilly_user_info") || 
                             Office.context.roamingSettings.get("user_info_cache");
  var cache_timestamp = Office.context.roamingSettings.get("user_info_timestamp");
  
  console.log("RoamingSettings cache:", cached_user_info_str ? "exists" : "missing");
  console.log("Cache timestamp:", cache_timestamp ? new Date(cache_timestamp).toISOString() : "none");
  
  var now = Date.now();
  
  // Use cache if it exists and is less than 7 days old
  if (cached_user_info_str && cache_timestamp && (now - cache_timestamp < CACHE_DURATION)) {
    var cache_age_days = Math.floor((now - cache_timestamp) / (24 * 60 * 60 * 1000));
    console.log("✓ Using roamingSettings cache (age: " + cache_age_days + " days)");
    
    try {
      var user_info = JSON.parse(cached_user_info_str);
      
      // ALSO save to sessionStorage for future OWA page reloads
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('user_info_session_cache', cached_user_info_str);
        console.log("✓ Copied to sessionStorage for faster OWA reloads");
      }
      
      // Auto-detect template based on contractor status
      var template = determineDefaultTemplate(user_info);
      insertSignatureWithTemplate(template, user_info, eventObj);
      return;
    } catch(e) {
      console.error("Error parsing cached data:", e);
      // Fall through to fetch from API
    }
  }
  
  // Both caches stale or missing - fetch from API
  console.log("⚠️ Cache stale or missing - fetching from Graph API...");
  fetchUserDataAndInsert(user_email, user_displayName, eventObj);
}

/**
 * Determines the default template based on user type
 * @param {*} user_info User information object
 * @returns Template name ("A", "B", or "C")
 */
function determineDefaultTemplate(user_info) {
  // STEP 1: Check for saved user preference first (from taskpane)
  var savedTemplate = Office.context.roamingSettings.get('lilly_newMail') || 
                      Office.context.roamingSettings.get('newMail');
  
  if (savedTemplate) {
    console.log("✓ Using saved template preference: " + savedTemplate);
    
    // Validate that contractors can only use Template C
    if (is_valid_data(user_info.companyName) && savedTemplate !== "C") {
      console.log("⚠️ Contractor detected - forcing Template C despite saved preference");
      return "C";
    }
    
    return savedTemplate;
  }
  
  // STEP 2: Fall back to auto-detection for first-time users
  console.log("No saved template preference found - using auto-detection");
  
  // If companyName is NOT null, user is a contractor -> use Template C
  if (is_valid_data(user_info.companyName)) {
    console.log("✓ User is contractor (companyName: " + user_info.companyName + ") -> Using Template C");
    return "C";
  }
  
  // If companyName is null, user is employee -> use Template A (with logo) as default
  console.log("✓ User is employee -> Using Template A");
  return "A";
}

/**
 * Fetches user data from Graph API and inserts signature
 * @param {*} user_email User's email address
 * @param {*} user_displayName User's display name from Office.js
 * @param {*} eventObj Office event object
 */
function fetchUserDataAndInsert(user_email, user_displayName, eventObj) {
  // Update fallback with Office.js data
  FALLBACK_USER_INFO.name = user_displayName || "Unknown User";
  FALLBACK_USER_INFO.email = user_email;
  
  // GitHub Pages deployment - always use CATS backend
  var API_BASE_URL = 'https://lilly-signature-addin.dc.lilly.com';
  
  console.log("API Base URL (GitHub Pages):", API_BASE_URL);
  
  // Fetch user data from Graph API
  var xhr = new XMLHttpRequest();
  xhr.open('GET', API_BASE_URL + '/signature?email=' + user_email, true);
  xhr.withCredentials = true; // Send authentication cookies
  
  xhr.onload = function() {
    var user_info;
    
    if (xhr.status === 200) {
      try {
        var graphData = JSON.parse(xhr.responseText);
        console.log("✓ User info loaded from Graph API");
        
        // MAP Graph API fields to expected field names
        user_info = {
          name: graphData.displayName || user_displayName || "Unknown User",
          email: graphData.mail || graphData.userPrincipalName || user_email,
          mobilePhone: graphData.mobilePhone || "",
          officePhone: (graphData.businessPhones && graphData.businessPhones[0]) || "",
          jobTitle: graphData.jobTitle || "",
          department: graphData.department || "",
          officeLocation: graphData.officeLocation || "",
          country: graphData.country || "",
          companyName: graphData.companyName || null,
          pronoun: "",
          pronunciation: "",
          functionalArea: "",
          companyAddress: "",
          companyWebsite: "",
          greeting: "Best regards,"
        };
        
        console.log("Mapped user info:", user_info);
        
        // DUAL CACHE: Save to BOTH roamingSettings AND sessionStorage
        var user_info_str = JSON.stringify(user_info);
        
        // Save to roamingSettings (7-day persistent cache)
        Office.context.roamingSettings.set("user_info_cache", user_info_str);
        Office.context.roamingSettings.set("user_info_timestamp", Date.now());
        Office.context.roamingSettings.saveAsync(function(result) {
          if (result.status === "succeeded") {
            console.log("✓ User info cached in roamingSettings for 7 days");
          } else {
            console.warn("⚠️ Failed to cache in roamingSettings:", result.error ? result.error.message : "unknown error");
          }
        });
        
        // ALSO save to sessionStorage (for OWA page reloads)
        if (typeof sessionStorage !== 'undefined') {
          try {
            sessionStorage.setItem('user_info_session_cache', user_info_str);
            console.log("✓ User info cached in sessionStorage for OWA");
          } catch(e) {
            console.warn("⚠️ Failed to cache in sessionStorage:", e);
          }
        }
        
      } catch(e) {
        console.error("Error parsing user info:", e);
        user_info = FALLBACK_USER_INFO;
      }
    } else {
      console.warn("Failed to fetch user info, using fallback. Status:", xhr.status);
      user_info = FALLBACK_USER_INFO;
    }
    
    // Insert signature - determineDefaultTemplate will check for saved preferences
    console.log("About to determine template for fresh Graph API data...");
    var template = determineDefaultTemplate(user_info);
    console.log("Selected template:", template);
    insertSignatureWithTemplate(template, user_info, eventObj);
  };
  
  xhr.onerror = function() {
    console.error("Network error fetching user info, using fallback");
    var template = determineDefaultTemplate(FALLBACK_USER_INFO);
    insertSignatureWithTemplate(template, FALLBACK_USER_INFO, eventObj);
  };
  
  xhr.send();
}

/**
 * Inserts signature using the specified template
 */
function insertSignatureWithTemplate(template_name, user_info, eventObj) {
  console.log("Inserting signature with template:", template_name);
  
  var signature_info = getTemplateInfo(template_name, user_info);
  addTemplateSignature(signature_info, eventObj);
}

/**
 * Gets the appropriate template info based on template name
 */
function getTemplateInfo(template, user_info) {
  switch(template.toUpperCase()) {
    case "A":
      return get_template_A_info(user_info);
    case "B":
      return get_template_B_info(user_info);
    case "C":
      return get_template_C_info(user_info);
    default:
      return get_template_A_info(user_info);
  }
}

/**
 * Adds signature to the message/appointment
 * @param {*} signatureDetails object containing:
 *  "signature": The signature HTML of the template,
    "logoBase64": The base64 encoded logo image,
    "logoFileName": The filename of the logo image
 * @param {*} eventObj 
 */
function addTemplateSignature(signatureDetails, eventObj) {
  // Logo is now embedded directly in HTML as data URI (much faster than attachment)
  // Simply insert the signature HTML
  Office.context.mailbox.item.body.setSignatureAsync(
    signatureDetails.signature,
    {
      coercionType: "html",
      asyncContext: eventObj,
    },
    function (asyncResult) {
      console.log("✓ Signature inserted successfully");
      asyncResult.asyncContext.completed();
    }
  );
}

/**
 * Gets HTML string for template A
 * Lilly branded signature with logo
 * @param {*} user_info Information details about the user
 * @returns Object containing:
 *  "signature": The signature HTML of template A,
    "logoBase64": The base64 encoded logo image,
    "logoFileName": The filename of the logo image
 */
function get_template_A_info(user_info) {
  const logoFileName = "lilly-logo.png";
  let str = "";
  
  str += "<div style='font-family: Arial, sans-serif; color: #212121;'>";
  
  // Name with pronouns (10pt)
  str += "<b><span style='font-size:10pt;'>" + (user_info.name || '');
  if (is_valid_data(user_info.pronoun)) {
    str += " <span style='font-style: italic; font-weight: normal;'>(" + user_info.pronoun + ")</span>";
  }
  str += "</span></b><br>";
  
  // Pronunciation (9pt) - only if exists
  if (is_valid_data(user_info.pronunciation)) {
    str += "<span style='font-size:9pt;font-style:italic;'>pronounced: " + user_info.pronunciation + "</span><br>";
  }
  
  // Add blank line after name/pronunciation section
  str += "<br>";
  
  // Title and Department (9pt)
  let titleParts = [];
  if (is_valid_data(user_info.jobTitle)) titleParts.push(user_info.jobTitle);
  if (is_valid_data(user_info.department)) titleParts.push(user_info.department);
  if (titleParts.length > 0) {
    str += "<span style='font-size:9pt;'>" + titleParts.join(", ") + "</span><br>";
  }
  
  // Phone numbers (9pt)
  let phones = [];
  if (is_valid_data(user_info.officePhone)) {
    phones.push(format_phone_number(user_info.officePhone) + " (office)");
  }
  if (is_valid_data(user_info.mobilePhone)) {
    phones.push(format_phone_number(user_info.mobilePhone) + " (mobile)");
  }
  if (phones.length > 0) {
    str += "<span style='font-size:9pt;'>" + phones.join(" | ") + "</span><br>";
  }
  
  // Email (9pt)
  str += "<a href='mailto:" + (user_info.email || '') + "'><span style='font-size:9pt;color:#0078a3;'>" + (user_info.email || '') + "</span></a><br><br>";
  
  // Logo using cid: reference (will be attached)
  str += "<img src='data:image/png;base64,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' width='250' height='auto' alt='Eli Lilly and Company' style='width: 250px; height: auto;' /><br><br>";
  
  // Company info - BLACK text for logo templates (9pt)
  str += "<b><span style='font-size:9pt;color:#212121;'>Eli Lilly and Company</span></b><br>";
  
  // Location - use mapped location if available, otherwise use raw officeLocation or default
  const mappedLocation = getLocationFromCode(user_info.officeLocation);
  if (mappedLocation) {
    str += "<span style='font-size:9pt;'>" + mappedLocation + "</span><br>";
  } else if (is_valid_data(user_info.officeLocation)) {
    str += "<span style='font-size:9pt;'>" + user_info.officeLocation + "</span><br>";
  } else {
    str += "<span style='font-size:9pt;'>Lilly Corporate Center, Indianapolis, IN 46285 USA</span><br>";
  }
  
  str += "<a href='https://www.lilly.com'><span style='font-size:9pt;color:#0078a3;'>www.lilly.com</span></a><br><br>";
  
  // Confidentiality notice (9pt)
  str += "<div style='border-top: 1px solid #E1251B; padding-top: 8px; margin-top: 8px;'>";
  str += "<span style='font-size:9pt;color:#B6B8BA;font-style:italic;'>";
  str += "CONFIDENTIALITY NOTICE: This email message (including all attachments) is for the sole use of the intended recipient(s) and may contain confidential information. Any unauthorized review, use, disclosure, copying or distribution is strictly prohibited. If you are not the intended recipient, please contact the sender by reply email and destroy all copies of the original message.";
  str += "</span></div>";
  
  str += "</div>";

  // Return with base64 logo (will be attached as inline image)
  return {
    signature: str,
    logoBase64: "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",
    logoFileName: logoFileName
  };
}

/**
 * Gets HTML string for template B
 * Lilly branded signature WITHOUT logo (text-only, red company name)
 * @param {*} user_info Information details about the user
 * @returns Object containing:
 *  "signature": The signature HTML of template B,
    "logoBase64": null since this template has no logo,
    "logoFileName": null since this template has no logo
 */
function get_template_B_info(user_info) {
  let str = "";
  
  str += "<div style='font-family: Arial, sans-serif; color: #212121;'>";
  
  // Name with pronouns (10pt)
  str += "<b><span style='font-size:10pt;'>" + (user_info.name || '');
  if (is_valid_data(user_info.pronoun)) {
    str += " <span style='font-style: italic; font-weight: normal;'>(" + user_info.pronoun + ")</span>";
  }
  str += "</span></b><br>";
  
  // Pronunciation (9pt) - only if exists
  if (is_valid_data(user_info.pronunciation)) {
    str += "<span style='font-size:9pt;font-style:italic;'>pronounced: " + user_info.pronunciation + "</span><br>";
  }
  
  // Add blank line after name/pronunciation section
  str += "<br>";
  
  // Title and Department (9pt)
  let titleParts = [];
  if (is_valid_data(user_info.jobTitle)) titleParts.push(user_info.jobTitle);
  if (is_valid_data(user_info.department)) titleParts.push(user_info.department);
  if (titleParts.length > 0) {
    str += "<span style='font-size:9pt;'>" + titleParts.join(", ") + "</span><br>";
  }
  
  // Phone numbers (9pt)
  let phones = [];
  if (is_valid_data(user_info.officePhone)) {
    phones.push(format_phone_number(user_info.officePhone) + " (office)");
  }
  if (is_valid_data(user_info.mobilePhone)) {
    phones.push(format_phone_number(user_info.mobilePhone) + " (mobile)");
  }
  if (phones.length > 0) {
    str += "<span style='font-size:9pt;'>" + phones.join(" | ") + "</span><br>";
  }
  
  // Email (9pt)
  str += "<a href='mailto:" + (user_info.email || '') + "'><span style='font-size:9pt;color:#0078a3;'>" + (user_info.email || '') + "</span></a><br><br>";
  
  // Company info - RED text for non-logo templates (9pt)
  str += "<b><span style='font-size:9pt;color:#E1251B;'>Eli Lilly and Company</span></b><br>";
  
  // Location - use mapped location if available, otherwise use raw officeLocation or default
  const mappedLocationB = getLocationFromCode(user_info.officeLocation);
  if (mappedLocationB) {
    str += "<span style='font-size:9pt;'>" + mappedLocationB + "</span><br>";
  } else if (is_valid_data(user_info.officeLocation)) {
    str += "<span style='font-size:9pt;'>" + user_info.officeLocation + "</span><br>";
  } else {
    str += "<span style='font-size:9pt;'>Lilly Corporate Center, Indianapolis, IN 46285 USA</span><br>";
  }
  
  str += "<a href='https://www.lilly.com'><span style='font-size:9pt;color:#0078a3;'>www.lilly.com</span></a><br><br>";
  
  // Confidentiality notice (9pt)
  str += "<div style='border-top: 1px solid #E1251B; padding-top: 8px; margin-top: 8px;'>";
  str += "<span style='font-size:9pt;color:#B6B8BA;font-style:italic;'>";
  str += "CONFIDENTIALITY NOTICE: This email message (including all attachments) is for the sole use of the intended recipient(s) and may contain confidential information. Any unauthorized review, use, disclosure, copying or distribution is strictly prohibited. If you are not the intended recipient, please contact the sender by reply email and destroy all copies of the original message.";
  str += "</span></div>";
  
  str += "</div>";

  return {
    signature: str,
    logoBase64: null,
    logoFileName: null,
  };
}

/**
 * Gets HTML string for template C
 * Contractor signature (no Lilly logo, shows contractor employer info)
 * @param {*} user_info Information details about the user
 * @returns Object containing:
 *  "signature": The signature HTML of template C,
    "logoBase64": null since there is no logo,
    "logoFileName": null since there is no logo
 */
function get_template_C_info(user_info) {
  let str = "";
  
  str += "<div style='font-family: Arial, sans-serif; color: #212121;'>";
  
  // Name with pronouns (10pt)
  str += "<b><span style='font-size:10pt;'>" + (user_info.name || '');
  if (is_valid_data(user_info.pronoun)) {
    str += " <span style='font-style: italic; font-weight: normal;'>(" + user_info.pronoun + ")</span>";
  }
  str += "</span></b><br>";
  
  // Pronunciation (9pt) - only if exists
  if (is_valid_data(user_info.pronunciation)) {
    str += "<span style='font-size:9pt;font-style:italic;'>pronounced: " + user_info.pronunciation + "</span><br>";
  }
  
  // Add blank line after name/pronunciation
  str += "<br>";
  
  // Title, Functional Area, and Department (9pt)
  let titleParts = [];
  if (is_valid_data(user_info.jobTitle)) titleParts.push(user_info.jobTitle);
  if (is_valid_data(user_info.functionalArea)) titleParts.push(user_info.functionalArea);
  if (is_valid_data(user_info.department)) titleParts.push(user_info.department);
  if (titleParts.length > 0) {
    str += "<span style='font-size:9pt;'>" + titleParts.join(", ") + "</span><br>";
  }
  
  // Contractor status (9pt)
  str += "<span style='font-size:9pt;'>Contractor for Eli Lilly and Company</span><br>";
  
  // Phone numbers (9pt)
  let phones = [];
  if (is_valid_data(user_info.officePhone)) {
    phones.push(format_phone_number(user_info.officePhone) + " (office)");
  }
  if (is_valid_data(user_info.mobilePhone)) {
    phones.push(format_phone_number(user_info.mobilePhone) + " (mobile)");
  }
  if (phones.length > 0) {
    str += "<span style='font-size:9pt;'>" + phones.join(" | ") + "</span><br>";
  }
  
  // Email (9pt)
  str += "<a href='mailto:" + (user_info.email || '') + "'><span style='font-size:9pt;color:#0078a3;'>" + (user_info.email || '') + "</span></a><br><br>";
  
  // Employer company name (9pt)
  if (is_valid_data(user_info.functionalArea)) {
    str += "<b><span style='font-size:9pt;'>" + user_info.functionalArea + "</span></b><br>";
  }
  
  // Company website (9pt) - if provided
  if (is_valid_data(user_info.companyWebsite)) {
    str += "<a href='https://" + user_info.companyWebsite + "' target='_blank'><span style='font-size:9pt;color:#0078a3;'>" + user_info.companyWebsite + "</span></a><br>";
  }
  
  str += "<br>";
  
  // Confidentiality notice (9pt)
  str += "<div style='border-top: 1px solid #E1251B; padding-top: 8px; margin-top: 8px;'>";
  str += "<span style='font-size:9pt;color:#B6B8BA;font-style:italic;'>";
  str += "CONFIDENTIALITY NOTICE: This email message (including all attachments) is for the sole use of the intended recipient(s) and may contain confidential information. Any unauthorized review, use, disclosure, copying or distribution is strictly prohibited. If you are not the intended recipient, please contact the sender by reply email and destroy all copies of the original message.";
  str += "</span></div>";
  
  str += "</div>";

  return {
    signature: str,
    logoBase64: null,
    logoFileName: null,
  };
}

/**
 * Formats phone numbers - adds dots for North American (+1) numbers
 * @param {*} phone Phone number from Graph API
 * @returns Formatted phone number
 */
function format_phone_number(phone) {
  if (!is_valid_data(phone)) return "";
  
  // Remove spaces, dashes, parentheses for parsing
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's North American (+1)
  let match = cleaned.match(/^(\+1)(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    // Format North American numbers as +1 XXX.XXX.XXXX
    return match[1] + ' ' + match[2] + '.' + match[3] + '.' + match[4];
  }
  
  // For any other country code, return the original from Graph API unchanged
  return phone;
}

/**
 * Validates if str parameter contains text.
 * @param {*} str String to validate
 * @returns true if string is valid; otherwise, false.
 */
function is_valid_data(str) {
  return str !== null && str !== undefined && str !== "";
}

// Log version info on load
console.log("═══════════════════════════════════════════════════");
console.log("Lilly Signature Add-in - Auto-Run Module");
console.log("Version:", ADDIN_VERSION);
console.log("Last Updated:", LAST_UPDATED);
console.log("═══════════════════════════════════════════════════");

// Only associate if not already associated (prevents duplicate registration)
try {
  console.log("🔧 Attempting to register autorun action 'checkSignature'...");
  Office.actions.associate("checkSignature", checkSignature);
  console.log("✅ Autorun action 'checkSignature' registered successfully!");
  console.log("   Autorun will trigger on new message compose events.");
} catch(e) {
  console.log("⚠️ checkSignature already registered (this is OK):", e.message);
}
