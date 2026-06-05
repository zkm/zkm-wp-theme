<?php
/**
 * Footer template.
 *
 * @package zkm-wp-theme
 */

?>
<div class="site-footer-wrap">
    <footer class="site-footer" role="contentinfo">
        <div class="footer-bottom">
            <nav class="social-navigation" aria-label="<?php esc_attr_e( 'Social menu', 'zkm-wp-theme' ); ?>">
                <?php
                wp_nav_menu(
                    array(
                        'theme_location' => 'social',
                        'container'      => false,
                        'menu_class'     => 'menu',
                        'fallback_cb'    => false,
                    )
                );
                ?>
            </nav>

            <div class="site-info">
                <span>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?></span>
                <span><?php esc_html_e( 'Built on WordPress', 'zkm-wp-theme' ); ?></span>
            </div>
        </div>
    </footer>
</div>

<button id="zkm-back-to-top" class="back-to-top" type="button" aria-label="<?php esc_attr_e( 'Back to top', 'zkm-wp-theme' ); ?>">
    ↑
</button>

<?php wp_footer(); ?>
</body>
</html>
