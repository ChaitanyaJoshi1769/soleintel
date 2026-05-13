# Design System Guidelines
## SOLEINTEL UI/UX Standards & Component Library
**Owner:** Design Lead  
**Created:** May 14, 2026  
**Applies to:** All design work (mobile app, web, marketing)

---

## Overview

This design system ensures consistency across SOLEINTEL. All interfaces follow these guidelines.

**Benefits:**
- ✅ Consistent user experience
- ✅ Faster design & development
- ✅ Easier onboarding
- ✅ Professional appearance
- ✅ Maintainable codebase

---

## Part 1: Brand Identity

### Brand Promise

**"Know Before You Buy: Real-time data for smarter shoe shopping"**

This drives all design decisions. If a design doesn't help users make confident purchasing decisions, it doesn't fit SOLEINTEL.

### Brand Values

```
TRUST
├─ Transparent about how sizing works
├─ Show real user data/reviews
├─ Never mislead about fit
└─ Design impact: Clear information architecture

CONFIDENCE
├─ Make decisions easy
├─ Show users they're making right choice
├─ Provide social proof
└─ Design impact: High contrast, clear CTAs

COMMUNITY
├─ Show other users' experiences
├─ Enable connection between users
├─ Celebrate shared interests
└─ Design impact: Social elements, reviews, community

SIMPLICITY
├─ Don't overwhelm with options
├─ Clear path from awareness to purchase
├─ Efficient interactions
└─ Design impact: Minimal, focused interfaces
```

### Logo & Wordmark

```
Logo: [SOLEINTEL mark]
├─ Primary (color): Use on light backgrounds
├─ Inverted (white): Use on dark backgrounds
├─ Minimum size: 40px width (mobile)
├─ Clear space: 20px on all sides

Wordmark: "SOLEINTEL"
├─ Font: [Choose font - recommend Inter or custom]
├─ Color: Primary blue (#0066FF)
├─ Usage: Marketing, web, app header
└─ Never modify or distort
```

---

## Part 2: Color System

### Primary Colors

```
SOLEINTEL Blue (Primary - Trust & Intelligence)
├─ Hex: #0066FF
├─ RGB: 0, 102, 255
├─ HSL: 220°, 100%, 50%
└─ Usage: CTAs, active states, primary UI

Example: 
- "Search" button
- Active tab indicator
- Key metrics
```

```
Success Green (Positive feedback)
├─ Hex: #00AA44
├─ RGB: 0, 170, 68
├─ HSL: 145°, 100%, 33%
└─ Usage: Success messages, "Available" status

Example:
- "Added to cart" message
- "Size in stock" indicator
- Correct predictions
```

```
Warning Orange (Caution)
├─ Hex: #FF8800
├─ RGB: 255, 136, 0
├─ HSL: 32°, 100%, 50%
└─ Usage: Warnings, out of stock, important

Example:
- "Price dropped" notification
- "Low stock" indicator
- Important warnings
```

```
Error Red (Negative feedback)
├─ Hex: #FF3333
├─ RGB: 255, 51, 51
├─ HSL: 0°, 100%, 60%
└─ Usage: Errors, critical issues

Example:
- "Login failed" message
- Error states
- Critical alerts
```

### Neutral Colors

```
Text Dark (Primary text)
├─ Hex: #111111
├─ RGB: 17, 17, 17
├─ Usage: Body text, headers
└─ Contrast ratio: 18:1 on white (WCAG AAA)

Text Light (Secondary text)
├─ Hex: #666666
├─ RGB: 102, 102, 102
├─ Usage: Hints, disabled states
└─ Contrast ratio: 7:1 on white (WCAG AA)

Background Light (Page background)
├─ Hex: #FFFFFF
├─ RGB: 255, 255, 255
├─ Usage: Page background

Surface Gray (Card backgrounds)
├─ Hex: #F5F5F5
├─ RGB: 245, 245, 245
├─ Usage: Cards, panels, sections

Border Light (Dividers)
├─ Hex: #DDDDDD
├─ RGB: 221, 221, 221
├─ Usage: Borders, dividers
```

