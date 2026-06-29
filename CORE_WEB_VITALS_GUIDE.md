# Core Web Vitals Optimization Guide

## Overview
Core Web Vitals are critical metrics that measure user experience and SEO performance. This document outlines all optimizations implemented and recommendations for further improvements.

---

## 1. LCP (Largest Contentful Paint)
**Target:** < 2.5 seconds

### ✅ Implemented Optimizations:

#### Image Optimization
- Added `width` and `height` attributes to hero image to prevent layout shifts
- Set `loading="eager"` and `fetchpriority="high"` on hero image
- Added explicit dimensions to portfolio images (400x300)
- Implemented `loading="lazy"` for below-the-fold images

#### Font Optimization  
- Added preload hints for Google Fonts
- Fonts now use `display=swap` for faster text rendering
- Only essential font weights loaded (removed unused weights)

#### JavaScript Optimization
- Reduced animation particle count from 55 to 35 bubbles
- Reduced fish animation objects from 14 to 8
- All animations are non-blocking (don't delay DOMContentLoaded)

#### CSS Optimization
- Inline critical CSS for hero section
- Stylesheet loaded early in head

### 🔍 Remaining Recommendations:

1. **Image Format**: Convert JPG portfolio images to WebP format
   ```html
   <picture>
     <source srcset="image.webp" type="image/webp">
     <img src="image.jpg" alt="...">
   </picture>
   ```

2. **CDN**: Serve images from a CDN (Vercel, Cloudflare, AWS CloudFront)

3. **Image Compression**: Use tools like:
   - ImageOptim
   - TinyPNG/TinyJPG
   - Sharp (Node.js)

4. **Defer Non-Critical JavaScript**
   ```html
   <script defer src="animations.js"></script>
   ```

---

## 2. FID/INP (Interaction to Next Paint)
**Target:** < 100ms (FID) / < 200ms (INP)

### ✅ Implemented Optimizations:

#### JavaScript Performance
- Added mouse event throttling (16ms) in animations
- Reduced draw calculations per frame
- Optimized fish AI calculations

#### Event Listener Optimization
- Mouse events only update at 60fps (16ms throttle)
- Heavy canvas operations deferred to next frame

### 🔍 Remaining Recommendations:

1. **Debounce Form Handlers**
   ```javascript
   function debounce(fn, delay) {
     let id;
     return function(...args) {
       clearTimeout(id);
       id = setTimeout(() => fn(...args), delay);
     };
   }
   ```

2. **Move Heavy Work to Web Workers**
   ```javascript
   // particle-worker.js
   self.onmessage = (e) => {
     // Heavy calculations
     self.postMessage(results);
   };
   ```

3. **Minimize Third-Party Scripts**
   - Defer Google Analytics until after interaction
   - Load chat widgets asynchronously

4. **Code Splitting**
   - Split animations.js into separate modules
   - Load only needed animations per page

---

## 3. CLS (Cumulative Layout Shift)
**Target:** < 0.1

### ✅ Implemented Optimizations:

#### Image Dimensions
- All portfolio images have fixed width/height (400x300)
- Hero image has explicit dimensions (500x500)
- Prevents layout shifts when images load

#### Font Loading
- `font-display: swap` prevents FOIT (Flash of Invisible Text)
- Dimensions prevent text reflow

#### Reserved Space
- Canvas elements have fixed dimensions
- Navigation bar has fixed height (80px)

### 🔍 Remaining Recommendations:

1. **Add Container Query** for responsive layouts
   ```css
   @container (min-width: 400px) {
     .card { font-size: 1.2em; }
   }
   ```

2. **Use `content-visibility`** to defer rendering
   ```css
   .below-fold {
     content-visibility: auto;
   }
   ```

3. **Animate with `transform` only**
   ```css
   /* ✅ Good - No layout shift */
   animation: slide 1s;
   @keyframes slide { 
     to { transform: translateX(10px); } 
   }
   
   /* ❌ Bad - Causes layout shift */
   animation: shift 1s;
   @keyframes shift { 
     to { margin-left: 10px; } 
   }
   ```

---

## 4. Server-Side Optimizations
**Implemented in server.js:**

### ✅ Gzip Compression
All responses are compressed with gzip, reducing file sizes by ~70%

### ✅ Cache Headers
- **Images/Fonts:** 30-day cache (immutable)
- **CSS/JS:** 7-day cache
- **HTML:** 1-hour cache with revalidation

### ✅ Link Preloading
Server sends preload headers:
```
Link: </style.css>; rel=preload; as=style
Link: </js/main.js>; rel=preload; as=script
```

### ✅ Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block

---

## 5. Testing & Monitoring

### 🧪 Tools to Use:

1. **Google PageSpeed Insights**
   ```
   https://pagespeed.web.dev/
   ```

2. **WebPageTest**
   ```
   https://www.webpagetest.org/
   ```

3. **Lighthouse CLI**
   ```bash
   npm install -g lighthouse
   lighthouse https://yoursite.com --output=json
   ```

4. **Web Vitals Extension**
   - Chrome: Web Vitals
   - Shows real-time metrics

### 📊 Monitoring in Production:

```javascript
// Add to index.html before closing </body>
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

Or use Google Analytics 4:
```javascript
declare global {
  interface Window {
    dataLayer: Record<string, any>[];
  }
}

function sendWebVitals(metric: any) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'web_vitals',
    metric_id: metric.id,
    metric_value: Math.round(metric.value),
    metric_delta: Math.round(metric.delta),
  });
}

