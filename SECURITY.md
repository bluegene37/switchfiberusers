# Security Policy

The Switch Fiber Engineering & Security Team takes the safety, integrity, and privacy of our subscribers and systems seriously.

This document describes supported versions, our vulnerability reporting process, and the core architectural security controls of the Switch Fiber Web Application.

---

## 1. Supported Versions

Security updates and patches are actively maintained for the following versions:

| Version | Supported | Security Maintenance Status |
| :--- | :---: | :--- |
| **`1.x.x` (Latest)** | :white_check_mark: | **Active Maintenance & Security Patches** |
| `< 1.0.0` | :x: | End of Life (EOL) |

---

## 2. Reporting a Vulnerability

If you discover a security vulnerability, please follow our **Responsible Disclosure Policy**:

> [!IMPORTANT]
> **DO NOT** disclose security vulnerabilities publicly on GitHub Issues or social channels.

### Reporting Channels
- **Email**: `security@switchfiber.ph` (cc: `customercare@switchfiber.ph`)
- **Subject**: `[SECURITY VULNERABILITY REPORT] <Brief Description>`
- **Response SLA**: Initial triage within **48 hours**, patch deployment target within **7 business days**.

### Information to Include
- A detailed description of the vulnerability and attack vector.
- Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
- Potential impact on applicant data, credentials, or service availability.
- Affected URL endpoints, browsers, or environments.

---

## 3. Web Security Posture & Architecture

The Switch Fiber web application is engineered with defense-in-depth principles:

### A. Serverless Proxy Isolation & Secret Protection
- **No Client-Side Secrets**: Third-party API keys (Resend email API, Semaphore Philippine SMS gateway, upstream backend endpoints) reside exclusively in serverless environments (`api/`) and are never exposed to the client bundle.
- **Strict Route Allowlist**: The serverless gateway (`api/_proxy.js`) permits only explicitly allowlisted routes (`/api/Plans` [GET], `/api/Applications` [POST]). Unlisted internal endpoints cannot be queried by unauthorized clients.
- **Payload Size Limits**: Incoming request payloads are capped at **256 KB** to prevent memory exhaustion and buffer overflow vectors.

### B. Cross-Site Scripting (XSS) & Content Hygiene
- **HTML Entity Encoding**: User inputs interpolated into email templates are strictly sanitized through regex entity replacement (`&`, `<`, `>`, `"`, `'`).
- **Template Context Isolation**: Vue 3's reactive template compiler automatically encodes all dynamic bindings unless explicitly rendered with `v-html`.

### C. HTTP Security Headers
Every static and serverless response includes defensive HTTP response headers:
- `X-Content-Type-Options: nosniff`: Prevents MIME-sniffing exploits.
- `X-Frame-Options: SAMEORIGIN`: Protects against UI clickjacking attacks.
- `Referrer-Policy: strict-origin-when-cross-origin`: Restricts leak of referrer URLs.
- `Permissions-Policy: camera=(self), microphone=(), payment=()`: Restricts sensitive browser device access.
- `Cache-Control: no-store`: Applied to all dynamic API routes to prevent sensitive caching.

### D. Data Privacy Compliance (RA 10173)
- Applicant contact information, valid ID images, and digital signatures are collected exclusively for internet service provisioning and line survey verification in full compliance with the Philippine **Data Privacy Act of 2012 (Republic Act No. 10173)**.
