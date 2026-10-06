<?php
/**
 * Header template.
 *
 * @package zkm-wp-theme
 */

?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'zkm-wp-theme' ); ?></a>

<div class="site-header-wrap">
    <header class="site-header" role="banner">
        <div class="site-branding">
            <?php if ( has_custom_logo() ) : ?>
                <?php the_custom_logo(); ?>
            <?php else : ?>
                <a class="custom-logo-link zkm-logo-mark" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" tabindex="-1" aria-hidden="true"></a>
            <?php endif; ?>

            <?php if ( is_front_page() || is_home() ) : ?>
                <h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
            <?php else : ?>
                <p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
            <?php endif; ?>

            <?php $description = get_bloginfo( 'description', 'display' ); ?>
            <?php if ( $description ) : ?>
                <p class="site-description"><?php echo esc_html( $description ); ?></p>
            <?php endif; ?>
        </div>

        <div class="header-controls">
            <button id="zkm-menu-toggle" class="menu-toggle" type="button" aria-controls="zkm-primary-menu" aria-expanded="false" aria-label="<?php esc_attr_e( 'Open menu', 'zkm-wp-theme' ); ?>">
                <span class="menu-toggle-bars" aria-hidden="true"><span></span><span></span><span></span></span>
                <span class="screen-reader-text"><?php esc_html_e( 'Menu', 'zkm-wp-theme' ); ?></span>
            </button>

            <nav id="zkm-primary-menu" class="main-navigation" aria-label="<?php esc_attr_e( 'Primary menu', 'zkm-wp-theme' ); ?>">
                <?php
                wp_nav_menu(
                    array(
                        'theme_location' => 'primary',
                        'container'      => false,
                        'menu_class'     => 'menu',
                        'fallback_cb'    => 'wp_page_menu',
                    )
                );
                ?>
            </nav>

            <button id="zkm-theme-toggle" class="theme-toggle" type="button" aria-live="polite" aria-label="<?php esc_attr_e( 'Toggle color mode', 'zkm-wp-theme' ); ?>">
                <span class="theme-toggle-icon" aria-hidden="true">◐</span>
                <span class="theme-toggle-label"><?php esc_html_e( 'Theme', 'zkm-wp-theme' ); ?></span>
            </button>
        </div>
    </header>
</div>
