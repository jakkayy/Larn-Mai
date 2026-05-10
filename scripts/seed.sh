#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ -f "$ROOT_DIR/.env" ]; then
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env"
else
  # shellcheck disable=SC1091
  source "$ROOT_DIR/.env.example"
fi

SEED_FILE="$ROOT_DIR/backend/seeds/0001_initial_data.sql"

if [ ! -f "$SEED_FILE" ]; then
  echo "Seed file not found: $SEED_FILE" >&2
  exit 1
fi

docker compose exec -T postgres psql \
  -U "${POSTGRES_USER}" \
  -d "${POSTGRES_DB}" \
  -v ON_ERROR_STOP=1 \
  -c "SET app.admin_username = '${ADMIN_USERNAME}';" \
  -c "SET app.admin_password = '${ADMIN_PASSWORD}';" \
  -c "SET app.company_signature_url = '${COMPANY_SIGNATURE_URL}';" \
  -f - < "$SEED_FILE"
