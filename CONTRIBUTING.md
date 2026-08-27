# Contributing to Switch Fiber

Thank you for your interest in contributing to the **Switch Fiber Web Application & Subscriber Portal**! We welcome bug reports, documentation enhancements, feature requests, and code contributions.

Please review the guidelines below to ensure a smooth collaboration process.

---

## 1. Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for all contributors. Please treat everyone with respect and professionalism.

---

## 2. Prerequisites & Local Development Setup

### System Requirements
- **Node.js**: >= 18.0.0 (Node 20 or 22 LTS recommended)
- **npm**: >= 9.0.0
- **Git**: >= 2.30

### Initial Setup
```bash
# 1. Clone the repository
git clone https://github.com/switchfiber/switchfiberusers.git
cd switchfiberusers

# 2. Install dependencies
npm ci

# 3. Configure environment variables
cp .env.example .env

# 4. Start the local development server (with dev API middleware)
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 3. Branching Strategy

All development work should take place on dedicated branches cut from `main`:

| Branch Prefix | Purpose | Example |
| :--- | :--- | :--- |
| `feature/` | New functionality, views, or UI components | `feature/maya-qr-payment` |
| `fix/` | Bug fixes and patches | `fix/coverage-map-center` |
| `docs/` | Documentation improvements | `docs/api-guide-update` |
| `test/` | Adding or updating automated tests | `test/registration-wizard` |
| `chore/` | Maintenance, dependencies, or tooling | `chore/update-tailwind` |

---

## 4. Conventional Commits Standard

We adhere to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

$$\text{Format: } \mathbf{<type>(<scope>):\ <description>}$$

### Allowed Types
- **`feat`**: A new feature (e.g., `feat(coverage): add Cardona municipality boundary data`)
- **`fix`**: A bug fix (e.g., `fix(proxy): normalize mobile number input length`)
- **`docs`**: Documentation updates (e.g., `docs(readme): add Docker run command`)
- **`style`**: Formatting, white-space changes (no functional changes)
- **`refactor`**: Code changes that neither fix a bug nor add a feature
- **`test`**: Adding missing tests or correcting existing tests
- **`chore`**: Tooling, CI configuration, package version updates

---

## 5. Quality Gates & Testing

Before submitting a pull request, ensure all quality gates pass cleanly:

```bash
# Run unit and integration tests
npm test

# Run static analysis and syntax validation
npm run lint

# Compile production bundle
npm run build
```

---

## 6. Submitting Pull Requests

1. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request against the `main` branch.
3. Fill out the provided **Pull Request Template**:
   - Provide a concise summary of changes.
   - Reference any linked issues (e.g., `Closes #42`).
   - Check all pre-flight verification items.
4. Ensure all automated CI checks pass on GitHub Actions.
5. Address any code review comments promptly.
