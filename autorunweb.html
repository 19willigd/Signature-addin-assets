require('dotenv').config();

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

const TENANT_ID = process.env.TENANT_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Track unique company names we've seen
const companyNamesTracker = new Set();
const companyNameLog = [];

console.log('\n╔════════════════════════════════════════════╗');
console.log('║      Graph API Server Starting...         ║');
console.log('╚════════════════════════════════════════════╝');
console.log('\n=== Environment Check ===');
console.log('Time:', new Date().toISOString());
console.log('TENANT_ID:', TENANT_ID ? '✓ Loaded' : '✗ Missing');
console.log('CLIENT_ID:', CLIENT_ID ? '✓ Loaded' : '✗ Missing');
console.log('CLIENT_SECRET:', CLIENT_SECRET ? '✓ Loaded' : '✗ Missing');
console.log('PORT:', PORT);
console.log('NODE_ENV:', NODE_ENV);
console.log('========================\n');

if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
  console.error('╔════════════════════════════════════════════╗');
  console.error('║           CONFIGURATION ERROR              ║');
  console.error('╚════════════════════════════════════════════╝');
  console.error('\nMissing required environment variables!');
  console.error('\nPlease ensure you have a .env file with:');
  console.error('  TENANT_ID=your-tenant-id');
  console.error('  CLIENT_ID=your-client-id');
  console.error('  CLIENT_SECRET=your-client-secret');
  console.error('\nExiting...\n');
  process.exit(1);
}

// Enable CORS with credentials support for GitHub Pages
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allowed origins list
    const allowedOrigins = [
      'https://19willigd.github.io',
      'https://lilly-signature-addin.dc.lilly.com',
      /https:\/\/.*\.office\.com$/,
      /https:\/\/.*\.office365\.com$/,
      /https:\/\/.*\.outlook\.com$/,
      /https:\/\/.*\.microsoft\.com$/,
      /https:\/\/.*\.lilly\.com$/,
      'http://localhost:3000',
      'http://localhost:3001',
      'https://localhost:3000',
      'https://localhost:3001'
    ];
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authentication
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// CRITICAL: CSP headers for Office Add-in compatibility
// These allow your add-in to be framed by all Microsoft Office applications
app.use((req, res, next) => {
  // Allow framing from all Office/Microsoft domains (PERMISSIVE for add-ins)
  // Added Microsoft authentication domains to fix "login.microsoftonline.com refused to connect"
  // Added Lilly vanity URL for users accessing via https://email.lilly.com
  // Added wildcard for potential Lilly subdomains and New Outlook variants
  // Added connect-src for New Outlook API call compatibility
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://*.office.com https://*.office365.com https://*.outlook.com https://*.outlook.office.com https://*.outlook.office365.com https://*.microsoft.com https://*.sharepoint.com https://*.officeapps.live.com https://*.microsoftonline.com https://login.microsoftonline.com https://login.microsoft.com https://device.login.microsoftonline.com https://email.lilly.com https://*.lilly.com https://outlook.live.com https://*.outlook.live.com; connect-src 'self' https://*.lilly.com https://graph.microsoft.com https://*.graph.microsoft.com https://login.microsoftonline.com");
  
  // Remove conflicting X-Frame-Options header
  res.removeHeader('X-Frame-Options');
  
  // Don't manually set CORS headers here - let the cors() middleware handle it
  
  next();
});

// 🔓 PUBLIC ROUTES - No authentication required for Classic Outlook auto-insertion
// These specific files MUST be publicly accessible for event-based activation to work
console.log('✓ Setting up PUBLIC routes for Classic Outlook compatibility...');

// Serve autorunweb.html publicly (required for event-based activation)
app.get('/autorunweb.html', (req, res) => {
  console.log('📄 PUBLIC: Serving autorunweb.html for Classic Outlook');
  const filePath = NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))
    ? path.join(__dirname, 'dist', 'autorunweb.html')
    : path.join(__dirname, 'src', 'runtime', 'HTML', 'autorunweb.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.error('❌ autorunweb.html not found at:', filePath);
    res.status(404).send('autorunweb.html not found');
  }
});

// Serve autorunshared.js publicly (required for event-based activation)
app.get('/autorunshared.js', (req, res) => {
  console.log('📄 PUBLIC: Serving autorunshared.js for Classic Outlook');
  const filePath = NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))
    ? path.join(__dirname, 'dist', 'autorunshared.js')
    : path.join(__dirname, 'src', 'runtime', 'Js', 'autorunshared.js');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.error('❌ autorunshared.js not found at:', filePath);
    res.status(404).send('autorunshared.js not found');
  }
});

