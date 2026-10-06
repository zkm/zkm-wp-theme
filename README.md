# ZKM WP Theme

[![Package WordPress Theme](https://github.com/zkm/zkm-wp-theme/actions/workflows/package-theme.yml/badge.svg)](https://github.com/zkm/zkm-wp-theme/actions/workflows/package-theme.yml)
[![Release WordPress Theme](https://github.com/zkm/zkm-wp-theme/actions/workflows/release-theme.yml/badge.svg)](https://github.com/zkm/zkm-wp-theme/actions/workflows/release-theme.yml)

This is a standalone WordPress theme with no parent theme dependency.

## Structure check
- Core theme files are present: `style.css`, `functions.php`, `header.php`, `footer.php`, `index.php`, `single.php`, `page.php`.
- Theme metadata is present in `style.css` and required hooks (`wp_head`, `wp_footer`, `wp_body_open`) are in templates.

## Features
- **Logo:** a Solo Jazz swoosh tile sits beside the site title. Set a logo under Appearance → Customize → Site Identity to replace it. The favicon (Site Icon) is set there too and is not part of the theme.
- **Forms:** Fluent Forms is styled to match the theme in dark and light mode (fields, required marker, submit button, errors, success message).
- **Share tags:** `functions.php` outputs a meta description plus Open Graph and Twitter card tags (`@zkm`). Posts use their featured image; everything else uses `assets/images/social-card.jpg` (1200×630). The tags are skipped on 404 pages and when Yoast, All in One SEO, Rank Math, SEOPress or Jetpack adds its own.
- **Fediverse:** a `fediverse:creator` tag credits `@zachschneider@mastodon.social`.

## Menu setup
- Assign a menu to `Primary Menu` for header links.
- Assign a menu to `Footer Menu` for footer links.
- Assign a menu to `Social Menu` for social profile links.

## Local Docker development
1. Copy env template:

	```bash
	cp .env.example .env
	```

2. Start WordPress + MariaDB:

	```bash
	docker compose up -d
	```

3. Open local site:

	```text
	http://localhost:8081
	```

If `8081` is already in use, set `WORDPRESS_PORT` in your `.env` file before starting the stack.

### Local upload limit (2GB)
The Docker setup includes a PHP override at `docker/php/uploads.ini` that sets:
- `upload_max_filesize = 2048M`
- `post_max_size = 2048M`

If containers are already running, restart to apply:

```bash
docker compose down
docker compose up -d
```

The current repository is mounted into the container as theme folder `zkm-wp-theme`.

To stop:

```bash
docker compose down
```

To stop and remove database/content volumes:

```bash
docker compose down -v
```

## GitHub release packaging
A workflow at `.github/workflows/release-theme.yml` builds a release zip and attaches it to GitHub Releases.

### Release checklist
1. Bump `Version:` in the `style.css` header. The theme uses it as the CSS/JS cache-busting version, so every release needs a new number.
2. Commit, then tag and push: `git tag v2.1.3 && git push origin master v2.1.3`.
3. Wait for the Release workflow to finish, then run `./deploy.sh`.

### Automatic release
- Push a tag like `v1.0.2`.
- The workflow packages the theme into `zkm-wp-theme-<version>.zip` and publishes the release.

### Manual release
- Run the workflow from GitHub Actions with `tag_name` input (example: `v1.0.2`).

## Deploying to the live site
After a release is published, run:

```bash
./deploy.sh            # version from style.css
./deploy.sh 2.1.2      # or a specific version
./deploy.sh --check    # stage and verify only, live site untouched
```

The script downloads the release zip to `~/deploy/` on `do-wp`, checks the version and PHP syntax, backs up the live theme to `~/backups/`, installs the new one (asks for your sudo password), purges the Breeze, object and Cloudflare caches, and confirms the live site serves the new version.

To roll back, copy a backup over the theme folder on the server:

```bash
ssh -t do-wp 'sudo rsync -a --delete ~/backups/<backup>/ /var/www/html/wp-content/themes/zkm-wp-theme/ && sudo chown -R www-data:www-data /var/www/html/wp-content/themes/zkm-wp-theme'
```

## CI package artifact (no release)
A second workflow at `.github/workflows/package-theme.yml` packages the theme on every push and pull request (excluding release tags).

- Open GitHub Actions for the run.
- Download the artifact named like `zkm-wp-theme-<version>-<run>.zip` from the run summary.

## Notes
- Styling is in `style.css`.
- Theme setup and custom hooks are in `functions.php`.
- Theme images are in `assets/images/`; `screenshot.jpg` is the preview shown under Appearance → Themes.
- Site backups (`*.wpress` from All-in-One WP Migration) are git-ignored.
