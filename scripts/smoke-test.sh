#!/usr/bin/env bash
# ============================================================
# End-to-end API smoke test for AI Knowledge Twin
# Boots the dev server, logs in as the demo user, and exercises
# every page-facing API the frontend calls.
#
# Usage:
#   bash scripts/smoke-test.sh            # uses .env.local MONGO_URI as-is
#   bash scripts/smoke-test.sh <MONGO_URI>  # override for this run only
# ============================================================
set -u

PORT="${SMOKE_PORT:-3210}"
BASE="http://localhost:$PORT"
MONGO="${1:-}"
LOG=/tmp/next-smoke.log

PASS=0; FAIL=0
ok()   { PASS=$((PASS+1)); echo "  ✅ $1"; }
bad()  { FAIL=$((FAIL+1)); echo "  ❌ $1"; }

# --- 1. Boot server ---------------------------------------------------
if [ -n "$MONGO" ]; then
  echo "🚀 Booting dev server on :$PORT (MONGO_URI override provided)"
  env MONGO_URI="$MONGO" npx next dev --webpack -p "$PORT" > "$LOG" 2>&1 &
else
  echo "🚀 Booting dev server on :$PORT (MONGO_URI from .env.local)"
  npx next dev --webpack -p "$PORT" > "$LOG" 2>&1 &
fi
SERVER_PID=$!

for i in $(seq 1 40); do
  sleep 2
  CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$BASE/" 2>/dev/null || echo 000)
  if [ "$CODE" = "200" ]; then echo "   server ready (attempt $i)"; break; fi
done
CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$BASE/" 2>/dev/null || echo 000)
if [ "$CODE" != "200" ]; then
  echo "❌ Server failed to boot; log:"; tail -20 "$LOG"
  kill $SERVER_PID 2>/dev/null
  exit 1
fi

# --- 2. Auth ----------------------------------------------------------
echo "🔐 Auth flow"
LOGIN=$(curl -s --max-time 30 -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@congicore.ai","password":"Demo@1234"}')
TOKEN=$(echo "$LOGIN" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
if [ -n "$TOKEN" ]; then ok "login returns JWT"; else bad "login failed: $(echo "$LOGIN" | head -c 150)"; fi

AUTH="Authorization: Bearer $TOKEN"

REG=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 -X POST "$BASE/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"firstName\":\"Smoke\",\"lastName\":\"Test\",\"email\":\"smoke-$(date +%s)@test.dev\",\"password\":\"Test@1234\"}")
[ "$REG" = "201" ] || [ "$REG" = "200" ] && ok "register works ($REG)" || bad "register → $REG"

BADLOGIN=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 -X POST "$BASE/api/auth/login" \
  -H "Content-Type: application/json" -d '{"email":"demo@congicore.ai","password":"wrong"}')
[ "$BADLOGIN" = "401" ] || [ "$BADLOGIN" = "400" ] && ok "wrong password rejected ($BADLOGIN)" || bad "wrong password → $BADLOGIN"

# --- 3. Page-facing GETs ---------------------------------------------
echo "📊 Page-facing APIs"
for ep in "/api/dashboard/stats" "/api/documents" "/api/memories" "/api/chat" "/api/graph" "/api/billing" "/api/billing/subscription" "/api/profile" "/api/settings" "/api/analytics"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 -H "$AUTH" "$BASE$ep")
  if [ "$CODE" = "200" ]; then ok "GET $ep"; else bad "GET $ep → $CODE"; fi
done

# --- 4. RecentActivity shape (dashboard page consumes this) ----------
STATS=$(curl -s --max-time 30 -H "$AUTH" "$BASE/api/dashboard/stats")
echo "$STATS" | grep -q '"recentActivities"' && ok "stats include recentActivities" || bad "stats missing recentActivities"

# --- 5. Billing shape (billing page consumes this) -------------------
BILL=$(curl -s --max-time 30 -H "$AUTH" "$BASE/api/billing")
echo "$BILL" | grep -q '"currentPlan"' && echo "$BILL" | grep -q '"billingHistory"' \
  && ok "billing returns currentPlan + billingHistory" || bad "billing shape wrong: $(echo "$BILL" | head -c 120)"

# --- 6. Memory review (SM-2) ------------------------------------------
MID=$(curl -s --max-time 30 -H "$AUTH" "$BASE/api/memories" | grep -o '"_id":"[a-f0-9]\{24\}"' | head -1 | cut -d'"' -f4)
CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 -X POST -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"quality":4}' "$BASE/api/memories/$MID/review")
[ "$CODE" = "200" ] && ok "SM-2 memory review" || bad "memory review → $CODE"

# --- 7. Chat message (RAG twin pipeline; OpenAI optional) -------------
echo "🤖 RAG twin chat"
CHAT=$(curl -s --max-time 30 -H "$AUTH" "$BASE/api/chat")
CID=$(echo "$CHAT" | grep -o '"_id":"[a-f0-9]\{24\}"' | head -1 | cut -d'"' -f4)
if [ -z "$CID" ]; then
  CID=$(curl -s --max-time 30 -X POST -H "$AUTH" -H "Content-Type: application/json" \
    -d '{"title":"Smoke Test Session","messages":[]}' "$BASE/api/chat" | grep -o '"_id":"[a-f0-9]\{24\}"' | head -1 | cut -d'"' -f4)
fi
CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 60 -X POST -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"message":"What is scaled dot-product attention?"}' "$BASE/api/chat/message?id=$CID" 2>/dev/null)
# try standard body form too
BODY=$(curl -s --max-time 90 -X POST -H "$AUTH" -H "Content-Type: application/json" \
  -d "{\"chatId\":\"$CID\",\"message\":\"What is scaled dot-product attention?\"}" "$BASE/api/chat/message")
if echo "$BODY" | grep -q '"response"'; then
  ok "RAG chat responds ($(echo "$BODY" | grep -o '"response"' | head -1))"
elif [ "$CODE" = "200" ]; then
  ok "RAG chat responds (query param)"
else
  bad "chat message → $(echo "$BODY" | head -c 150)"
fi

# --- 8. Settings round-trip -------------------------------------------
S=$(curl -s --max-time 30 -H "$AUTH" "$BASE/api/settings")
echo "$S" | grep -q '"settings"' && ok "settings GET (notification/ai/appearance)" || bad "settings shape: $(echo "$S" | head -c 120)"
CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 -X PUT -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"notification":{"email":true,"push":true,"weekly":true,"aiInsights":true},"ai":{"model":"GPT-4o (Recommended)","responseStyle":"Balanced","language":"English","learningPace":"Moderate","difficultyLevel":"Intermediate","adaptiveLearning":true},"appearance":{"isDarkMode":true,"accentColor":"blue","fontSize":"Medium","compactMode":false}}' \
  "$BASE/api/settings")
[ "$CODE" = "200" ] && ok "settings PUT round-trip" || bad "settings PUT → $CODE"

# --- 9. Billing verify (checkout → success flow) ----------------------
CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 -X POST -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"sessionId":"smoke-test"}' "$BASE/api/billing/verify")
[ "$CODE" = "200" ] && ok "billing/verify (checkout→success flow)" || bad "billing/verify → $CODE"

# --- Summary ----------------------------------------------------------
echo ""
echo "══════════════════════════════════════"
echo "Smoke test: $PASS passed, $FAIL failed"
echo "══════════════════════════════════════"
kill $SERVER_PID 2>/dev/null
[ $FAIL -eq 0 ] && exit 0 || exit 1