// Serve quick_insert.html publicly (required for button commands)
app.get('/quick_insert.html', (req, res) => {
  console.log('📄 PUBLIC: Serving quick_insert.html for Classic Outlook');
  const filePath = NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))
    ? path.join(__dirname, 'dist', 'quick_insert.html')
    : path.join(__dirname, 'src', 'runtime', 'HTML', 'quick_insert.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.error('❌ quick_insert.html not found at:', filePath);
    res.status(404).send('quick_insert.html not found');
  }
});

console.log('✓ PUBLIC routes configured - Classic Outlook can now access runtime files');

// ⚠️ CRITICAL: Serve static files
// In production/Docker: serve from dist/ (webpack compiled)
// In development: serve from src/ (original files)
const distPath = path.join(__dirname, 'dist');
const srcPath = path.join(__dirname, 'src');

if (NODE_ENV === 'production' && fs.existsSync(distPath)) {
  console.log('✓ Production mode - serving from dist/');
  app.use(express.static(distPath));
  console.log('  Static files: /app/dist\n');
} else if (fs.existsSync(srcPath)) {
  console.log('✓ Development mode - serving from src/');
  app.use('/src/taskpane/HTML', express.static(path.join(__dirname, 'src/taskpane/HTML')));
  app.use('/src/taskpane/Js', express.static(path.join(__dirname, 'src/taskpane/Js')));
  app.use('/src/taskpane/CSS', express.static(path.join(__dirname, 'src/taskpane/CSS')));
  app.use('/src/runtime/HTML', express.static(path.join(__dirname, 'src/runtime/HTML')));
  app.use('/src/runtime/Js', express.static(path.join(__dirname, 'src/runtime/Js')));
  app.use('/assets', express.static(path.join(__dirname, 'assets')));
  
  // Serve directly (for /editsignature.html to work)
  app.use(express.static(path.join(__dirname, 'src/taskpane/HTML')));
  app.use(express.static(path.join(__dirname, 'src/taskpane/Js')));
  app.use(express.static(path.join(__dirname, 'src/taskpane/CSS')));
  app.use(express.static(path.join(__dirname, 'src/runtime/HTML')));
  app.use(express.static(path.join(__dirname, 'src/runtime/Js')));
  app.use(express.static(path.join(__dirname, 'assets')));
  app.use(express.static(__dirname));
  
  // Route aliases for development (so /CSS/file.css maps to src/taskpane/CSS/file.css)
  app.use('/CSS', express.static(path.join(__dirname, 'src/taskpane/CSS')));
  app.use('/Js', express.static(path.join(__dirname, 'src/taskpane/Js')));
  app.use(express.static(path.join(__dirname, 'src')));

  
  console.log('  - src/taskpane/HTML/');
  console.log('  - src/taskpane/Js/');
  console.log('  - src/runtime/\n');
} else {
  console.error('✗ ERROR: Neither dist/ nor src/ directories found!');
  console.error('  Looking in:', __dirname);
  process.exit(1);
}

// Middleware to log all incoming requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  if (Object.keys(req.query).length > 0) {
    console.log('Query params:', req.query);
  }
  next();
});

// ═════════════════════════════════════════════════════════════════════
// OFFICE.JS SSO AUTHENTICATION ENDPOINTS
// ═════════════════════════════════════════════════════════════════════

/**
 * Exchange Office.js SSO token for Graph API access token using OBO flow
 * POST /auth/token
 * 
 * This implements the On-Behalf-Of (OBO) flow:
 * 1. Receive Microsoft-signed JWT from Office.js client
 * 2. Validate the token
 * 3. Exchange it for a Graph API access token using Azure AD
 * 4. Return the Graph token to client for API calls
 * 
 * This allows Classic Outlook to authenticate WITHOUT cookies/Bouncer!
 */