### Color Usage Rules

```
Text colors:
├─ Dark text (#111) on light backgrounds (default)
├─ Light text (#FFF) on dark backgrounds
├─ Secondary text (#666) for hints/captions
└─ Never light text on light background

Interactive colors:
├─ Primary blue (#0066FF) for main CTAs
├─ Darker blue on hover/active (#0052CC)
├─ Green for positive actions
├─ Red for destructive actions (delete, cancel)
└─ Always test contrast (7:1 minimum)

Status colors:
├─ Green for success/available
├─ Orange for warning/low stock
├─ Red for error/unavailable
└─ Gray for disabled/inactive
```

### Dark Mode Support

```
Dark mode color adjustments:
├─ Background: #1A1A1A (very dark gray)
├─ Surface: #2A2A2A (dark gray)
├─ Text: #FFFFFF (white)
├─ Secondary text: #AAAAAA (light gray)
├─ Borders: #444444 (dark gray)
└─ Accent colors: Same (blue, green, red)

Implementation:
- Use CSS custom properties (variables)
- CSS: --bg-light: #FFF in light mode, #1A1A1A in dark
- iOS: Respects system dark mode setting
- Android: Respects system dark mode setting
```

---

## Part 3: Typography

### Font Families

```
Primary Font: Inter (or system fonts)
├─ Usage: Body text, UI labels
├─ Weights: 400 (regular), 600 (semibold), 700 (bold)
├─ Download: fonts.google.com/specimen/Inter
└─ Fallback: -apple-system, BlinkMacSystemFont, Arial

Display Font: (Same as primary, or use weight variations)
├─ Usage: Headlines, large text
├─ Weights: 700 (bold), 800 (extra bold)
└─ Fallback: Same as primary
```

### Font Sizes & Hierarchy

```
Display 1 (Large headline)
├─ Size: 36px (desktop), 28px (mobile)
├─ Weight: 700 (bold)
├─ Line height: 1.2
├─ Letter spacing: -0.5px
├─ Usage: Page titles, app title
├─ Example: "SOLEINTEL" header

Display 2 (Headline)
├─ Size: 28px (desktop), 24px (mobile)
├─ Weight: 700
├─ Line height: 1.3
├─ Usage: Section headers
├─ Example: "Find Your Perfect Size"

Heading 1
├─ Size: 24px
├─ Weight: 700
├─ Line height: 1.3
├─ Usage: Major sections
├─ Example: Product name, feature title

Heading 2
├─ Size: 20px
├─ Weight: 700
├─ Line height: 1.4
├─ Usage: Subsections
├─ Example: Filter category

Body Large
├─ Size: 18px
├─ Weight: 400
├─ Line height: 1.6
├─ Usage: Large body text
├─ Example: Description paragraphs

Body Regular
├─ Size: 16px
├─ Weight: 400
├─ Line height: 1.6
├─ Usage: Primary body text (default)
├─ Example: Shoe descriptions, reviews

Body Small
├─ Size: 14px
├─ Weight: 400
├─ Line height: 1.5
├─ Usage: Secondary text, captions
├─ Example: "In stock", "Price", "Rating"

Caption
├─ Size: 12px
├─ Weight: 500
├─ Line height: 1.4
├─ Usage: Small labels, hints
├─ Example: Timestamp, secondary info

Overline
├─ Size: 11px
├─ Weight: 700
├─ Letter spacing: 1px
├─ Transform: uppercase
├─ Usage: Labels, section headers
├─ Example: "TRENDING", "FEATURED"
```

### Typography Rules

```
Contrast:
├─ Body text on background: 7:1 minimum (WCAG AA)
├─ Secondary text on background: 4.5:1 minimum
└─ Test with: webaim.org/contrast/checker

Line length:
├─ Optimal: 50-75 characters per line
├─ Mobile: Full width (usually <50 chars)
├─ Desktop: Max 80 characters

Alignment:
├─ Body text: Left aligned (LTR languages)
├─ Headers: Left aligned
├─ Numbers: Right aligned (in tables)
└─ Never justified text (bad for dyslexia)
```

