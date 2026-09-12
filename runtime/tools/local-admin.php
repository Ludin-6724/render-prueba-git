<?php
// Exclusivo de la base local; contraseña almacenada fuera de Git.
if (wp_get_environment_type() !== 'local' || DB_NAME !== 'render_local' || DB_HOST !== 'db') exit('Entorno incorrecto');
$name = 'render_local_admin';
$password = trim(file_get_contents('/run/secrets/admin_password'));
$id = username_exists($name);
if (!$id) $id = wp_create_user($name, $password, 'admin@render.invalid');
if (is_wp_error($id)) exit('No se pudo crear el administrador local');
$user = new WP_User($id);
$user->set_role('administrator');
echo "Administrador local preparado; contraseña en private/local-secrets/admin_password.\n";
