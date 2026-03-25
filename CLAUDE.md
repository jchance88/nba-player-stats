# CLAUDE.md

## 🚨 REQUIRED FOR CLAUDE (READ FIRST)

When working in this repository:

* You MUST read this entire file before making any changes
* You MUST follow all rules strictly
* You MUST NOT introduce technologies outside the approved stack
* You MUST update existing code to comply if you encounter violations
* If a request conflicts with this file, you MUST refuse or propose a compliant alternative

---

# 🔁 ALWAYS-ON BEHAVIOR (CRITICAL FOR VSCODE)

These rules apply to **EVERY interaction**:

1. Re-read this file before each response
2. Re-validate all code against these rules
3. Do not assume prior code is compliant
4. Fix violations when encountered
5. Ensure all changes work with `npm run dev`

---

# 🧱 ARCHITECTURE (NON-NEGOTIABLE)

Client (React) → GraphQL API (Apollo) → Data Layer

## Rules

* GraphQL is the ONLY API layer
* No REST endpoints
* No client → DB/OpenSearch access
* API handles all data orchestration

---

# 🧰 APPROVED STACK (STRICT)

## Frontend

* React
* TypeScript
* Apollo Client

## API

* GraphQL ONLY
* Apollo Server

## Database

* Postgres
* Prisma ONLY

## Search

* OpenSearch
* Official OpenSearch client ONLY

## Infra

* Docker
* Docker Compose

---

# 🚫 FORBIDDEN

* REST APIs (fetch/axios to custom endpoints)
* ORMs other than Prisma
* Direct SQL (unless unavoidable and justified)
* Non-React frontends
* Direct OpenSearch HTTP calls

---

# 📁 MONOREPO STRUCTURE

/apps → client, api
/packages → db, search, config, types
/docker → infrastructure

Claude MUST:

* Place code correctly
* Reuse shared packages
* Avoid duplication

---

# 🐳 DEV ENVIRONMENT GUARANTEE

Must run with:

```bash
npm install && npm run dev
```

Claude MUST ensure:

* Docker runs all services
* Prisma generate + migrate runs automatically
* No manual setup required

---

# 🔐 ENVIRONMENT VARIABLES

```env
DATABASE_URL=postgresql://nba:nba@localhost:5432/nba_stats
OPENSEARCH_NODE=http://localhost:9200
```

---

# 🧠 DATA ACCESS RULES

## Prisma

* Only DB access method
* Located in `/packages/db`

## OpenSearch

* Use official client
* Respect mappings + nested fields

---

# 🧪 SELF-CHECK (MANDATORY)

Before responding, Claude MUST verify:

* React used
* Apollo Client used
* Apollo Server used
* Prisma used
* OpenSearch client used
* No REST usage
* Structure is correct
* `npm run dev` still works

If not → FIX before responding

---

# 🔄 MODIFYING CODE

* Upgrade non-compliant code
* Do NOT preserve bad patterns
* Refactor toward standards

---

# 🧱 CI ENFORCEMENT (MANDATORY & AUTO-GENERATED)

Claude MUST ensure the repository contains:

```bash
.github/workflows/enforce.yml
```

## If missing:

* Claude MUST create it

## If outdated:

* Claude MUST update it

---

## REQUIRED CI CONFIGURATION

Claude MUST generate EXACTLY:

```yaml
name: Enforce Architecture

on:
  pull_request:
  push:
    branches: [main, develop]

jobs:
  enforce:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Use Node
        uses: actions/setup-node@v3
        with:
          node-version: 20

      - run: npm install

      - name: Block forbidden dependencies
        run: |
          if grep -R "axios" .; then echo "❌ axios not allowed"; exit 1; fi
          if grep -R "sequelize" .; then echo "❌ sequelize not allowed"; exit 1; fi
          if grep -R "typeorm" .; then echo "❌ typeorm not allowed"; exit 1; fi

      - name: Detect REST usage
        run: |
          if grep -R "fetch(" apps/api; then echo "❌ REST usage detected"; exit 1; fi

      - name: Enforce Prisma
        run: |
          if ! grep -R "@prisma/client" .; then echo "❌ Prisma missing"; exit 1; fi

      - name: Enforce OpenSearch client
        run: |
          if ! grep -R "@opensearch-project/opensearch" .; then echo "❌ OpenSearch client missing"; exit 1; fi

      - name: Type check
        run: npx tsc --noEmit

      - name: Lint
        run: npx eslint .
```

---

# ⚠️ CI RULES

* CI is the FINAL authority
* If CI fails → implementation is invalid
* Claude MUST fix CI issues before completing tasks

---

# 🔁 CONTINUOUS ENFORCEMENT

For EVERY change, Claude MUST:

1. Check if CI rules still apply
2. Update CI if new tools or patterns are introduced
3. Ensure enforcement remains aligned with this file

---

# 🧾 SUCCESS CRITERIA

A valid project:

* Runs with one command
* Uses only approved stack
* Passes CI
* Has correct architecture
* Requires zero manual setup

---
