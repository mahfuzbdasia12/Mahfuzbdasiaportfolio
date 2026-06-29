const express = require('express');
const path = require('path');
const compression = require('compression');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enable gzip compression for all responses
app.use(compression());

// Set cache headers for static assets
app.use((req, res, next) => {
  // Cache images and fonts for 30 days
  if(/\.(jpg|jpeg|png|gif|webp|woff|woff2|ttf|otf)$/i.test(req.path)) {
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
  }
  // Cache CSS and JS for 7 days
  else if(/\.(css|js)$/i.test(req.path)) {
    res.setHeader('Cache-Control', 'public, max-age=604800');
  }
  // HTML: cache for 1 hour, revalidate frequently
  else if(/\.html$/i.test(req.path)) {
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
  }
  next();
});

app.use(express.static(path.join(__dirname, '.')));

// Core Web Vitals optimization headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Preload critical resources
  res.setHeader('Link', '</style.css>; rel=preload; as=style, </js/main.js>; rel=preload; as=script');
  next();
});

app.get('/analytics.js', (req, res) => {
  const gaId = process.env.GA_MEASUREMENT_ID;
  res.type('application/javascript');

  if (!gaId) {
    return res.send('// Analytics not configured. Set GA_MEASUREMENT_ID in .env.');
  }

  res.send(`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}', { send_page_view: true });
  `);
});

const verificationFile = process.env.GOOGLE_SITE_VERIFICATION_FILE;
const verificationContent = process.env.GOOGLE_SITE_VERIFICATION_CONTENT;
if (verificationFile && verificationContent) {
  app.get(`/${verificationFile}`, (req, res) => {
    res.type('text/plain');
    res.send(verificationContent);
  });
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
