---
name: web-qa-testing
description: Use when conducting quality assurance (QA), alpha/beta testing, form validation verification, visual screenshot audits, end-to-end user journey testing, or generating QA test reports for web applications.
---

# Web Quality Assurance & Alpha Testing Skill

A systematic, rigorous framework for performing Quality Assurance (QA), functional alpha testing, multi-step form verification, visual regression/screenshot auditing, and defect documentation for modern web applications.

## QA Testing Methodology & Core Gates

```
  ┌─────────────────────────────────────────────────────────────┐
  │                    1. Static Quality Gate                   │
  │    • Syntax Validation • Lint Rules • Bundle & Build Check │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
  ┌──────────────────────────────▼──────────────────────────────┐
  │                 2. Functional & Form Testing                │
  │  • Boundary Values • Regex • Required Rules • Multi-Step    │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
  ┌──────────────────────────────▼──────────────────────────────┐
  │              3. Visual & Cross-Device Auditing              │
  │   • Full Page Screenshots • Mobile/Desktop • Dark/Light     │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
  ┌──────────────────────────────▼──────────────────────────────┐
  │                 4. Network, Proxy & Resilience              │
  │  • API Failures • Offline States • Data Truncation Checks   │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
  ┌──────────────────────────────▼──────────────────────────────┐
  │                  5. QA Report & Artifacts                   │
  │   • Test Matrix • Defect Log (Severity) • Actionable Fixes  │
  └─────────────────────────────────────────────────────────────┘
```

---

## Form Testing Matrix & Validation Runbook

When testing interactive forms, execute tests against all categories below:

### 1. Field-Level Boundaries & Input Sanitization
| Test Type | Test Input / Condition | Expected Behavior |
| :--- | :--- | :--- |
| **Empty Required** | Blank input on blur or submit | Clear inline error message displayed; submit blocked. |
| **Min/Max Length** | String below min (e.g. 1 char name) or above limit | Immediate validation warning; input capped or trimmed. |
| **Phone Number** | Local format (`09171234567`), international (`+639...`), letters (`0917ABC4567`) | Non-digits stripped or rejected; strict 11-digit validation enforced. |
| **Email Address** | Missing `@`, missing domain, spaces (`user @ domain.com`), unicode | Standard RFC 5322 regex validation; clear feedback. |
| **XSS & Injection** | `<script>alert(1)</script>`, `"><img src=x onerror=alert(1)>` | Escaped safely in DOM and state payloads. |
| **SQL/DB Overflow** | Extremely long payloads (1000+ chars) | Field limits enforced client-side before submission to prevent database truncation errors. |

### 2. Multi-Step Wizard & State Persistence
- **Step Gating**: Next step must be disabled or blocked until all mandatory fields in current step pass validation.
- **Draft Recovery**: Form state preserved in `localStorage` across accidental refresh, excluding large binary objects.
- **Step Navigation**: Users can navigate back to earlier steps and modify data without losing downstream step state.
- **Dynamic Dependent Pickers**: Changing parent field (e.g. Province) must cascade and update child dropdowns (e.g. City/Municipality and Barangay).

### 3. File Uploads (Dropzone / Binary Fields)
- Verify allowed file extensions (`.jpg`, `.jpeg`, `.png`, `.pdf`).
- Verify max file size enforcement (e.g. 10MB limit) with user-friendly file rejection toast.
- Verify image preview rendering and EXIF metadata handling (e.g. GPS coordinates for address verification).

### 4. Digital Signature & Agreements
- Touch/mouse signature pad records clean canvas strokes.
- Clear signature button resets canvas state.
- Submit disabled until Terms & Conditions and Privacy Policy agreements are checked.

---

## Visual & Responsive Audit Protocol

1. **Resolution Breakpoints**:
   - Desktop: `1440 x 900` (High DPI layout, sticky headers, multi-column cards).
   - Tablet: `768 x 1024` (Responsive collapse, touch menus).
   - Mobile: `375 x 812` (Single column, bottom action buttons, keyboard pushup).
2. **Theme Testing**:
   - Verify Dark Mode and Light Mode color contrast ratios (WCAG 2.1 AA standard: 4.5:1 for normal text).
   - Check glassmorphism transparency, borders, and readability against dynamic backgrounds.
3. **Screenshot Capture**:
   - Execute headless browser captures with full viewport rendering.
   - Archive visual snapshots in `scratch/screenshots/` and link them in test walkthrough documents.

---

## Network & Resilience Testing

1. **API Fallbacks**:
   - If backend API (e.g. `/api/Plans`) is offline or slow, verify default cached catalogue renders smoothly.
2. **Error Feedback**:
   - API 400/422 errors must display human-readable guidance rather than raw JSON or generic "Error".
   - API 500 errors must provide clear contact options and retry actions.
3. **Reference Code Generation**:
   - Successful submission must generate an immutable, traceable reference code (`SF-YYYYMMDD-XXXX`).
   - Copy-to-clipboard functionality must provide visual confirmation (Toast alert).

---

## Defect Documentation Template

When logging bugs found during QA, use the standard format:

```markdown
### [DEFECT-ID] Short Descriptive Title

- **Severity**: Critical / High / Medium / Low
- **Component / URL**: (e.g. `RegistrationWizard.vue` / `/register`)
- **Preconditions**: (e.g. User selects Cavite province)
- **Steps to Reproduce**:
  1. Navigate to `/register`
  2. Complete Step 1 and proceed to Step 2
  3. Select Province X and click Submit
- **Expected Result**: Child dropdown populates with valid cities.
- **Actual Result**: Dropdown remains empty with unhandled promise rejection in console.
- **Screenshot / Evidence**: `![evidence](file:///...)`
- **Recommended Fix**: Update cascade watcher in store.
```