---

## Part 4: Spacing & Layout

### Spacing Scale

```
Use multiples of 8px (base unit):

0px   - No space
4px   - Extra tight spacing
8px   - Tight (x0.5 - micro interactions)
16px  - Comfortable (x1 - default)
24px  - Generous (x1.5)
32px  - Large (x2)
48px  - Extra large (x3)
64px  - Huge (x4)

Usage:
├─ Padding inside buttons: 12px (1.5x)
├─ Margin between sections: 32px (2x)
├─ Gap between cards: 16px (1x)
├─ Margin inside cards: 16-24px (1-1.5x)
```

### Safe Area & Margins

```
Mobile (iOS & Android):
├─ Top margin: 16px (below status bar/notch)
├─ Bottom margin: 16px (above home indicator)
├─ Left/right margin: 16px (safe area)
├─ Minimum height for touch targets: 44px (iOS), 48px (Android)

Desktop (Web):
├─ Max width: 1200px
├─ Padding: 24-32px on sides
├─ Column grid: 12 columns
```

### Layout Grids

```
Mobile Layout (375px width):
├─ Columns: 4-6 columns
├─ Gutter: 16px between columns
├─ Margin: 16px on sides
├─ Effective content width: 343px

Desktop Layout (1200px):
├─ Columns: 12 columns
├─ Gutter: 24px between columns
├─ Margin: 32px on sides
├─ Effective content width: 1136px
```

---

## Part 5: Components

### Buttons

```
Primary Button (Main CTA)
├─ Background: #0066FF (primary blue)
├─ Text: White
├─ Padding: 12px 24px (height: 44px minimum)
├─ Border radius: 8px
├─ Font: 16px, 700 weight
├─ Hover: #0052CC (darker blue)
├─ Active: #004299 (even darker)
├─ Disabled: #CCCCCC, opacity: 0.5
├─ Example: "Search Shoes", "Add to Cart"

Secondary Button
├─ Background: #F5F5F5 (light gray)
├─ Text: #111111 (dark text)
├─ Border: 1px #DDDDDD
├─ Padding: 12px 24px
├─ Hover: #E8E8E8
├─ Example: "Cancel", "Skip"

Destructive Button (Delete, Cancel)
├─ Background: #FF3333 (red)
├─ Text: White
├─ Padding: 12px 24px
├─ Hover: #CC0000 (darker red)
├─ Require confirmation dialog
├─ Example: "Delete Account"

Tertiary Button (Icon/Text-only)
├─ Background: Transparent
├─ Text: #0066FF
├─ Padding: 8px 16px
├─ Border: None
├─ Hover: Light blue background
├─ Example: "Learn More", "Help"
```

### Forms & Inputs

```
Text Input
├─ Background: #FFFFFF
├─ Border: 1px #DDDDDD
├─ Padding: 12px 16px
├─ Border radius: 6px
├─ Height: 44px minimum
├─ Focus: Blue border (#0066FF), box-shadow
├─ Font: 16px regular
├─ Placeholder: #999999, lighter weight

Filled Input (Alternative style)
├─ Background: #F5F5F5
├─ Border: 1px #E8E8E8
├─ Padding: 12px 16px
├─ Underline on focus instead of border

Label
├─ Font: 14px, 600 weight
├─ Color: #111111
├─ Margin bottom: 8px
├─ Required indicator: Red asterisk

Hint Text
├─ Font: 12px, 400 weight
├─ Color: #666666
├─ Margin top: 4px
├─ Example: "At least 8 characters"

Error State
├─ Border color: #FF3333
├─ Error message: 12px, red color, above input
├─ Icon: Red exclamation mark

Checkbox
├─ Size: 20x20px
├─ Border: 2px #DDDDDD
├─ Checked: #0066FF background, white checkmark
├─ Label: Click-friendly (24x24px total touch area)

Radio Button
├─ Size: 20x20px
├─ Outer circle: 2px border
├─ Inner dot (checked): 8px filled
├─ Style same as checkbox
```

### Cards & Surfaces

