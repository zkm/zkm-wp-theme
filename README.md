# ZKM WP Theme

[![Package WordPress Theme](https://github.com/zkm/zkm-wp-theme/actions/workflows/package-theme.yml/badge.svg)](https://github.com/zkm/zkm-wp-theme/actions/workflows/package-theme.yml)
[![Release WordPress Theme](https://github.com/zkm/zkm-wp-theme/actions/workflows/release-theme.yml/badge.svg)](https://github.com/zkm/zkm-wp-theme/actions/workflows/release-theme.yml)

This is a standalone WordPress theme with no parent theme dependency.

## Structure check
- Core theme files are present: `style.css`, `functions.php`, `header.php`, `footer.php`, `index.php`, `single.php`, `page.php`.
- Theme metadata is present in `style.css` and required hooks (`wp_head`, `wp_footer`, `wp_body_open`) are in templates.

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
	http://localhost:8080
	```

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

### Automatic release
- Push a tag like `v1.0.2`.
- The workflow packages the theme into `zkm-wp-theme-<version>.zip` and publishes the release.

### Manual release
- Run the workflow from GitHub Actions with `tag_name` input (example: `v1.0.2`).

## CI package artifact (no release)
A second workflow at `.github/workflows/package-theme.yml` packages the theme on every push and pull request (excluding release tags).

- Open GitHub Actions for the run.
- Download the artifact named like `zkm-wp-theme-<version>-<run>.zip` from the run summary.

## Notes
- Styling is in `style.css`.
- Theme setup and custom hooks are in `functions.php`.
