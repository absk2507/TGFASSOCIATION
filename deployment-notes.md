# Deployment Notes

- 2026-08-19: The GitHub Pages workflow completed successfully after building and uploading `dist/public`.
- 2026-08-19: The public repository URL initially returned the application shell but rendered the application's internal 404 screen at `/TGF_ASSOCIATION/`.
- 2026-08-19: After applying the Wouter repository base path, the public URL rendered the TGF ASSOCIATION home page. The Pages image URLs returned HTTP 200 from the public site.
- 2026-08-19: A fresh browser session loaded the plain GitHub Pages root URL successfully. A visible HTML loading fallback was also deployed so a future delayed bundle load cannot present as a completely blank page.
- 2026-08-19: After the one-time stale-bundle recovery deployment, a second fresh browser session again rendered the full home page at the plain GitHub Pages root URL without a query parameter.
