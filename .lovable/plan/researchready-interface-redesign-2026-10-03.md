# ResearchReady interface redesign

## Direction
Rebuild the public website around the selected **Sophisticated global editorial** direction: warm paper surfaces, ink typography, champagne-gold accents, hairline rules, disciplined grids, and restrained interactive depth inspired by Three UI.

## What will change
- Redesign the shared header, navigation, buttons, footer, consent notice, and floating contact control so every public page feels cohesive.
- Recompose the homepage with a stronger editorial first screen, layered research-workspace visual, clearer audience pathways, improved section rhythm, and more decisive calls to action.
- Apply the same visual hierarchy to Services, Research Insights, About, FAQs, Support, booking, and consultation pages without changing their underlying functionality.
- Improve mobile typography, menu behavior, spacing, alignment, contrast, focus states, and form feedback.
- Preserve all existing links, lead capture, analytics consent, client/admin authentication, and private document workflows.

## Technical details
- Replace the current navy/cream styling with semantic editorial tokens in the shared design system; no page-level hardcoded colors.
- Use Libre Baskerville for editorial headings and IBM Plex Sans for interface/body copy.
- Build reusable editorial layout utilities and states rather than styling each page independently.
- Keep motion subtle and disable it when reduced motion is requested.
- Verify key public pages at 390px, 768px, and 1280px, then confirm the preview builds cleanly.
