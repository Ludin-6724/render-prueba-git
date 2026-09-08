<?php
/**
 * Plugin Name: RENDER Menu Uppercase
 * Description: Displays the existing header navigation in uppercase.
 * Version: 1.0.0
 */

defined('ABSPATH') || exit;

add_action('wp_head', static function () {
    echo '<style id="render-menu-uppercase">'
        . '.et-l--header .et-menu a,.et-l--header .et_mobile_menu a{'
        . 'text-transform:uppercase!important;}'
        . '</style>' . "\n";
}, 999);