```
Card (Shoe product)
├─ Background: #FFFFFF
├─ Border: 1px #DDDDDD
├─ Border radius: 12px
├─ Padding: 16px
├─ Shadow: 0 2px 8px rgba(0,0,0,0.08)
├─ Hover shadow: 0 4px 16px rgba(0,0,0,0.12)
├─ Transition: 200ms

Card sections:
├─ Image: 100% width, aspect ratio 4:3
├─ Title: 18px, 700 weight
├─ Brand: 14px, gray, uppercase
├─ Price: 20px, 700, blue color
├─ Rating: Stars + count
└─ Action button: Full width, bottom

Surface (Light gray container)
├─ Background: #F5F5F5
├─ Border: 1px #E8E8E8
├─ Padding: 16px
├─ Border radius: 8px
├─ Usage: Featured sections, alerts
```

### Navigation

```
Tab Navigation
├─ Height: 56px (mobile), 48px (desktop)
├─ Font: 14px, 600 weight
├─ Active indicator: 4px blue bar at bottom
├─ Spacing: 24px between tabs
├─ Active text: #0066FF
├─ Inactive text: #666666
├─ Icons: 24x24px, optional

Bottom Navigation (Mobile)
├─ Height: 64px (including safe area)
├─ Position: Fixed at bottom
├─ Icons: 24x24px
├─ Label: 12px below icon
├─ Active: Blue icon + label
├─ Items: Max 5 items

Hamburger Menu (Mobile)
├─ Icon: 24x24px, three horizontal lines
├─ Padding: 16px
├─ Position: Top-left or top-right
├─ Color: #111111 (or white on dark)
```

### Modals & Dialogs

```
Modal Dialog
├─ Overlay: Semi-transparent black (opacity 0.5)
├─ Container: White card, centered
├─ Border radius: 16px
├─ Max width: 400px (mobile), 600px (desktop)
├─ Padding: 24px
├─ Header: 24px title, 700 weight
├─ Content: Body text
├─ Footer: Action buttons (OK, Cancel)
├─ Animation: Fade in + scale (200ms)

Alert Dialog (Confirmation)
├─ Icon: Attention icon (if warning)
├─ Message: Clear, short
├─ Buttons: Cancel (gray), Confirm (blue)
├─ Example: "Are you sure you want to delete?"

Loading State
├─ Spinner: 40x40px, blue, rotating
├─ Text: "Loading..." (optional)
├─ Overlay: Semi-transparent (prevents interaction)
```

---

## Part 6: Interaction Patterns

### Touch Targets

```
iOS & Android minimum touch target: 44x44px (Apple), 48x48px (Google)

SOLEINTEL standard:
├─ Buttons: Minimum 44px height
├─ Links: Minimum 44px clickable area
├─ Tabs: Minimum 48px tall
├─ Icons as buttons: 44x44px minimum
└─ Spacing between targets: At least 8px
```

### Animations

```
Standard transitions: 200-300ms

Fade in (new content):
├─ Duration: 200ms
├─ Easing: ease-out
├─ Opacity: 0 → 1

Slide in (navigation):
├─ Duration: 300ms
├─ Easing: cubic-bezier(0.4, 0, 0.2, 1)
├─ Direction: Left to right (iOS), bottom to top (Android)

Scale (hover):
├─ Duration: 200ms
├─ Scale: 1 → 1.02 on buttons
└─ Apply on :hover state

Shake (error):
├─ Duration: 300ms
├─ Translate: -5px, 5px, -5px, 5px, 0
├─ Use for: Input errors, failed actions
```

### Micro-interactions

```
Button press feedback:
├─ Visual: Slight darkening of color
├─ Duration: Instant (0ms start, 100ms release)
├─ Haptic: Light vibration (mobile)

Loading indicator:
├─ Show after: 400ms delay (prevent flicker)
├─ Spinner: Rotating circle, blue
├─ Can cancel: Show cancel button

Pull-to-refresh:
├─ Trigger: Pull down 60px
├─ Release: Triggers refresh
├─ Feedback: Spinner, pulls down content
└─ Complete: Smooth animation back to top

Swipe actions:
├─ Swipe left: Reveal action buttons
├─ Swipe right: Go back (iOS)
├─ Animation: Smooth, responsive
└─ Example: Swipe to delete from cart
```

