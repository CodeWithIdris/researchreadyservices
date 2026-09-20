# ResearchReady Premium Research Platform

## Goal
Rebuild ResearchReady as a premium, editorial research-support and consulting platform for postgraduate researchers, academics, professionals, and organisations. Preserve working authentication, client/admin dashboards, appointments, chat, and profile settings.

## What the audit found
- The current public site still uses student-writing language, commodity pricing, urgency tactics, and unverified testimonials/statistics.
- The main ad page stores leads directly from the browser without server-side validation or durable campaign attribution.
- Research document uploads do not yet exist; the only current upload area is public profile photos.
- Google Analytics and Meta tracking load before the current consent choice and the first GA page view can be counted twice.
- Several canonical links and the sitemap use the wrong domain.

## Implementation

### 1. Brand, navigation, and homepage
- Keep the navy/gold identity, refine it into a restrained editorial system, and remove gradients, decorative blobs, glass effects, oversized rounded cards, and excessive motion.
- Replace the homepage with the requested journey: message-matched hero, four equal audience paths, recognition-led problem section, Research Notes, structured service groups, data analysis, literature review, systematic review, PhD, professional research, five-step process, scoped-pricing message, and enquiry invitation.
- Use a purpose-built research-workspace composition made from HTML/CSS document, literature-map, and statistical-output elements rather than generic imagery.
- Change the main action across public pages to **Discuss Your Research** and the secondary action to **Request a Research Assessment**.
- Keep the client portal available without letting it dominate the public navigation.

### 2. Credibility and public copy
- Remove unverified named testimonials, review schema, project counts, satisfaction rates, geographic counts, fabricated milestones, guarantees, and unsupported scarcity claims.
- Replace them with factual capability indicators: research levels, methods, software, and forms of support offered.
- Rewrite About, FAQ, booking, footer, policies, and remaining public copy around ethical collaboration, analysis, methodology, interpretation, refinement, and publication readiness.
- Keep the hidden game functional, but remove it from search discovery and the consultancy sitemap.

### 3. Services and Research Insights
- Create reusable service definitions for Research & Dissertation Support, Data & Analytics, Academic Publishing, and Professional Research.
- Add indexable service pages for the requested priority searches, using one maintainable template and natural, route-specific metadata.
- Create a structured Research Insights hub with the requested categories and a reusable full-article layout containing title, category, reading time, date, author attribution, article content, related services, and enquiry action.
- Launch the five substantive Research Notes already defined in the brief as complete articles, not empty placeholders.

### 4. Message-matched ad landing pages
- Build a reusable landing-page template driven by a central configuration.
- Launch dedicated literature-review, data-analysis, and systematic-review pages whose opening headline exactly matches each ad angle.
- Preserve campaign parameters as visitors move from a landing page to the consultation flow.
- Keep `/work-with-us` as the general paid-traffic destination and reshape it around recognition, scope, credibility, and assessment rather than exclusionary language.

### 5. Consultation and private documents
- Extend the existing lead structure rather than create a duplicate lead system.
- Add research level, discipline, support type, current stage, WhatsApp, preferred contact method, structured UTM fields, landing-page/ad-angle fields, and enquiry status.
- Move all public lead creation to a server-validated, rate-limited function; remove anonymous direct database writes.
- Add a private research-document area and document records linked to enquiries. Documents will be validated for allowed type and size and viewable only by admins.
- Build the requested mobile-friendly enquiry form, success state, optional document upload, and WhatsApp alternative.
- Extend the admin dashboard to show the richer enquiry, attribution, document, priority, and status details.

### 6. Measurement and consent
- Create one consent-aware tracking layer for GA4 and Meta.
- Implement PageView, ViewContent, ServiceView, CTA_Click, WhatsApp_Click, ConsultationStarted, ConsultationSubmitted, FileUploaded, ResearchLevelSelected, and ContactSubmitted.
- Prevent duplicate initial page views and fire SPA page views correctly for both providers.
- Capture first-touch and session UTM/referrer identifiers and attach them to enquiry and analytics events without putting personal data into tracking parameters.
- Show the regional consent choice globally, make reject as easy as accept, provide a persistent Cookie settings control, and block ad/analytics tags in consent or unresolved regions until acceptance.
- Update the privacy policy to name Google and Meta, the data and purposes involved, withdrawal controls, and the record retained for consent.
- Prepare event IDs and fields for later Conversions API work without implementing unrequested server-side matching or customer identifiers.

### 7. SEO foundations
- Correct every canonical and `og:url` to `https://researchreadyservices.lovable.app`.
- Replace generic student-writing metadata with route-specific titles and descriptions for public pages, services, insights, and ad landing pages.
- Keep sitewide Organization schema factual and add Service, Article, and BreadcrumbList schema only where relevant.
- Update the sitemap and robots rules; add noindex to auth, client, admin, settings, game, and campaign landing pages where appropriate.
- Keep the static fallback metadata accurate while using route-level metadata for JS-capable search crawlers. Per-page social previews remain limited by the current static app architecture.

### 8. Verification
- Run the project’s checks and inspect browser console/network behavior.
- Test homepage, service routes, insights, all three ad pages, consultation submission, private upload, WhatsApp, campaign persistence, and admin enquiry review.
- Verify desktop and mobile layouts with no overlap, clipped text, blank states, or hidden primary actions.
- Verify client login, admin login, dashboard, appointments, and settings still work.
- Confirm GA4 and Meta events only fire through the chosen regional consent route and are not duplicated.

## Technical details
- Public content will be maintained in typed data modules so services, insights, metadata, and ad pages stay consistent.
- Database changes will retain `project_leads` as the enquiry source of truth and use explicit grants, row-level security, admin-only reads, and service-role-only public submissions.
- Uploads will use a non-public bucket with admin-only access; no research document URL will be public.
- Existing generated integration files and authentication infrastructure will remain untouched.
- The existing email provider key is present but previously failed live sending; form success will never claim that email was sent unless delivery succeeds.
