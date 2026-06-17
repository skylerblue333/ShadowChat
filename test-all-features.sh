#!/bin/bash

echo "🧪 SKYCOIN4444 COMPREHENSIVE TEST SUITE"
echo "========================================"

# Test 1: TypeScript compilation
echo -e "\n✓ TEST 1: TypeScript Compilation"
npx tsc --noEmit 2>&1 | grep -c "error TS" && echo "❌ FAILED" || echo "✅ PASSED"

# Test 2: Build check
echo -e "\n✓ TEST 2: Build Check"
pnpm run build 2>&1 | tail -5

# Test 3: Router count
echo -e "\n✓ TEST 3: Router Count"
grep -c "Router = router" server/routers/*.ts 2>/dev/null | wc -l
echo "Routers found"

# Test 4: Database tables
echo -e "\n✓ TEST 4: Database Tables"
grep -c "sqliteTable\|mysqlTable\|pgTable" drizzle/schema.ts
echo "Tables found"

# Test 5: Voice commands
echo -e "\n✓ TEST 5: Voice Commands"
grep -c "pattern:" client/src/hooks/useVoiceNav.ts
echo "Voice commands found"

echo -e "\n✅ ALL TESTS COMPLETED"
