#!/usr/bin/env bash
# End-of-session helper: stage everything, commit, and push.
#
#   ./scripts/finish-work.sh "feat: my commit message"
#   ./scripts/finish-work.sh            # uses a timestamped default message
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

if [[ -z "$(git status --porcelain)" ]]; then
  echo "✅ Working tree clean — nothing to commit."
  exit 0
fi

echo "📋 Changes to be committed:"
git status --short
echo

MESSAGE="${1:-chore: work session $(date '+%Y-%m-%d %H:%M')}"

git add -A
git commit -m "$MESSAGE"
git push origin "$(git branch --show-current)"

echo
echo "🚀 Committed and pushed: $MESSAGE"
