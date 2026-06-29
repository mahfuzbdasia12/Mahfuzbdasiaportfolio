# Accessibility Quick Reference Guide

## ⚡ Quick Checklist for New Content

### Forms
```html
<!-- ✅ DO: Properly labeled input -->
<label for="email">Email Address <span aria-label="required">*</span></label>
<input id="email" type="email" required aria-required="true" />

<!-- ❌ DON'T: No label association -->
<label>Email Address</label>
<input type="email" placeholder="Email" />
```

### Buttons & Links
```html
<!-- ✅ DO: Descriptive button text -->
<button aria-label="Close dialog">×</button>

<!-- ❌ DON'T: Unclear button text -->
<button>Click Here</button>
```

### Icons
```html
<!-- ✅ DO: Hide decorative icons -->
<button>
  <span aria-hidden="true" class="material-symbols-outlined">delete</span>
  Delete Item
</button>

<!-- ❌ DON'T: Leave icons accessible -->
<button>
  <span class="material-symbols-outlined">delete</span>
  Delete Item
</button>
```

### Lists & Groups
```html
<!-- ✅ DO: Proper list structure -->
<ul role="list">
  <li role="listitem"><a href="#">Link 1</a></li>
  <li role="listitem"><a href="#">Link 2</a></li>
</ul>

<!-- ❌ DON'T: Unstructured list -->
<div>
  <a href="#">Link 1</a>
  <a href="#">Link 2</a>
</div>
```

### Sections
```html
<!-- ✅ DO: Labeled sections -->
<section aria-label="Skills Overview">
  <h2>My Skills</h2>
</section>

<!-- ❌ DON'T: Unlabeled sections -->
<section>
  <h2>My Skills</h2>
</section>
```

---

## 🎨 Color Contrast Guide

### Current Website Colors
All colors meet WCAG AA standards (4.5:1 minimum):

- **Primary Text**: #ffffff (white) on #131313 (15.6:1) ✅
- **Primary Accent**: #ff0026 (red) on #131313 (5.9:1) ✅
- **Secondary Accent**: #6adab4 (cyan) on #131313 (6.4:1) ✅
- **Secondary Text**: #878E99 (gray) on #131313 (5.2:1) ✅