app.post('/auth/token', express.json(), async (req, res) => {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║       OFFICE.JS SSO TOKEN EXCHANGE         ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('Timestamp:', new Date().toISOString());
  
  try {
    // Get Office.js token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No Authorization header found');
      return res.status(401).json({ error: 'Missing authorization header' });
    }
    
    const officeToken = authHeader.substring(7); // Remove "Bearer "
    console.log('✓ Office.js token received (length:', officeToken.length, ')');
    
    // Decode token to see claims (for debugging)
    try {
      const tokenParts = officeToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log('Token claims:');
        console.log('  - Email:', payload.preferred_username || payload.upn || payload.email);
        console.log('  - Name:', payload.name);
        console.log('  - Tenant:', payload.tid);
        console.log('  - Audience:', payload.aud);
        console.log('  - Issuer:', payload.iss);
        console.log('  - Expires:', new Date(payload.exp * 1000).toISOString());
      }
    } catch (decodeError) {
      console.warn('⚠️  Could not decode token for logging (not a problem):', decodeError.message);
    }
    
    // Exchange token using On-Behalf-Of flow
    console.log('🔄 Exchanging token via OBO flow...');
    
    const tokenEndpoint = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      assertion: officeToken,
      requested_token_use: 'on_behalf_of',
      scope: 'https://graph.microsoft.com/User.Read https://graph.microsoft.com/User.ReadBasic.All'
    });
    
    console.log('Calling Azure AD token endpoint:', tokenEndpoint);
    
    const response = await axios.post(tokenEndpoint, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    if (response.data && response.data.access_token) {
      console.log('✓ OBO token exchange successful!');
      console.log('  - Token type:', response.data.token_type);
      console.log('  - Expires in:', response.data.expires_in, 'seconds');
      console.log('  - Scope:', response.data.scope);
      
      // Return the access token to client
      res.json({
        access_token: response.data.access_token,
        token_type: response.data.token_type,
        expires_in: response.data.expires_in
      });
      
      console.log('✓ Token sent to client successfully');
      console.log('═══════════════════════════════════════════\n');
    } else {
      console.error('❌ No access token in response from Azure AD');
      res.status(500).json({ error: 'Token exchange failed - no access token received' });
    }
    
  } catch (error) {
    console.error('\n❌ TOKEN EXCHANGE ERROR:');
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
      
      // Provide helpful error messages
      if (error.response.data.error === 'invalid_grant') {
        console.error('\n🔍 Common causes:');
        console.error('  • Office.js token expired');
        console.error('  • Token audience mismatch (check WebApplicationInfo in manifest)');
        console.error('  • User not consented to required scopes');
        console.error('  • Token signature invalid\n');
      }
      
      res.status(error.response.status).json({
        error: error.response.data.error || 'Token exchange failed',
        error_description: error.response.data.error_description,
        details: 'See server logs for more information'
      });
    } else {
      console.error('Stack:', error.stack);
      res.status(500).json({ 
        error: 'Token exchange failed',
        message: error.message 
      });
    }
    
    console.error('═══════════════════════════════════════════\n');
  }
});

/**
 * Middleware to validate Bearer tokens in API requests
 * Use this for all protected endpoints after SSO is enabled
 */
function validateBearerToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  // Allow requests without auth for backward compatibility
  // (Remove this after all clients migrate to SSO)
  if (!authHeader) {
    console.log('⚠️  No Authorization header - allowing for backward compatibility');
    return next();
  }
  
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Invalid authorization header format' });
  }
  
  const token = authHeader.substring(7);
  
  // Decode token to extract user info (basic validation)
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    
    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    // Attach user info to request
    req.user = {
      email: payload.preferred_username || payload.upn || payload.email,
      name: payload.name,
      oid: payload.oid // Object ID in Azure AD
    };
    
    console.log('✓ Bearer token validated for:', req.user.email);
    next();
    
  } catch (error) {
    console.error('❌ Token validation failed:', error.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Health check endpoint (required for Kubernetes)
app.get('/health', (req, res) => {
  console.log('✓ Health check requested - Server is healthy');
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV
  });
});