---

## Part 7: Accessibility Standards

### WCAG 2.1 Level AA Compliance

```
Color contrast:
├─ Text on background: 4.5:1
├─ Large text (18px+): 3:1
├─ Graphics & UI components: 3:1

Text:
├─ Font size minimum: 12px
├─ Line height minimum: 1.5x
├─ Text spacing: Adjustable

Interactive elements:
├─ Focus indicators: Always visible
├─ Focus outline: Blue, 2px thickness
├─ Focus order: Logical, left-to-right
├─ Touch targets: Minimum 44x44px

Images:
├─ Alt text: Descriptive, concise
├─ Icons: Have aria-labels
└─ Decorative images: aria-hidden="true"

Forms:
├─ Labels associated with inputs
├─ Error messages linked to fields
├─ Validation feedback: Text + color
└─ Placeholder is not a label

Mobile:
├─ Portrait & landscape orientations
├─ No fixed viewport width
├─ Zoom: 200% minimum
├─ Text size: Adjustable by users
```

### Testing

```
Manual testing:
├─ Keyboard navigation (Tab key)
├─ Screen reader (NVDA, VoiceOver)
├─ Color blindness simulation
├─ Zoom to 200%
└─ Test with real users (when possible)

Automated testing:
├─ axe DevTools browser extension
├─ Lighthouse (Chrome DevTools)
├─ Pa11y command-line tool
└─ Every PR must pass accessibility checks
```

---

## Part 8: Implementation Checklist

Before shipping any feature:

- [ ] Design follows color system
- [ ] Typography hierarchy used correctly
- [ ] Spacing uses 8px grid
- [ ] Buttons minimum 44px height
- [ ] Contrast ratio 4.5:1 minimum
- [ ] Hover/focus states defined
- [ ] Dark mode supported
- [ ] Mobile & desktop tested
- [ ] Accessibility reviewed (WCAG AA)
- [ ] Animation performance good (60fps)
- [ ] Design matches mockups
- [ ] Component library updated
- [ ] Documentation written
- [ ] Design handoff to developers complete

---

## Part 9: Component Library

### Storybook Setup

```
Document all components in Storybook:
├─ Button component
├─ Input component
├─ Card component
├─ Modal component
├─ Tab component
└─ [All reusable components]

Each component should include:
├─ Visual states (default, hover, active, disabled)
├─ Props documentation
├─ Code examples
├─ Accessibility notes
└─ Usage guidelines
```

---

## Design Tools

```
Design tools for the team:
├─ Figma (design, prototyping)
├─ Figma plugins: Color contrast checker
├─ Storybook (component documentation)
├─ Zeplin (design handoff)

Design team setup:
├─ Figma workspace shared with team
├─ Component library in Figma (reusable)
├─ Color styles library
├─ Typography styles library
├─ Design tokens (for developers)
```

---

## Success Indicators

We're following design system well when:

✅ All interfaces look consistent  
✅ New features ship faster (reuse components)  
✅ Accessibility score >95  
✅ No custom colors outside system  
✅ Typography hierarchy clear  
✅ Spacing consistent throughout  
✅ Mobile & desktop both great  
✅ Dark mode works seamlessly  
✅ Team references guidelines  
✅ New team members onboard quickly  

---

## Final Checklist

Before launch:

- [ ] Color system documented and tested
- [ ] Typography hierarchy set in code
- [ ] Spacing scale implemented
- [ ] Component library started (Storybook)
- [ ] Accessibility audit passed
- [ ] Design tokens created
- [ ] Dark mode fully implemented
- [ ] Figma design system created
- [ ] Team trained on guidelines
- [ ] Design handoff process documented

---

**Design System Version:** 1.0  
**Created:** May 14, 2026  
**Owner:** Design Lead  
**Review Cadence:** Quarterly or when major changes needed  
**Last Review:** May 14, 2026  
**Next Review:** August 14, 2026  
**Questions?** Ask Design Lead
