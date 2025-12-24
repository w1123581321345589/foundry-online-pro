# Design Guidelines for Foundry Online Micro-School Platform

## Design Approach: Reference-Based (Education/SaaS)
Drawing inspiration from modern education platforms like Notion, Linear, and Canvas, with emphasis on clarity, trust, and professional aesthetics suitable for educational institutions.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Brand Primary: 220 85% 20% (deep educational blue)
- Brand Secondary: 220 70% 95% (light blue background)

**Dark Mode:**
- Background: 220 15% 8%
- Surface: 220 12% 12%
- Text Primary: 220 10% 95%

**Light Mode:**
- Background: 0 0% 100%
- Surface: 220 20% 98%
- Text Primary: 220 40% 15%

**Functional Colors:**
- Success: 140 60% 45% (for payments, completed sessions)
- Warning: 35 85% 55% (for pending items)
- Error: 0 70% 50% (for failed payments, issues)

### B. Typography
- **Primary Font:** Inter (Google Fonts) - for clean, readable interface text
- **Accent Font:** Fraunces (Google Fonts) - for headings and brand elements
- **Hierarchy:** 
  - H1: 2rem (32px), font-weight: 700
  - H2: 1.5rem (24px), font-weight: 600
  - Body: 1rem (16px), font-weight: 400
  - Small: 0.875rem (14px), font-weight: 400

### C. Layout System
**Tailwind Spacing Units:** Consistent use of 2, 4, 6, 8, 12, 16 for padding, margins, and gaps
- Micro spacing: p-2, m-2 (8px)
- Standard spacing: p-4, m-4 (16px)
- Section spacing: p-8, m-8 (32px)
- Page margins: p-6 on mobile, p-12 on desktop

### D. Component Library

**Navigation:**
- Clean horizontal nav with subtle dividers
- Breadcrumb navigation for nested pages
- Sidebar navigation for operator/instructor dashboards

**Forms:**
- Grouped form sections with clear labels
- Input states: default, focus, error, disabled
- Progressive disclosure for complex forms (Stripe onboarding)

**Data Displays:**
- Card-based layouts for sessions, invoices, recordings
- Table layouts for attendance tracking and payouts
- Status badges with color-coded indicators

**Overlays:**
- Modal dialogs for critical actions (payment processing)
- Toast notifications for status updates
- Dropdown menus with proper shadows and borders

### E. Page-Specific Design Considerations

**Operator Dashboard:**
- Clean metrics cards showing revenue, active students, pending payouts
- Stripe Connect onboarding flow with clear progress indicators
- Professional color scheme emphasizing trust and reliability

**Parent Portal:**
- Warm, welcoming interface with family-focused imagery
- Easy access to children's progress, upcoming sessions, recordings
- Clear invoice and payment history with download links

**Instructor Console:**
- Functional, tool-focused design for session management
- Live session controls with clear on/off states
- Recording upload interface with drag-drop functionality

**Classroom Interface:**
- Minimal distractions during live sessions
- Clean Daily.co integration with branded wrapper
- Subtle branding that doesn't interfere with learning

## Images
**Hero Images:** No large hero images needed - this is a functional platform prioritizing usability over marketing appeal. Use subtle background patterns or gradients instead.

**Supporting Images:**
- Small avatar placeholders for students and instructors
- Icon illustrations for empty states (no recordings, no sessions)
- Simple graphics for onboarding flow steps
- Minimal decorative elements that support the educational context

## Visual Hierarchy
- Use card elevation and spacing to create clear content groupings
- Implement consistent button hierarchy (primary for main actions, secondary for navigation)
- Employ color strategically to highlight important status information (payments, session states)
- Maintain generous whitespace to reduce cognitive load during complex workflows