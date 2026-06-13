#!/bin/bash
# Gamification idempotency guardrail (PostToolUse, Edit|Write).
#
# Deterministic, no LLM call ($0 runtime cost). NEVER blocks: it only surfaces a
# warning when a just-edited points-critical file risks reintroducing the
# double-award / unledgered-points class of bug.
#
# CLAUDE.md rule it protects: "Always award through PointsLedger + awardPoints();
# prevent duplicate grants." The single legitimate point-mutation path is
# awardPoints() in src/lib/gamification/gamification.ts.
set -euo pipefail

input="$(cat)"

# jq is required to parse hook input; degrade silently rather than ever blocking.
if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

file_path="$(printf '%s' "${input}" | jq -r '.tool_input.file_path // empty')"
[ -z "${file_path}" ] && exit 0

# Only TypeScript sources, and only files that actually exist on disk post-edit.
case "${file_path}" in
  *.ts|*.tsx) ;;
  *) exit 0 ;;
esac
[ -f "${file_path}" ] || exit 0

in_module=false
case "${file_path}" in
  */src/lib/gamification/*) in_module=true ;;
esac

# A file is "points-critical" if it lives in the gamification module, or it is an
# API route that touches the points machinery OR writes a point field directly.
point_write_re='(points|weeklyPoints|currentStreak|longestStreak)[[:space:]]*:[[:space:]]*\{?[[:space:]]*(increment|decrement)'
critical=false
if [ "${in_module}" = true ]; then
  critical=true
elif printf '%s' "${file_path}" | grep -qE '/src/app/api/.*/route\.ts$'; then
  if grep -qE 'awardPoints|pointsLedger' "${file_path}" \
    || grep -qE "${point_write_re}" "${file_path}"; then
    critical=true
  fi
fi
[ "${critical}" = true ] || exit 0

findings=""

# Rule 1: direct point-field write OUTSIDE the gamification module bypasses
# awardPoints() — the points never reach PointsLedger.
if [ "${in_module}" = false ]; then
  hits="$(grep -nE "${point_write_re}" "${file_path}" || true)"
  if [ -n "${hits}" ]; then
    findings="${findings}- Direct point-field write detected outside @/lib/gamification — this bypasses awardPoints() so the points will NOT be recorded in PointsLedger. Route the mutation through awardPoints()/updateStreak() instead:
$(printf '%s' "${hits}" | sed 's/^/    /')
"
  fi
fi

# Rule 2: a ledger insert with no visible dedupe guard risks duplicate grants.
if grep -q 'pointsLedger\.create' "${file_path}"; then
  if ! grep -qE 'findFirst|findUnique|existing|dedupe|idempot' "${file_path}"; then
    findings="${findings}- pointsLedger.create is present but no dedupe guard (findFirst/findUnique/existing) is visible in this file — confirm this insert cannot run twice for the same event.
"
  fi
fi

# Nothing risky: stay silent so the guard adds zero friction on clean edits.
if [ -z "${findings}" ]; then
  exit 0
fi

reminder="Gamification idempotency check on ${file_path}"
message="${reminder}

${findings}
Reference: awardPoints() in src/lib/gamification/gamification.ts is the only sanctioned point-mutation path."

jq -n --arg msg "${message}" '{systemMessage: $msg, suppressOutput: false}'
exit 0
