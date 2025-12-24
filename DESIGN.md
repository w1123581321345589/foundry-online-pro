# DESIGN — Foundry Online (Stripe-grade Minimalism)

**Principles**
1. *Calm by default*: lots of whitespace, clear hierarchy, no shouting.
2. *One task per screen*: primary action in the top-right; gentle progress states.
3. *Typographic rhythm*: 12/14/16/20/24/30/36 scale; 1.5 line-height.
4. *Color as meaning*: neutrals for chrome, a single accent for actions.
5. *Motion for context*: 150–200ms ease; no bounces; subtle opacity fades.

**Tokens**
- Font: system stack (`ui-sans-serif, -apple-system, Segoe UI, Inter, Roboto, ...`)
- Accent: `#0A84FF` (action); Neutrals: gray-900/700/500/300/100
- Radius: 12px for cards; 8px for controls
- Elevation: 0 / 4 / 12 (box-shadow: md for cards, lg for dialogs)

**Components**
- Card: 16px padding, md shadow, radius 12, header with title + badge.
- Button: medium by default; no outlines unless focus-visible; hover: bg-opacity 90%.
- Empty states: icon (48px), title, 1-line descriptor, primary action.
- Tables: zebra subtle; no borders on every cell; use grouping.

**Do nots**
- No harsh reds/yellows for primary UI (use for alerts only).
- No all caps; no >2 fonts; no 90s gradients.
