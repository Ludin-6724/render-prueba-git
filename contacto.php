<?php
/**
 * RENDER Multimedia — cotización.
 * POST → correo a info@rendermultimedia.com → /thank-you-page/ solo si mail() no falla.
 */

header('X-Content-Type-Options: nosniff');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: /contacto/', true, 303);
    exit;
}

if (!empty($_POST['website'])) {
    header('Location: /', true, 303);
    exit;
}

function field(string $key): string
{
    $raw = isset($_POST[$key]) && is_string($_POST[$key]) ? $_POST[$key] : '';
    $raw = trim(strip_tags($raw));
    return str_replace(["\r", "\n", "\0"], '', $raw);
}

$nombre   = field('nombre');
$empresa  = field('empresa');
$email    = field('email');
$servicio = field('servicio');
$mensaje  = isset($_POST['mensaje']) && is_string($_POST['mensaje'])
    ? trim(strip_tags($_POST['mensaje']))
    : '';

$permitidos = [
    'Producción audiovisual',
    'Diseño gráfico',
    'Marketing digital',
];

if (
    $nombre === '' || $empresa === '' || $mensaje === ''
    || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || !in_array($servicio, $permitidos, true)
    || strlen($nombre) > 120
    || strlen($empresa) > 160
    || strlen($mensaje) > 4000
) {
    header('Location: /contacto/?error=1', true, 303);
    exit;
}

$rateFile = sys_get_temp_dir() . '/render-form-' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'x');
if (is_file($rateFile) && (time() - (int) filemtime($rateFile)) < 30) {
    header('Location: /contacto/?error=1', true, 303);
    exit;
}

$destinatario = 'info@rendermultimedia.com';
$asunto = 'Nueva cotización — ' . $servicio . ' — ' . $nombre;

$cuerpo  = "Nuevo mensaje desde rendermultimedia.com\n";
$cuerpo .= "------------------------------------------\n";
$cuerpo .= 'Nombre:   ' . $nombre . "\n";
$cuerpo .= 'Empresa:  ' . $empresa . "\n";
$cuerpo .= 'Email:    ' . $email . "\n";
$cuerpo .= 'Servicio: ' . $servicio . "\n";
$cuerpo .= "------------------------------------------\n";
$cuerpo .= "Mensaje:\n" . $mensaje . "\n";

$headers  = "From: RENDER Web <no-reply@rendermultimedia.com>\r\n";
$headers .= 'Reply-To: ' . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$ok = mail(
    $destinatario,
    '=?UTF-8?B?' . base64_encode($asunto) . '?=',
    $cuerpo,
    $headers
);

if (!$ok) {
    header('Location: /contacto/?error=1', true, 303);
    exit;
}

@touch($rateFile);
header('Location: /thank-you-page/', true, 303);
exit;
