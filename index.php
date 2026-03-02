<?php
/**
 * Main template file.
 *
 * @package zkm-wp-theme
 */

get_header();
?>

<main id="primary" class="site-main">
    <div class="content-area">
        <?php if ( have_posts() ) : ?>
            <?php while ( have_posts() ) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class( is_page( 'about' ) ? 'is-about-page' : '' ); ?>>
                    <header class="entry-header">
                        <?php if ( is_singular() ) : ?>
                            <h1 class="entry-title"><?php the_title(); ?></h1>
                        <?php else : ?>
                            <h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                        <?php endif; ?>
                    </header>

                    <?php if ( has_post_thumbnail() && ! is_page( 'about' ) ) : ?>
                        <div class="entry-thumbnail">
                            <a class="entry-thumbnail-link" href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
                                <?php the_post_thumbnail( 'large' ); ?>
                            </a>
                        </div>
                    <?php endif; ?>

                    <div id="entry-content-<?php the_ID(); ?>" class="entry-content">
                        <?php
                        if ( is_singular() ) {
                            the_content();
                        } else {
                            the_excerpt();
                        }
                        ?>
                    </div>
                </article>
            <?php endwhile; ?>

            <?php the_posts_navigation(); ?>
        <?php else : ?>
            <article class="post">
                <header class="entry-header">
                    <h1 class="entry-title"><?php esc_html_e( 'Nothing found', 'zkm-wp-theme' ); ?></h1>
                </header>
                <div class="entry-content">
                    <p><?php esc_html_e( 'It seems we can’t find what you’re looking for.', 'zkm-wp-theme' ); ?></p>
                </div>
            </article>
        <?php endif; ?>
    </div>
</main>

<?php
get_footer();
