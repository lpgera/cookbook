#!/usr/bin/env bash

# Usage:
#   PROD_DATABASE_URL=postgres://user:password@host:port/database scripts/pull-production-db.sh
#
# PROD_DATABASE_URL can also be set in the root .env file.

set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -z "${PROD_DATABASE_URL:-}" && -f .env ]]; then
  set -a
  source .env
  set +a
fi

if [[ -z "${PROD_DATABASE_URL:-}" ]]; then
  echo "PROD_DATABASE_URL is not set (pass it as an environment variable or add it to .env)" >&2
  exit 1
fi

LOCAL_USER=cookbook
LOCAL_DB=cookbook

dump_file=$(mktemp)
trap 'rm -f "$dump_file"' EXIT

docker compose up -d --wait db

echo "Dumping production database..."
docker compose exec -T -e PROD_DATABASE_URL db \
  sh -c 'pg_dump --no-owner --no-privileges --dbname="$PROD_DATABASE_URL"' \
  >"$dump_file"

echo "Importing into local database..."
{
  echo 'DROP SCHEMA IF EXISTS public CASCADE;'
  echo 'CREATE SCHEMA public;'
  cat "$dump_file"
} | docker compose exec -T db \
  psql --quiet --set ON_ERROR_STOP=1 --single-transaction \
  --username "$LOCAL_USER" --dbname "$LOCAL_DB" >/dev/null

echo "Done. Run pending migrations with: npm run kysely-migrate-latest -w backend"
