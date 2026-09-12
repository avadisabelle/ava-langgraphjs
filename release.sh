#!/usr/bin/env bash
# Bump, build, test, and publish every Ava LangGraph package at the same version.
#
# Usage: ./release.sh [patch|minor|major]  # default: patch
#
# DRY_RUN=1   Build, test, and validate packages without changing or publishing.
# SKIP_BUMP=1 Resume a failed release using the versions already declared.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

BUMP="${1:-patch}"
DRY_RUN="${DRY_RUN:-0}"
SKIP_BUMP="${SKIP_BUMP:-0}"
PACKAGES=(
  libs/narrative-intelligence
  libs/prompt-decomposition-engine
  libs/inquiry-routing-engine
)
STEP=0

step() { STEP=$((STEP + 1)); printf '\n[%d] %s\n' "$STEP" "$1"; }
die() { printf '\nError: %s\n' "$1" >&2; exit 1; }
trap 'printf "\nRelease failed at step %s. Fix it and resume with SKIP_BUMP=1 ./release.sh.\n" "$STEP" >&2' ERR

case "$BUMP" in
  patch|minor|major) ;;
  *) die "bump must be patch, minor, or major (got: $BUMP)" ;;
esac

step "Preflight"
[[ "$(node -p "require('./package.json').name")" == "@avadisabelle/avalanggraph" ]] \
  || die "run this from the ava-langgraphjs repository"

if [[ "$DRY_RUN" == "1" ]]; then
  echo "DRY_RUN: nothing will be changed or published."
else
  npm whoami >/dev/null 2>&1 || die "not logged in to npm; run: npm login"
  echo "npm user: $(npm whoami)"
fi

if [[ "$SKIP_BUMP" == "1" ]]; then
  VERSION="$(node -p "require('./${PACKAGES[0]}/package.json').version")"
  for dir in "${PACKAGES[@]}"; do
    [[ "$(node -p "require('./$dir/package.json').version")" == "$VERSION" ]] \
      || die "SKIP_BUMP=1 requires every package to have the same version"
  done
  step "Use declared version $VERSION"
else
  VERSION="$(BUMP="$BUMP" node -e '
    const semver = require("semver");
    const versions = process.argv.slice(1).map((dir) => require(`./${dir}/package.json`).version);
    process.stdout.write(semver.inc(versions.sort(semver.rcompare)[0], process.env.BUMP));
  ' "${PACKAGES[@]}")"

  if [[ "$DRY_RUN" == "1" ]]; then
    step "Version preview: $VERSION"
  else
    step "Set every package version to $VERSION"
    node - "$VERSION" "${PACKAGES[@]}" <<'NODE'
const { readFileSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const [version, ...dirs] = process.argv.slice(2);

for (const dir of dirs) {
  const file = join(dir, "package.json");
  const pkg = JSON.parse(readFileSync(file, "utf8"));
  pkg.version = version;
  writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`  ${pkg.name}@${version}`);
}
NODE
  fi
fi

step "Build all packages"
for dir in "${PACKAGES[@]}"; do
  rm -rf "$dir/dist"
  pnpm --dir "$dir" build
done

step "Test all packages"
for dir in "${PACKAGES[@]}"; do
  pnpm --dir "$dir" test
done

step "Verify package contents"
node scripts/check-dts.mjs "${PACKAGES[@]}"

publish_package() {
  local dir="$1" name version
  name="$(node -p "require('./$dir/package.json').name")"
  version="$(node -p "require('./$dir/package.json').version")"

  if [[ "$DRY_RUN" == "1" ]]; then
    echo "  [dry-run] $name@$version"
    (cd "$dir" && npm publish --access public --dry-run >/dev/null)
  elif npm view "$name@$version" version >/dev/null 2>&1; then
    echo "  skip $name@$version (already published)"
  else
    echo "  publish $name@$version"
    (cd "$dir" && npm publish --access public)
  fi
}

step "Publish all packages"
for dir in "${PACKAGES[@]}"; do
  publish_package "$dir"
done

if [[ "$DRY_RUN" == "1" ]]; then
  step "Dry run complete"
else
  step "Commit and tag v$VERSION"
  MANIFESTS=()
  for dir in "${PACKAGES[@]}"; do MANIFESTS+=("$dir/package.json"); done
  git add -- "${MANIFESTS[@]}"
  git diff --cached --quiet || git commit -m "chore: release v$VERSION"
  git rev-parse "refs/tags/v$VERSION" >/dev/null 2>&1 \
    || git tag -a "v$VERSION" -m "release v$VERSION"
  echo "Push with: git push origin main v$VERSION"
fi

trap - ERR
printf '\nRelease complete: %s\n' "$VERSION"
