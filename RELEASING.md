# Release Guide & Procedures

This document outlines the release lifecycle, versioning guidelines, pre-flight verification checklist, and rollback procedures for the **Switch Fiber Subscriber Portal & Web Application**.

---

## 1. Versioning Strategy

Switch Fiber follows [Semantic Versioning 2.0.0](https://semver.org/):

$$\text{Format: } \mathbf{v\text{MAJOR}.\text{MINOR}.\text{PATCH}}$$

- **MAJOR (`vX.0.0`)**: Incompatible API changes, major routing refactors, or significant breaking architectural updates.
- **MINOR (`v0.X.0`)**: Backward-compatible new features (e.g., new coverage municipality, additional payment provider integration).
- **PATCH (`v0.0.X`)**: Backward-compatible bug fixes, UI styling patches, security hotfixes, or dependency updates.

Release tags must always begin with a lowercase `v` (e.g., `v1.0.0`).

---

## 2. Release Lifecycle & Pre-Flight Checklist

Before cutting any release branch or publishing a git tag, complete this verification checklist:

### Pre-Flight Verification Checklist
- [ ] **1. Clean Working Tree**: Ensure all work is committed and there are no untracked or modified files (`git status`).
- [ ] **2. Static Analysis Pass**: Run `npm run lint` and ensure 0 syntax or formatting errors.
- [ ] **3. Automated Test Suite**: Run `npm test` and ensure 100% green pass on all unit and integration test suites.
- [ ] **4. Production Build Verification**: Run `npm run build` and ensure clean bundle compilation without warnings.
- [ ] **5. Local Preview**: Run `npm run preview` to inspect the production bundle in a local browser environment.
- [ ] **6. Version Bump**: Update `"version"` in `package.json` to match the target release.
- [ ] **7. Changelog Update**: Document all additions, changes, fixes, and security improvements under the new release header in `CHANGELOG.md`.

---

## 3. Standard Release Workflow

### Automated CI/CD Release (Recommended)

1. **Update Version & Changelog**:
   ```bash
   npm version 1.0.1 --no-git-tag-version
   # Update CHANGELOG.md with the new version section and date
   ```

2. **Commit and Tag**:
   ```bash
   git add package.json package-lock.json CHANGELOG.md
   git commit -m "chore(release): bump version to v1.0.1"
   git tag -a v1.0.1 -m "Release v1.0.1"
   ```

3. **Push to Remote**:
   ```bash
   git push origin main
   git push origin v1.0.1
   ```

4. **GitHub Actions Execution**:
   - The `.github/workflows/release.yml` workflow triggers automatically on tag push.
   - Runs full quality gates (`npm run lint`, `npm test`, `npm run build`).
   - Compiles production distribution artifacts (`dist.tar.gz`, `dist.zip`).
   - Generates SHA256 checksums (`checksums.txt`).
   - Drafts and publishes an official GitHub Release with release archives attached.

---

## 4. Manual Release Packaging (Air-Gapped / Standalone)

To build and package production release archives locally:

```bash
# 1. Compile production bundle
npm run build

# 2. Package tarball and zip archives
tar -czf dist.tar.gz -C dist .
zip -r dist.zip dist/

# 3. Generate SHA-256 Checksums
shasum -a 256 dist.tar.gz dist.zip > checksums.txt

# 4. Verify checksum integrity
shasum -a 256 -c checksums.txt
```

---

## 5. Docker Container Release

To build and publish containerized production images:

```bash
# Build multi-stage production image
docker build -t switchfiber/portal:1.0.0 -t switchfiber/portal:latest .

# Verify container locally
docker run -d --name switchfiber-preview -p 8080:80 switchfiber/portal:latest

# Check health endpoint
curl -I http://localhost:8080/

# Stop and clean up preview
docker rm -f switchfiber-preview
```

---

## 6. Rollback & Hotfix Procedures

### Production Rollback (Vercel / Netlify / CDN)
1. Navigate to the deployment dashboard (Vercel / Netlify).
2. Locate the previous healthy deployment hash or release tag.
3. Click **Instant Rollback / Promote to Production**.
4. Traffic is immediately redirected to the prior immutable build within seconds.

### Emergency Hotfix Process
1. Branch from `main` or the current release tag:
   ```bash
   git checkout -b hotfix/v1.0.2 main
   ```
2. Apply the surgical fix and add automated regression test in `tests/`.
3. Verify quality gates: `npm test && npm run lint && npm run build`.
4. Bump patch version in `package.json` and document in `CHANGELOG.md`.
5. Merge into `main` and push the new patch tag `v1.0.2`.