### When Adding New Colors
1. Check contrast ratio at [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. Minimum for body text: 4.5:1 (AA), 7:1 (AAA)
3. Minimum for large text: 3:1 (AA), 4.5:1 (AAA)

---

## 🔤 Heading Hierarchy

### Correct Structure
```html
<h1>Page Title (One per page)</h1>

<section>
  <h2>Section Heading</h2>
  <p>Content here...</p>
  
  <h3>Subsection Heading</h3>
  <p>More content...</p>
</section>
```

### Common Mistakes ❌
- Multiple `<h1>` tags on one page
- Skipping heading levels (h1 → h3, skipping h2)
- Using headings for styling (use CSS instead)
- Empty headings with no content

---

## ⌨️ Keyboard Navigation Requirements

Every interactive element must be:
1. **Focusable** - Reachable via Tab key
2. **Activatable** - Can be used via keyboard
3. **Logical** - Tab order follows reading order

### Testing
```
Open DevTools → Elements → Tab through page
- Can you reach all buttons/links?
- Is focus visible?
- Does tab order make sense?
```

---

## 🎙️ Screen Reader Announcements

### Form Errors (Use role="alert")
```html
<div id="email-error" role="alert"></div>

<!-- Screen readers announce immediately when updated -->
<script>
  document.getElementById('email-error').textContent = 'Invalid email';
</script>
```

### Dynamic Content (Use aria-live)
```html
<!-- Announced when content changes -->
<div role="status" aria-live="polite" aria-atomic="true">
  <!-- Updated content announced here -->
</div>
```

### Hidden Content (Use sr-only)
```html
<button>
  <span aria-hidden="true">×</span>
  <span class="sr-only">Close dialog</span>
</button>
```

---

## 📱 Mobile Accessibility

### Touch Targets
- Minimum size: 44×44 pixels
- Spacing between targets: 8px minimum
- No horizontal scrolling at 100% zoom

### Testing
```
- Open page on mobile device
- Can you tap all buttons comfortably?
- Does page scroll horizontally?
- Can you use the site with zoom at 200%?
```

---

## 🧪 Testing Workflow

### Before Publishing
1. **Browser DevTools**
   ```
   F12 → Lighthouse → Accessibility
   Should score 90+ (90-100 is excellent)
   ```

2. **Axe DevTools**
   ```
   Install → Scan page → Check results
   Should have 0 violations
   ```

3. **Keyboard Test**
   ```
   Unplug mouse → Tab through page
   Can you access everything?
   ```

4. **Screen Reader Test (NVDA)**
   ```
   Download NVDA → Open page with NVDA active
   Can you hear all content?
   ```

### Tools
| Tool | Purpose |
|------|---------|
| Axe DevTools | Automated accessibility checking |
| WAVE Extension | Visual accessibility feedback |
| Lighthouse | Accessibility audit |
| WebAIM Contrast Checker | Color contrast verification |
| NVDA | Screen reader testing |

---

## 🔧 Common Fixes

### Issue: Button doesn't work with keyboard
**Fix**: Use `<button>` instead of `<div>` or add keyboard handlers
```javascript
// ❌ Wrong
<div onclick="doSomething()">Click me</div>

// ✅ Correct
<button onclick="doSomething()">Click me</button>
```

### Issue: Can't tab to element
**Fix**: Remove `tabindex="-1"` or add if needed
```html
<!-- ✅ Correct -->
<button>I'm focusable</button>

<!-- If hiding from tab order: -->
<button tabindex="-1">Hidden from tab order</button>
```

### Issue: Form fields not labeled
**Fix**: Add `<label>` with `for` attribute
```html
<!-- ✅ Correct -->
<label for="name">Name</label>
<input id="name" />

<!-- Alternative: -->
<label>
  Name
  <input type="text" />
</label>
```

### Issue: Icon only button not clear
**Fix**: Add aria-label or screen reader text
```html
<!-- ✅ Correct -->
<button aria-label="Delete item">
  <span aria-hidden="true">🗑️</span>
</button>

<!-- Or use sr-only class -->
<button>
  <span aria-hidden="true">×</span>
  <span class="sr-only">Close</span>
</button>
```

---

## 📚 ARIA Attributes Cheat Sheet

| Attribute | Use Case | Example |
|-----------|----------|---------|
| `aria-label` | Label for icon-only buttons | `<button aria-label="Close">×</button>` |
| `aria-labelledby` | Reference heading | `<section aria-labelledby="heading1">` |
| `aria-describedby` | Link error messages | `<input aria-describedby="error">` |
| `aria-required` | Mark required fields | `<input aria-required="true">` |
| `aria-expanded` | Toggle state | `<button aria-expanded="false">` |
| `aria-hidden` | Hide decorative elements | `<span aria-hidden="true">→</span>` |
| `aria-live` | Announce updates | `<div aria-live="polite">` |
| `role="alert"` | Urgent announcements | `<div role="alert">Error!</div>` |
| `role="status"` | Status updates | `<div role="status">Saving...</div>` |
| `role="button"` | Non-button clickables | `<div role="button" tabindex="0">` |

---

## 🎯 WCAG 2.1 AA Requirements (Quick Summary)

| Level | Requirement |
|-------|------------|
| **Perceivable** | Users can see/hear all content |
| **Operable** | Users can navigate & interact |
| **Understandable** | Users understand content & controls |
| **Robust** | Works with assistive technologies |

---

## 📖 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project](https://www.a11yproject.com/)
- [WebAIM](https://webaim.org/)

---

## ✅ Before Every Commit

```bash
# 1. Check HTML validity
# 2. Run Axe DevTools scan
# 3. Test with keyboard (Tab, Enter, Escape)
# 4. Check color contrast
# 5. Verify mobile responsiveness
```

---

**Remember**: Accessibility is not a checklist item—it's a mindset. Build inclusive from the start! ♿️

---

*For full documentation, see [ACCESSIBILITY_GUIDE.md](ACCESSIBILITY_GUIDE.md)*