// Version check endpoint - quickly see if your deployment is live
app.get('/version', (req, res) => {
  const packageJson = require('./package.json');
  res.status(200).json({
    name: 'Lilly Signature Add-in API',
    version: '1.1.0', // Update this with each deployment
    lastUpdated: '2025-11-06',
    packageVersion: packageJson.version,
    environment: NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Serve version.html for deployment status checking
app.get('/version.html', (req, res) => {
  console.log('📄 PUBLIC: Serving version.html for deployment status check');
  const filePath = NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))
    ? path.join(__dirname, 'dist', 'version.html')
    : path.join(__dirname, 'src', 'version.html');
  
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.error('❌ version.html not found at:', filePath);
    res.status(404).send('version.html not found');
  }
});

// Contractor company names tracking endpoint
app.get('/api/contractor-companies', (req, res) => {
  console.log('📊 Contractor companies list requested');
  res.status(200).json({
    total: companyNamesTracker.size,
    companies: Array.from(companyNamesTracker).sort(),
    detailedLog: companyNameLog,
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to help troubleshoot vanity URL issues
app.get('/api/debug-headers', (req, res) => {
  console.log('\n🔍 DEBUG HEADERS REQUEST');
  console.log('Timestamp:', new Date().toISOString());
  console.log('Request headers:', JSON.stringify(req.headers, null, 2));
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    requestUrl: req.url,
    method: req.method,
    headers: req.headers,
    userAgent: req.headers['user-agent'],
    referer: req.headers.referer,
    origin: req.headers.origin,
    host: req.headers.host,
    xForwardedFor: req.headers['x-forwarded-for'],
    xForwardedProto: req.headers['x-forwarded-proto'],
    xForwardedHost: req.headers['x-forwarded-host'],
    // Check for Office/Outlook specific headers
    officeVersion: req.headers['office-version'],
    outlookVersion: req.headers['outlook-version'],
    // Common vanity URL identifiers
    vanityUrlDetected: req.headers.referer?.includes('email.lilly.com') || req.headers.origin?.includes('email.lilly.com'),
    newOutlookDetected: req.headers['user-agent']?.includes('OutlookWebApp') || req.headers.referer?.includes('outlook.live.com'),
    query: req.query
  };
  
  console.log('Vanity URL detected:', debugInfo.vanityUrlDetected);
  console.log('New Outlook detected:', debugInfo.newOutlookDetected);
  console.log('═══════════════════════════════════════════\n');
  
  res.json(debugInfo);
});

// User environment diagnostic endpoint
app.get('/api/diagnose', (req, res) => {
  console.log('\n🩺 USER ENVIRONMENT DIAGNOSIS');
  console.log('Timestamp:', new Date().toISOString());
  
  const diagnosis = {
    timestamp: new Date().toISOString(),
    request: {
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer,
      origin: req.headers.origin,
      host: req.headers.host,
      acceptLanguage: req.headers['accept-language'],
      acceptEncoding: req.headers['accept-encoding']
    },
    environment: {
      // Detect Outlook version
      isNewOutlook: req.headers['user-agent']?.includes('OutlookWebApp') || req.headers.referer?.includes('outlook.live.com'),
      isClassicOutlook: req.headers.referer?.includes('outlook.office365.com') || req.headers.referer?.includes('outlook.office.com'),
      isVanityUrl: req.headers.referer?.includes('email.lilly.com'),
      isMobile: /Mobile|Android|iPhone|iPad/.test(req.headers['user-agent']),
      isDesktopOutlook: req.headers['user-agent']?.includes('Office') && !req.headers['user-agent']?.includes('Web'),
      
      // Browser detection
      browser: req.headers['user-agent']?.includes('Chrome') ? 'Chrome' : 
               req.headers['user-agent']?.includes('Firefox') ? 'Firefox' :
               req.headers['user-agent']?.includes('Safari') ? 'Safari' :
               req.headers['user-agent']?.includes('Edge') ? 'Edge' : 'Unknown'
    },
    issues: {
      likelyPopupBlocking: req.headers['user-agent']?.includes('Chrome') && req.headers.referer?.includes('outlook'),
      newOutlookCspIssue: req.headers['user-agent']?.includes('OutlookWebApp'),
      vanityUrlIssue: req.headers.referer?.includes('email.lilly.com')
    },
    recommendations: []
  };
  
  // Add specific recommendations based on detected environment
  if (diagnosis.environment.isNewOutlook) {
    diagnosis.recommendations.push('User is on New Outlook - CSP restrictions likely');
    diagnosis.recommendations.push('Suggest switching to Classic Outlook for better compatibility');
  }
  
  if (diagnosis.environment.isVanityUrl) {
    diagnosis.recommendations.push('User accessing via vanity URL - may have different policies');
  }
  
  if (diagnosis.issues.likelyPopupBlocking) {
    diagnosis.recommendations.push('Chrome popup blocking likely - user needs to allow popups');
  }
  
  console.log('Environment detected:', diagnosis.environment);
  console.log('Potential issues:', diagnosis.issues);
  console.log('Recommendations:', diagnosis.recommendations);
  console.log('═══════════════════════════════════════════\n');
  
  res.json(diagnosis);
});

// Authentication helper page for Office add-ins
app.get('/auth', (req, res) => {
  console.log('🔐 Authentication helper page requested');
  const redirectUri = req.query.redirect_uri || '/editsignature.html';
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Office Add-in Authentication</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background: #f3f2f1;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
            }
            .auth-container {
                background: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                max-width: 500px;
                width: 100%;
                text-align: center;
            }
            .logo {
                width: 64px;
                height: 64px;
                background: #E1251B;
                border-radius: 50%;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                font-weight: bold;
            }
            h1 {
                color: #323130;
                margin-bottom: 10px;
                font-size: 24px;
            }
            p {
                color: #605e5c;
                margin-bottom: 30px;
                line-height: 1.4;
            }
            .auth-btn {
                background: #0078d4;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 4px;
                font-size: 16px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                transition: background 0.2s;
            }
            .auth-btn:hover {
                background: #106ebe;
            }
            .spinner {
                border: 3px solid #f3f3f3;
                border-top: 3px solid #0078d4;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                animation: spin 1s linear infinite;
                margin: 20px auto;
                display: none;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            .status {
                margin-top: 20px;
                padding: 10px;
                border-radius: 4px;
                display: none;
            }
            .status.success {
                background: #dff6dd;
                color: #107c10;
                border: 1px solid #107c10;
            }
            .status.error {
                background: #fde7e9;
                color: #a4262c;
                border: 1px solid #a4262c;
            }
        </style>
    </head>
    <body>
        <div class="auth-container">
            <div class="logo">L</div>
            <h1>Authentication Required</h1>
            <p>To use the Lilly Signature Manager, please authenticate with your Microsoft account.</p>
            
            <button class="auth-btn" onclick="startAuth()">
                Sign in with Microsoft
            </button>
            
            <div class="spinner" id="spinner"></div>
            <div class="status" id="status"></div>
        </div>

        <script>
            function startAuth() {
                console.log('Starting authentication...');
                
                // Show loading
                document.querySelector('.auth-btn').style.display = 'none';
                document.getElementById('spinner').style.display = 'block';
                
                // For Office add-ins, we need to use Office.js auth or open in new window
                if (window.Office) {
                    // Office.js environment - use proper Office authentication
                    Office.auth.getAccessToken({
                        allowSignInPrompt: true,
                        allowConsentPrompt: true,
                        forMSGraphAccess: true
                    }).then(function(token) {
                        console.log('Office.js token obtained');
                        showSuccess('Authentication successful! Redirecting...');
                        setTimeout(() => {
                            window.location.href = '${redirectUri}';
                        }, 2000);
                    }).catch(function(error) {
                        console.error('Office.js auth failed:', error);
                        // Fallback to popup
                        openAuthPopup();
                    });
                } else {
                    // Not in Office environment - use popup
                    openAuthPopup();
                }
            }
            
            function openAuthPopup() {
                const authUrl = 'https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?' +
                    'client_id=${CLIENT_ID}&' +
                    'response_type=code&' +
                    'redirect_uri=' + encodeURIComponent(window.location.origin + '/oauth2/idpresponse') + '&' +
                    'scope=openid profile email&' +
                    'state=' + Math.random().toString(36).substring(7);
                
                // Open popup with proper dimensions
                const popup = window.open(
                    authUrl,
                    'authPopup',
                    'width=600,height=700,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,directories=no,status=no'
                );
                
                if (!popup) {
                    showError('Popup blocked. Please allow popups for this site and try again.');
                    return;
                }
                
                // Monitor popup
                const checkClosed = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkClosed);
                        showError('Authentication cancelled or failed.');
                        resetUI();
                    }
                }, 1000);
                
                // Listen for messages from popup
                window.addEventListener('message', function(event) {
                    if (event.origin !== window.location.origin) return;
                    
                    clearInterval(checkClosed);
                    popup.close();
                    
                    if (event.data.success) {
                        showSuccess('Authentication successful! Redirecting...');
                        setTimeout(() => {
                            window.location.href = '${redirectUri}';
                        }, 2000);
                    } else {
                        showError('Authentication failed: ' + event.data.error);
                        resetUI();
                    }
                });
            }
            
            function showSuccess(message) {
                const status = document.getElementById('status');
                status.className = 'status success';
                status.textContent = message;
                status.style.display = 'block';
                document.getElementById('spinner').style.display = 'none';
            }
            
            function showError(message) {
                const status = document.getElementById('status');
                status.className = 'status error';
                status.textContent = message;
                status.style.display = 'block';
                document.getElementById('spinner').style.display = 'none';
            }
            
            function resetUI() {
                document.querySelector('.auth-btn').style.display = 'inline-block';
                document.getElementById('spinner').style.display = 'none';
            }
        </script>
        
        <!-- Load Office.js if available -->
        <script src="https://appsforoffice.microsoft.com/lib/1/hosted/office.js"></script>
    </body>
    </html>
  `);
});


/**
 * Gets OAuth access token from Microsoft
 */
async function getToken() {
  console.log('\n--- Authenticating with Microsoft ---');
  console.log('Tenant ID:', TENANT_ID);
  
  try {
    const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
    console.log('Token endpoint:', tokenUrl);
    console.log('Requesting token...');
    
    const res = await axios.post(
      tokenUrl,
      new URLSearchParams({
        client_id: CLIENT_ID,
        scope: 'https://graph.microsoft.com/.default',
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials',
      }),
      { 
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded' 
        } 
      }
    );
    
    console.log('✓ Access token obtained successfully');
    console.log('Token expires in:', res.data.expires_in, 'seconds');
    console.log('-------------------------------------');
    
    return res.data.access_token;
  } catch (error) {
    console.error('\n╔════════════════════════════════════════════╗');
    console.error('║        AUTHENTICATION ERROR                ║');
    console.error('╚════════════════════════════════════════════╝');
    console.error('\nFailed to get access token from Microsoft');
    console.error('Status:', error.response?.status);
    console.error('Error Code:', error.response?.data?.error);
    console.error('Description:', error.response?.data?.error_description);
    console.error('\nCommon causes:');
    console.error('  • Invalid CLIENT_ID or CLIENT_SECRET');
    console.error('  • Invalid TENANT_ID');
    console.error('  • App registration not properly configured');
    console.error('  • Missing API permissions in Azure');
    console.error('-------------------------------------\n');
    throw error;
  }
}

/**
 * Fetches user data from Microsoft Graph API
 */
async function getUserData(token, userEmail) {
  console.log('\n--- Fetching User Data from Microsoft Graph ---');
  console.log('User email:', userEmail);
  
  try {
    let graphUrl = `https://graph.microsoft.com/v1.0/users/${userEmail}?$select=displayName,jobTitle,department,mail,country,mobilePhone,businessPhones,officeLocation,userPrincipalName,companyName`;
    console.log('Graph API endpoint:', graphUrl);
    console.log('Sending request...');
    
    let res;
    try {
      res = await axios.get(graphUrl, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
    } catch (firstError) {
      // If first query fails (404), try searching by mail property
      if (firstError.response?.status === 404) {
        console.log('⚠️  User not found by email, trying mail property search...');
        const searchUrl = `https://graph.microsoft.com/v1.0/users?$filter=mail eq '${userEmail}'&$select=displayName,jobTitle,department,mail,country,mobilePhone,businessPhones,officeLocation,userPrincipalName,companyName`;
        console.log('Search endpoint:', searchUrl);
        
        const searchRes = await axios.get(searchUrl, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        if (searchRes.data.value && searchRes.data.value.length > 0) {
          console.log('✓ Found user via mail property search');
          res = { data: searchRes.data.value[0] };
        } else {
          throw firstError; // Re-throw original error if search also fails
        }
      } else {
        throw firstError;
      }
    }
    
    console.log('✓ User data retrieved successfully');
    console.log('\n--- User Details ---');
    console.log('Display Name:', res.data.displayName);
    console.log('Email:', res.data.mail || res.data.userPrincipalName);
    console.log('Job Title:', res.data.jobTitle || '(not set)');
    console.log('Department:', res.data.department || '(not set)');
    console.log('Company:', res.data.companyName || '(not set)');
    console.log('Mobile Phone:', res.data.mobilePhone || '(not set)');
    console.log('Business Phones:', res.data.businessPhones?.join(', ') || '(not set)');
    console.log('Office Location:', res.data.officeLocation || '(not set)');
    console.log('Country:', res.data.country || '(not set)');
    console.log('-------------------\n');
    
    // Track company names for contractor mapping
    if (res.data.companyName && res.data.companyName.trim() !== '') {
      if (!companyNamesTracker.has(res.data.companyName)) {
        companyNamesTracker.add(res.data.companyName);
        companyNameLog.push({
          companyName: res.data.companyName,
          firstSeenEmail: userEmail,
          firstSeenDate: new Date().toISOString()
        });
        console.log('🆕 NEW CONTRACTOR COMPANY DETECTED:', res.data.companyName);
      }
    }
    
    return res.data;
  } catch (error) {
    console.error('\n╔════════════════════════════════════════════╗');
    console.error('║         GRAPH API ERROR                    ║');
    console.error('╚════════════════════════════════════════════╝');
    console.error('\nFailed to fetch user data from Microsoft Graph');
    console.error('Status:', error.response?.status);
    console.error('Error:', error.response?.data?.error?.code);
    console.error('Message:', error.response?.data?.error?.message);
    console.error('\nCommon causes:');
    console.error('  • User email not found in directory');
    console.error('  • Insufficient permissions (need User.Read.All)');
    console.error('  • Token expired or invalid');
    console.error('-------------------------------------\n');
    throw error;
  }
}

/**
 * Fetches user data using Bearer token from SSO (no client credentials needed)
 * Used when client sends their own Graph API token
 */
async function getUserDataWithToken(graphToken, userEmail) {
  console.log('\n--- Fetching User Data with Bearer Token (SSO) ---');
  console.log('User email:', userEmail);
  
  // Use the token directly - it's already a Graph API access token from OBO flow
  return await getUserData(graphToken, userEmail);
}

/**
 * Main endpoint - returns user signature data
 * GET /signature?email=user@domain.com
 * 
 * Supports both authentication methods:
 * 1. Bearer token (SSO) - Authorization: Bearer <token>
 * 2. Cookie-based (Bouncer) - for backward compatibility
 */
app.get('/signature', validateBearerToken, async (req, res) => {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║       SIGNATURE REQUEST RECEIVED           ║');
  console.log('╚════════════════════════════════════════════╝');
  
  try {
    const userEmail = req.query.email;
    
    if (!userEmail) {
      console.log('✗ Missing email parameter');
      return res.status(400).json({ 
        error: 'Missing email query parameter',
        usage: '/signature?email=user@domain.com'
      });
    }

    console.log('Processing request for:', userEmail);
    
    // Check authentication method
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      console.log('✓ Using SSO Bearer token authentication');
      
      // Extract token from header (already validated by middleware)
      const graphToken = authHeader.substring(7);
      
      // Step 1: Fetch user data with provided token
      console.log('\nFetching user data with Bearer token...');
      const user = await getUserDataWithToken(graphToken, userEmail);
      
      console.log('✓ Request completed successfully (SSO)\n');
      console.log('═══════════════════════════════════════════\n');
      
      return res.json(user);
      
    } else {
      console.log('⚠️  Using legacy cookie-based authentication (backward compatibility)');
      
      // Step 1: Get access token using client credentials (old method)
      console.log('\nStep 1/2: Authenticating with client credentials...');
      const token = await getToken();

      // Step 2: Fetch user data
      console.log('\nStep 2/2: Fetching user data...');
      const user = await getUserData(token, userEmail);

      console.log('✓ Request completed successfully (legacy)\n');
      console.log('═══════════════════════════════════════════\n');

      return res.json(user);
    }

  } catch (error) {
    console.error('✗ Request failed\n');
    console.error('═══════════════════════════════════════════\n');
    
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch user data',
      details: error.response?.data?.error?.message || error.message,
    });
  }
});

