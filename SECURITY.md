# Security Policy

## Reporting a vulnerability

Please do not publish credentials, private data, or detailed exploit instructions in a public issue.

If GitHub offers private vulnerability reporting for this repository, please use it. Otherwise, contact `c0k0n` through [the GitHub profile](https://github.com/c0k0n) with:

- the affected page, file, or version
- clear steps to reproduce the problem
- the possible impact
- any safe evidence that helps confirm the report

## Scope

Basirah is a fully static website hosted on Cloudflare Pages: there is no server, database, authentication, or user-generated content. Relevant reports concern the site itself (HTML/CSS/JS behavior), the build and deployment pipeline (GitHub Actions → Wrangler), or header/CSP configuration. Only the latest deployment of `main` is supported.

Reports are handled on a best-effort basis. Please allow time for investigation before making a report public.
