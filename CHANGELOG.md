# Changelog

All notable changes to the **Switch Fiber Subscriber Portal & Web Application** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-08-27

### Added
- **Interactive Fiber Coverage Engine**: Leaflet-powered GIS boundary maps and municipality/barangay coverage lookup across Rizal (Binangonan, Angono, Taytay, Teresa, Cardona, Morong, Baras, Tanay, Antipolo).
- **Online Application Wizard**: 5-step digital onboarding with GPS map location pin picker, Dropzone valid ID document uploader, EXIF metadata extraction, digital signature capture, and instant reference code generation.
- **Application Status Tracker**: Real-time reference code status tracker displaying engineering feasibility audit, line survey, and technician dispatch progression.
- **Serverless Integration Layer**:
  - `api/Plans.js`: Public plan catalog proxy with origin sanitization and cache policies.
  - `api/Applications.js`: Application submission gateway with upstream request validation and payload limits.
  - `api/send-confirmation.js`: Automated branded confirmation emails via Resend API.
  - `api/send-sms.js`: SMS confirmation dispatch via Semaphore Philippine telecom gateway.
- **Quality Gates & Test Suite**:
  - Zero-dependency automated test runner using Node.js native `node:test` and `node:assert/strict`.
  - Comprehensive unit and integration tests covering routes, CALABARZON geography normalization, notifications, proxy security, and domain models.
  - Static code analysis quality gate (`scripts/lint.js`).
- **CI/CD Automation**:
  - GitHub Actions multi-OS and multi-Node CI verification pipeline (`.github/workflows/ci.yml`).
  - Automated release tagging, bundling (`dist.tar.gz`, `dist.zip`), checksum generation, and GitHub Release deployment (`.github/workflows/release.yml`).
- **Containerization & Deployment Hardening**:
  - Multi-stage production `Dockerfile` (`node:20-alpine` $\rightarrow$ `nginx:1.27-alpine`) with container healthcheck.
  - Hardened `nginx.conf` with Gzip compression, SPA fallback routing (`try_files $uri $uri/ /index.html`), 1-year immutable asset caching, and OWASP security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
  - Web App Manifest (`public/manifest.json`) for standalone PWA capability.
- **Community & Governance Suite**:
  - GitHub issue templates for bug reports and feature requests.
  - Pull request template with pre-flight checklist.
  - Comprehensive documentation (`README.md`, `CONTRIBUTING.md`, `RELEASING.md`, `SECURITY.md`, `LICENSE`).

### Security
- Restricted serverless proxy endpoints to strict route allowlist (`/api/Plans`, `/api/Applications`) and allowed HTTP methods.
- Enforced 256KB maximum request payload limits on API endpoints to prevent memory exhaustion attacks.
- Neutralized XSS vectors by HTML-escaping all interpolated variables in email notifications.
- Stripped sensitive database error messages and stack traces from upstream 500 responses before returning to the client.
- Implemented strict Origin isolation without wildcard CORS grants.

[1.0.0]: https://github.com/switchfiber/switchfiberusers/releases/tag/v1.0.0
