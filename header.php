<?php
/**
 * Header template.
 *
 * @package zkm-custom
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

<div class="site-header-wrap">
    <header class="site-header" role="banner">
        <div class="site-branding">
            <?php if ( has_custom_logo() ) : ?>
                <?php the_custom_logo(); ?>
            <?php endif; ?>

            <?php if ( is_front_page() && is_home() ) : ?>
                <h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
            <?php else : ?>
                <p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
            <?php endif; ?>

            <?php $description = get_bloginfo( 'description', 'display' ); ?>
            <?php if ( $description ) : ?>
                <p class="site-description"><?php echo esc_html( $description ); ?></p>
            <?php endif; ?>
        </div>

        <nav class="main-navigation" aria-label="<?php esc_attr_e( 'Primary menu', 'zkm-custom' ); ?>">
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
    </header>
</div>
