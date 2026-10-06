#!/usr/bin/env bash
# Deploy a released theme version to the live site.
#
# Usage:
#   ./deploy.sh [version]          Stage, install, purge caches, verify.
#   ./deploy.sh --check [version]  Stage and verify only; the live site is untouched.
#
# The version defaults to the "Version:" header in style.css. The GitHub
# release (tag v<version>) must already exist. Installing asks for your sudo
# password on the server; every other step runs without it.
#
# Environment overrides: DEPLOY_HOST (default do-wp), SITE_URL.

set -euo pipefail

HOST="${DEPLOY_HOST:-do-wp}"
SITE_URL="${SITE_URL:-https://www.zachschneider.com}"
REPO="zkm/zkm-wp-theme"
SLUG="zkm-wp-theme"
WP_PATH="/var/www/html"

CHECK_ONLY=0
if [[ "${1:-}" == "--check" ]]; then
    CHECK_ONLY=1
    shift
fi

cd "$(dirname "$0")"
VERSION="${1:-$(sed -n 's/^Version: //p' style.css)}"
VERSION="${VERSION#v}"
if [[ ! "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Invalid version: '$VERSION'" >&2
    exit 1
fi
ZIP_URL="https://github.com/$REPO/releases/download/v$VERSION/$SLUG-$VERSION.zip"
STAGE_DIR="deploy/$SLUG-$VERSION"

echo "==> Checking release v$VERSION"
if ! curl -fsSIL -o /dev/null "$ZIP_URL"; then
    echo "No release asset at $ZIP_URL. Tag and push v$VERSION first." >&2
    exit 1
fi

echo "==> Staging on $HOST:~/$STAGE_DIR"
ssh -o BatchMode=yes "$HOST" bash -s -- "$VERSION" "$ZIP_URL" "$SLUG" "$WP_PATH" "$STAGE_DIR" <<'REMOTE'
set -euo pipefail
VERSION=$1 ZIP_URL=$2 SLUG=$3 WP_PATH=$4 STAGE_DIR=$5
D="$HOME/$STAGE_DIR"

rm -rf "$D"
mkdir -p "$D"
cd "$D"
curl -fsSL -o theme.zip "$ZIP_URL"
unzip -q theme.zip

STAGED=$(sed -n 's/^Version: //p' "$SLUG/style.css")
if [ "$STAGED" != "$VERSION" ]; then
    echo "Staged style.css says '$STAGED', expected '$VERSION'" >&2
    exit 1
fi
for f in "$SLUG"/*.php; do
    php -l "$f" >/dev/null
done

LIVE=$(sed -n 's/^Version: //p' "$WP_PATH/wp-content/themes/$SLUG/style.css")
echo "live: ${LIVE:-unknown}  staged: $STAGED"

cat > install.sh <<EOF
set -euo pipefail
T="$WP_PATH/wp-content/themes/$SLUG"
B="\$HOME/backups/$SLUG-${LIVE:-unknown}-\$(date +%Y%m%d-%H%M%S)"
mkdir -p "\$HOME/backups"
sudo cp -a "\$T" "\$B"
echo "backup: \$B"
sudo rsync -a --delete "$D/$SLUG/" "\$T/"
sudo chown -R www-data:www-data "\$T"
cd "$WP_PATH"
sudo -u www-data wp breeze purge --cache=all
sudo -u www-data wp cache flush
EOF
REMOTE

if (( CHECK_ONLY )); then
    echo "==> Check passed. Run ./deploy.sh $VERSION to install."
    exit 0
fi

echo "==> Installing (sudo password required)"
ssh -t "$HOST" "bash ~/$STAGE_DIR/install.sh"

echo "==> Purging Cloudflare cache"
ssh -o BatchMode=yes "$HOST" "cd $WP_PATH && wp eval-file - 2>/dev/null" <<'PHP' || echo "Cloudflare purge failed; purge it from Settings → Cloudflare." >&2
<?php
if ( ! class_exists( '\CF\WordPress\Hooks' ) ) {
    echo "Cloudflare plugin not active, skipped\n";
    return;
}
$hooks = new \CF\WordPress\Hooks();
$purge = function () {
    $domains = $this->integrationAPI->getDomainList();
    if ( ! $domains ) {
        return 'no Cloudflare domain configured';
    }
    $zone = $this->api->getZoneTag( $domains[0] );
    if ( ! $zone ) {
        return 'no Cloudflare zone for ' . $domains[0];
    }
    return $domains[0] . ': ' . ( $this->api->zonePurgeCache( $zone ) ? 'purge succeeded' : 'purge failed' );
};
echo Closure::bind( $purge, $hooks, get_class( $hooks ) )(), "\n";
PHP

echo "==> Verifying $SITE_URL"
LIVE_VERSION=$(curl -fsS "$SITE_URL/" | grep -oE 'style\.css\?ver=[0-9.]+' | head -n 1 | sed 's/.*ver=//' || true)
if [[ "$LIVE_VERSION" == "$VERSION" ]]; then
    echo "Deployed $VERSION."
else
    echo "Live site reports '${LIVE_VERSION:-nothing}', expected $VERSION." >&2
    exit 1
fi
