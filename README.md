# sportslandingpage
Demo landing page for a sports startup focused on showcasing Bihar's upcoming talent.

Files created:
- index.html — main landing page with hero, talent spotlight, programs, news, contact, and modal login.
- login.html — dedicated login page with OAuth placeholders.
- styles.css — mobile-first responsive styles, design tokens, and interactions.
- app.js — UI behavior, front-end validation, sample Bihar talent data, and filters.
- assets/* — SVG placeholders for hero art and partner logos.

How to view:
1. In the dev container or any static server, open `index.html` in a browser.
	Example (from project root):

	python3 -m http.server 8000

	Then open http://localhost:8000 in your browser.

Notes:
- Front-end only: login and OAuth buttons are placeholders for future backend integration.
- Talent data is sample local JSON in `app.js` and ready for API integration.
- Accessible labels, focus states, and basic form validation are included.
 - Dark mode: a theme toggle is available in the header and the preference persists in `localStorage`.
 - Dark mode: a theme toggle is available in the header and the preference persists in `localStorage`.
 - Help bot: a lightweight floating assistant is added for quick help and canned responses; conversation persists locally and can be integrated with a server API later.

Next steps you might want:
- Wire up a backend (auth and talent API).
- Add image assets and sponsor logos.
- Implement server-side form handling and newsletter signup.