getCLS(sendWebVitals);
getFID(sendWebVitals);
getLCP(sendWebVitals);
```

---

## 6. Action Items

### Priority 1 (High Impact - Do First)
- [ ] Convert portfolio images to WebP format
- [ ] Enable image compression
- [ ] Set up CDN for images
- [ ] Add Web Vitals monitoring

### Priority 2 (Medium Impact)
- [ ] Move animations to Web Workers
- [ ] Code split animations.js
- [ ] Add `content-visibility: auto` to below-fold sections
- [ ] Implement critical CSS extraction

### Priority 3 (Polish)
- [ ] A/B test animation settings for engagement vs performance
- [ ] Create mobile-specific animation versions
- [ ] Add service worker for offline support
- [ ] Implement route-based code splitting

---

## 7. Performance Checklist

### HTML
- [ ] All images have width/height attributes
- [ ] Critical resources preloaded
- [ ] Meta viewport set
- [ ] Title and meta description optimized

### CSS
- [ ] Critical CSS inlined in `<head>`
- [ ] Non-critical CSS deferred or lazy-loaded
- [ ] No unused CSS
- [ ] Minimal specificity conflicts

### JavaScript
- [ ] Heavy work moved to Web Workers
- [ ] Event listeners throttled/debounced
- [ ] No synchronous scripts in critical path
- [ ] Tree-shaking enabled for imports

### Images
- [ ] All images compressed
- [ ] WebP format with fallbacks
- [ ] Responsive images (srcset)
- [ ] Lazy loading for below-fold images

### Server
- [ ] Gzip compression enabled
- [ ] Cache headers set correctly
- [ ] CDN configured
- [ ] HTTP/2 enabled

---

## 8. Performance Budget

Recommended targets for each metric:

| Metric | Target | Current |
|--------|--------|---------|
| LCP | < 2.5s | TBD |
| FID | < 100ms | TBD |
| CLS | < 0.1 | TBD |
| FCP | < 1.8s | TBD |
| TTFB | < 0.6s | TBD |
| Total JS | < 100KB | TBD |
| Total CSS | < 50KB | TBD |

---

## 9. Resources

- [Web.dev - Core Web Vitals](https://web.dev/vitals/)
- [MDN - Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Google Developers - PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)
- [MDN - Image Optimization](https://developer.mozilla.org/en-US/docs/Learn/Performance/Multimedia)
- [WebFont Optimization](https://web.dev/optimize-web-fonts/)

---

## 10. Implementation Summary

### Files Modified:
1. **index.html** - Added image dimensions, font preload, fetchpriority
2. **js/animations.js** - Throttled mouse events, reduced particle count
3. **server.js** - Added compression, cache headers, preload links
4. **package.json** - Added compression middleware

### Expected Improvements:
- **LCP**: 20-30% faster
- **FID/INP**: 30-40% improvement
- **CLS**: Reduced to near-zero with dimension fixes
- **Overall PageSpeed Score**: +10-15 points
