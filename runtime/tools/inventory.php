<?php
// Ejecutar con wp eval-file. Resultados completos solo en el directorio privado.
require_once ABSPATH . 'wp-admin/includes/plugin.php';
$data = ['captured_at' => gmdate('c'), 'siteurl' => get_option('siteurl'),
    'home' => get_option('home'), 'front_page' => get_option('page_on_front'),
    'permalink_structure' => get_option('permalink_structure'),
    'theme' => ['template' => get_option('template'), 'stylesheet' => get_option('stylesheet'),
        'version' => wp_get_theme()->get('Version')],
    'plugins' => [], 'pages' => [], 'menus' => [], 'attachments' => [], 'divi_layouts' => [],
    'theme_customizations' => [], 'custom_css' => []];
$active = get_option('active_plugins', []);
foreach (get_plugins() as $path => $plugin) {
    $data['plugins'][] = ['path' => $path, 'name' => $plugin['Name'], 'version' => $plugin['Version'],
        'active' => in_array($path, $active, true)];
}
foreach (get_posts(['post_type' => 'page', 'post_status' => 'any', 'numberposts' => -1]) as $p) {
    preg_match_all('/\[(et_pb_[\w]+)\b/', $p->post_content, $modules);
    preg_match_all('/https?:\/\/[^\s"\x27<>\[\]]+/', html_entity_decode($p->post_content), $urls);
    preg_match_all('/\[et_pb_(?:contact_form|code)\b[^\]]*\](?:.*?\[\/et_pb_code\])?/s', $p->post_content, $forms);
    $data['pages'][] = ['id' => $p->ID, 'title' => $p->post_title, 'slug' => $p->post_name,
        'status' => $p->post_status, 'url' => get_permalink($p), 'parent' => $p->post_parent,
        'content' => $p->post_content, 'text' => html_entity_decode(wp_strip_all_tags(preg_replace('/\[\/?et_pb_[^\]]*\]/', '', $p->post_content))),
        'modules' => array_count_values($modules[1]), 'urls' => array_values(array_unique($urls[0])),
        'forms_and_code' => $forms[0], 'custom_css' => get_post_meta($p->ID, '_et_pb_custom_css', true)];
}
foreach (wp_get_nav_menus() as $menu) {
    $items = [];
    foreach (wp_get_nav_menu_items($menu->term_id) ?: [] as $item) {
        $items[] = ['title' => $item->title, 'url' => $item->url, 'parent' => $item->menu_item_parent,
            'object_id' => $item->object_id, 'type' => $item->type];
    }
    $data['menus'][] = ['name' => $menu->name, 'items' => $items];
}
foreach (get_posts(['post_type' => 'attachment', 'post_status' => 'any', 'numberposts' => -1]) as $p) {
    $path = get_attached_file($p->ID);
    $data['attachments'][] = ['id' => $p->ID, 'title' => $p->post_title, 'mime' => $p->post_mime_type,
        'url' => wp_get_attachment_url($p->ID), 'file' => get_post_meta($p->ID, '_wp_attached_file', true),
        'exists' => is_file($path), 'alt' => get_post_meta($p->ID, '_wp_attachment_image_alt', true)];
}
foreach (get_posts(['post_type' => ['et_pb_layout','et_header_layout','et_footer_layout','et_template'], 'post_status' => 'any', 'numberposts' => -1]) as $p) {
    $data['divi_layouts'][] = ['id' => $p->ID, 'type' => $p->post_type, 'title' => $p->post_title, 'status' => $p->post_status, 'content' => $p->post_content];
}
foreach (get_posts(['post_type' => 'custom_css', 'post_status' => 'any', 'numberposts' => -1]) as $p) {
    $data['custom_css'][] = ['id' => $p->ID, 'theme' => $p->post_name, 'css' => $p->post_content];
}
$divi = get_option('et_divi', []);
foreach (['custom_css', 'integration_head', 'integration_body', 'integration_single_top', 'integration_single_bottom'] as $key) {
    if (!empty($divi[$key])) $data['theme_customizations'][$key] = $divi[$key];
}
file_put_contents('/var/local-evidence/inventory.json', wp_json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
echo "Inventario privado generado.\n";