/**
 * Alternative endpoint for compatibility
 * GET /api/user/:email
 */
app.get('/api/user/:email', async (req, res) => {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║       USER DATA REQUEST RECEIVED           ║');
  console.log('╚════════════════════════════════════════════╝');
  
  const { email } = req.params;
  
  if (!email) {
    console.log('✗ No email provided');
    return res.status(400).json({ error: 'Email parameter is required' });
  }

  try {
    console.log('Processing request for:', email);

    console.log('\nStep 1/2: Getting access token...');
    const token = await getToken();

    console.log('\nStep 2/2: Fetching user data from Microsoft Graph...');
    const user = await getUserData(token, email);

    console.log('✓ Request completed successfully\n');
    console.log('═══════════════════════════════════════════\n');
    
    res.json(user);
    
  } catch (error) {
    console.error('✗ Request failed\n');
    console.error('═══════════════════════════════════════════\n');
    
    res.status(error.response?.status || 500).json({
      error: 'Failed to fetch user data',
      details: error.response?.data || error.message,
    });
  }
});

/**
 * OAuth callback handler (for Bouncer authentication)
 * This handles the redirect after Microsoft/Bouncer authentication
 */
app.get('/oauth2/idpresponse', (req, res) => {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║       OAUTH CALLBACK DEBUG INFO            ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('✓ OAuth callback received from Bouncer');
  console.log('Timestamp:', new Date().toISOString());
  console.log('\n--- Request Details ---');
  console.log('URL:', req.url);
  console.log('Query parameters:', JSON.stringify(req.query, null, 2));
  console.log('User-Agent:', req.headers['user-agent']);
  console.log('Referer:', req.headers.referer);
  console.log('X-Forwarded-For:', req.headers['x-forwarded-for']);
  console.log('All Headers:', JSON.stringify(req.headers, null, 2));
  console.log('═══════════════════════════════════════════\n');
  
  // Check for authentication errors
  if (req.query.error) {
    console.error('\n❌ OAUTH ERROR DETECTED:');
    console.error('Error Code:', req.query.error);
    console.error('Error Description:', req.query.error_description);
    console.error('State:', req.query.state);
    console.error('Session State:', req.query.session_state);
    console.error('\n🔍 Common AADSTS90014 causes:');
    console.error('  • Missing PKCE parameters (code_challenge/code_verifier)');
    console.error('  • Invalid redirect_uri in Azure app registration');
    console.error('  • Mobile app not configured in Azure AD');
    console.error('  • Missing mobile platform configuration\n');
    
    // Return detailed error page
    return res.status(400).send(`
      <html>
        <head>
          <title>OAuth Authentication Error</title>
          <style>
            body { font-family: Arial; margin: 40px; background: #f5f5f5; }
            .container { background: white; padding: 30px; border-radius: 8px; max-width: 600px; }
            .error { color: #d32f2f; background: #ffebee; padding: 15px; border-radius: 4px; margin: 20px 0; }
            .details { background: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0; font-family: monospace; }
            .retry { background: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>🚫 Authentication Failed</h2>
            
            <div class="error">
              <strong>Error Code:</strong> ${req.query.error}<br>
              <strong>Description:</strong> ${req.query.error_description || 'Unknown authentication error'}
            </div>
            
            <h3>📋 Debug Information</h3>
            <div class="details">
              <strong>Platform:</strong> ${req.headers['user-agent']?.includes('iPhone') ? 'iOS' : req.headers['user-agent']?.includes('Android') ? 'Android' : 'Unknown'}<br>
              <strong>Timestamp:</strong> ${new Date().toISOString()}<br>
              <strong>State:</strong> ${req.query.state || 'Not provided'}<br>
              <strong>Session:</strong> ${req.query.session_state || 'Not provided'}
            </div>
            
            <p><a href="/editsignature.html" class="retry">🔄 Try Authentication Again</a></p>
            
            <details>
              <summary>🔧 Technical Details (for developers)</summary>
              <div class="details">
                <strong>User Agent:</strong> ${req.headers['user-agent']}<br>
                <strong>Referer:</strong> ${req.headers.referer || 'Not provided'}<br>
                <strong>Full Query:</strong> ${JSON.stringify(req.query, null, 2)}
              </div>
            </details>
            
            <script>
              // For iOS Office apps, try to communicate with parent window
              if (window.opener) {
                window.opener.postMessage({ 
                  success: false, 
                  error: '${req.query.error}',
                  description: '${req.query.error_description}' 
                }, '*');
                setTimeout(() => window.close(), 3000);
              }
            </script>
          </div>
        </body>
      </html>
    `);
  }
  
  // Check for authorization code (success case)
  if (req.query.code) {
    console.log('\n✅ OAUTH SUCCESS:');
    console.log('Authorization code received:', req.query.code.substring(0, 10) + '...');
    console.log('State:', req.query.state);
    console.log('Session state:', req.query.session_state);
    
    // Success - redirect to main application
    res.send(`
      <html>
        <head>
          <title>Authentication Successful</title>
          <style>
            body { font-family: Arial; margin: 40px; background: #f5f5f5; text-align: center; }
            .container { background: white; padding: 30px; border-radius: 8px; max-width: 400px; margin: 0 auto; }
            .success { color: #2e7d32; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="success">✅ Authentication Successful</h2>
            <p>Redirecting to signature editor...</p>
            <div style="margin: 20px 0;">
              <div style="width: 100%; height: 4px; background: #e0e0e0; border-radius: 2px;">
                <div id="progress" style="width: 0%; height: 100%; background: #4caf50; border-radius: 2px; transition: width 3s;"></div>
              </div>
            </div>
          </div>
          <script>
            // Start progress animation
            document.getElementById('progress').style.width = '100%';
            
            // For iOS Office apps, notify parent window and close
            if (window.opener) {
              window.opener.postMessage({ success: true }, '*');
              setTimeout(() => window.close(), 1000);
            } else {
              // Regular redirect after 3 seconds
              setTimeout(() => {
                window.location.href = '/editsignature.html';
              }, 3000);
            }
          </script>
        </body>
      </html>
    `);
  } else {
    console.log('\n⚠️ UNEXPECTED CALLBACK:');
    console.log('No authorization code or error found in callback');
    console.log('This might indicate a configuration issue');
    res.redirect('/editsignature.html');
  }
});

