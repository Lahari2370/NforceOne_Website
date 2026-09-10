# NForceOne Prototype — Innovation Challenge

## Run locally
1. Open `site/index.html` in a browser, or use VS Code Live Server.
2. Main navigation: Home, About, Services, Industries, Careers, Contact.
3. Service sub-pages are grouped in the Services dropdown.

## Prototype features
- Responsive premium website layout
- Animated image backgrounds on major pages
- Real-world imagery on capability/culture cards
- Simplified navigation with service dropdowns
- Light theme presentation
- QA Control Center with browser checks
- API Testing Lab with mock request/response/assertions
- Deterministic NF1
- Login/signup demo session and quality dashboard
- Careers/contact interactions
- Reduced-motion accessibility support

## Important
This is a front-end prototype. Login, signup, contact submission, API calls and Copilot responses are intentionally demo/mock functionality and are not connected to production services.


## Final challenge updates
- Existing website-facing prototype text is preserved.
- QA Control Center displays a 98% prototype quality score after running checks.
- NF1 remains a deterministic prototype with no live AI dependency.
- API Testing Lab remains a mock prototype with no external API dependency.
- Added consistent ← Back navigation to inner pages.
- Consolidated duplicate API/service-detail page variants.
- Improved Services and Industries dropdown navigation.
- Improved left alignment, responsive behavior, animation, and light-theme contrast.


## Simple presentation demo

### QA failure
1. Open `pages/qa.html`.
2. Run **Run QA Checks** — the normal result is 6/6 checks passed.
3. If asked to demonstrate a failure, remove any ONE `<img data-qa-image ...>` from the **Validation Targets** section.
4. Refresh and run the checks again. The image/accessibility validation will show **5/6** and the quality score will drop.
5. Restore the image to return to PASS.

### Navigation failure
Remove one `<a data-qa-nav ...>` from the QA page footer. The Navigation check will change from **8/8** to **7/8**. Restore it to return to PASS.

### API failure
On `pages/api.html`, change the request URL from `/users` to `/invalid` and click **Send Request**. The mock API returns **404** and the assertions show a failure. Change it back to `/users` for the normal **4/4 PASS** state.

No demo failure controls are visible on the website; failures are introduced only by a small temporary code change.
