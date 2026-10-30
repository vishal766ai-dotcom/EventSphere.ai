# ♿ Accessibility Statement & Conformance Report — EventSphere.ai

## 1. Conformance Overview
**EventSphere.ai** is engineered in accordance with the **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA and selected Level AAA criteria**. The application is designed to be accessible, usable, and inclusive for users with diverse abilities, including vision impairments, motor limitations, cognitive differences, and vestibular disorders.

---

## 2. Key Accessibility Implementations

### 2.1. Semantic HTML5 & Accessible Landmarks
- The application utilizes native semantic landmarks:
  - `<header>`: Top navigation bar containing skip link, logo, and pin selector.
  - `<nav role="tablist">`: WAI-ARIA compliant tabbed navigation.
  - `<main id="main-content" tabIndex="-1">`: Primary content region with direct skip-link destination.
  - `<footer role="contentinfo">`: Platform warranties and operational status.
- **Skip to Content Link**: A high-visibility skip link (`#main-content`) is available as the first focusable element on every page load (`Alt+Tab` / `Tab`).

### 2.2. WAI-ARIA Tablist Keyboard Navigation
Following the official **WAI-ARIA Tabs Design Pattern**:
| Key | Action |
| :--- | :--- |
| `Tab` | Moves focus into the active tab or out to the next interactive control. |
| `Arrow Right` | Moves focus to the next tab in the tablist (wraps to first tab). |
| `Arrow Left` | Moves focus to the previous tab in the tablist (wraps to last tab). |
| `Home` | Instantly moves focus to the first tab (`90m Express Setup`). |
| `End` | Instantly moves focus to the last tab (`Escrow & Ops Desk`). |
| `Enter` / `Space` | Activates and displays the selected tab panel. |

### 2.3. Form Elements & Screen Reader Labeling
- Every `<input>`, `<select>`, and `<textarea>` control is programmatically linked to a corresponding `<label>` using explicit `htmlFor` and `id` bindings.
- Range inputs (e.g., Guest Count Slider) declare `aria-valuemin="10"`, `aria-valuemax="120"`, `aria-valuenow={guestCount}`, and descriptive `aria-label`.
- Progress bars declare `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, and live text descriptions.
- Dynamic regions implement `aria-live="polite"` (Reverse Budget Calculation results, crowd funding progress, live telematics radar, and chat updates).

### 2.4. Contrast & Visual Accessibility
- **High Contrast Ratios**: Dark slate theme (`#020617`, `#0f172a`) paired with high-contrast text (`#ffffff`, `#f8fafc`, `#38bdf8`) meets or exceeds the **4.5:1 contrast ratio** for normal text and **3:1** for large graphics.
- **Accessible Focus Rings**: Implements `@apply outline-none ring-2 ring-rose-500 ring-offset-2 ring-offset-slate-950` for clear visual focus indicators on all interactive elements.
- **Unrestricted Viewport Zoom**: The viewport configuration preserves mobile pinch-to-zoom (`user-scalable=no` is strictly prohibited).

### 2.5. Reduced Motion Support
- Implements CSS `@media (prefers-reduced-motion: reduce)`:
  - Disables non-essential CSS keyframe animations (radar pulse, skeleton bounce).
  - Enforces instant transitions for users with vestibular or motion sensitivities.

---

## 3. Automated Accessibility Test Coverage
Automated testing is maintained in [`tests/accessibility.test.js`](tests/accessibility.test.js), verifying:
- Valid document language specification (`<html lang="en">`).
- Accessible viewport scaling.
- Landmark structure and skip link presence.
- ARIA tablist and tab semantics.
- Screen-reader text labels on icon-only buttons.
