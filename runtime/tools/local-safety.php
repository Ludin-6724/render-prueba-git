<?php
/** Plugin Name: RENDER — aislamiento local (no desplegar) */
if (wp_get_environment_type() !== 'local') { exit('Solo entorno local'); }
// Mantener el inventario original; omitir solo la seguridad de producción en ejecución local.
add_filter('option_active_plugins', static function ($plugins) {
    return array_values(array_diff($plugins, ['better-wp-security/better-wp-security.php']));
});
add_filter('pre_http_request', static function () {
    return new WP_Error('render_local_offline', 'Conexión externa bloqueada en la copia local.');
}, PHP_INT_MAX, 3);
add_filter('automatic_updater_disabled', '__return_true');
add_filter('action_scheduler_allow_async_request_runner', '__return_false');
add_filter('pre_schedule_event', '__return_false');
add_filter('pre_reschedule_event', '__return_false');
add_filter('admin_email_check_interval', '__return_false');
add_filter('wp_mail_from', static fn () => 'wordpress@render.invalid', PHP_INT_MAX);
add_filter('wp_mail_from_name', static fn () => 'RENDER local', PHP_INT_MAX);
add_filter('wp_mail', static function ($args) {
    // Captura sintética: ni siquiera Mailpit recibe direcciones reales.
    $args['to'] = ['captura@render.invalid'];
    $args['headers'] = [];
    return $args;
}, PHP_INT_MAX);
add_action('phpmailer_init', static function ($mailer) {
    $mailer->isSMTP();
    $mailer->Host = 'mail';
    $mailer->Port = 1025;
    $mailer->SMTPAuth = false;
    $mailer->SMTPSecure = '';
    $mailer->SMTPAutoTLS = false;
    $mailer->From = 'wordpress@render.invalid';
    $mailer->FromName = 'RENDER local';
    $mailer->clearCCs();
    $mailer->clearBCCs();
    $mailer->clearReplyTos();
}, PHP_INT_MAX);
function render_local_navigation_guard() {
    echo '<script>document.addEventListener("click",function(e){const a=e.target.closest("a[href]");if(!a)return;try{const u=new URL(a.href,location.href);if(u.origin!==location.origin){e.preventDefault();e.stopImmediatePropagation();alert("Copia local: enlace externo bloqueado para esta prueba.");}}catch(_){}},true);</script>';
}
add_action('wp_head', 'render_local_navigation_guard', 0);
add_action('admin_head', 'render_local_navigation_guard', 0);