// 404 handler for undefined routes
app.use((req, res) => {
  console.log(`✗ 404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`,
    availableEndpoints: [
      'GET /health',
      'GET /signature?email=user@domain.com',
      'GET /api/user/:email',
      'Static files from: /editsignature.html, /assignsignature.html, etc.'
    ]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║    Graph API Server Running Successfully   ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log('\n📍 Server Details:');
  console.log('   Port:', PORT);
  console.log('   Environment:', NODE_ENV);
  console.log('\n🔗 API Endpoints:');
  console.log(`   Health Check:  http://localhost:${PORT}/health`);
  console.log(`   Get Signature: http://localhost:${PORT}/signature?email=user@lilly.com`);
  console.log(`   Get User:      http://localhost:${PORT}/api/user/user@lilly.com`);
  console.log('\n📁 Frontend Pages:');
  console.log(`   Edit Signature:   http://localhost:${PORT}/editsignature.html`);
  console.log(`   Assign Templates: http://localhost:${PORT}/assignsignature.html`);
  console.log('\n✓ Server ready to accept requests...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n\n╔════════════════════════════════════════════╗');
  console.log('║        Server Shutting Down...             ║');
  console.log('╚════════════════════════════════════════════╝\n');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n\n╔════════════════════════════════════════════╗');
  console.log('║        Server Shutting Down...             ║');
  console.log('╚════════════════════════════════════════════╝\n');
  process.exit(0);
});
