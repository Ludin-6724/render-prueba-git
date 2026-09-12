"""Cliente UAPI de lectura de dominios, archivos, respaldos y repositorios Git.

Uso: python3 scripts/cpanel_read.py
La salida CLI solo indica el resultado de la conexión, sin datos de la cuenta.
get_file_content sirve para analizar texto, no para respaldar binarios.
"""
import json
import ssl
import posixpath
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def config():
    values = {}
    for line in (ROOT / '.env.local').read_text().splitlines():
        if line.strip() and not line.lstrip().startswith('#'):
            key, value = line.split('=', 1)
            values[key.strip()] = value.strip()
    return values


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def query(operation, **params):
    cfg = config()
    allowed = {
        'list_domains': {},
        'single_domain_data': {'domain': 'rendermultimedia.com'},
        'list_files': {},
        'get_file_content': {},
        'list_backups': {},
        'git_repositories': {},
    }
    if operation not in allowed:
        raise ValueError('Operación no autorizada')
    module = 'DomainInfo'
    function = operation
    if operation in ('list_files', 'get_file_content'):
        module = 'Fileman'
        permitted = {'dir', 'show_hidden'} if operation == 'list_files' else {'dir', 'file'}
        if set(params) - permitted:
            raise ValueError('Parámetros inesperados')
        root = cfg.get('RENDER_DOCUMENT_ROOT', '')
        directory = params.get('dir', '')
        if not root or not directory or posixpath.commonpath([root, posixpath.normpath(directory)]) != root:
            raise ValueError('Ruta fuera de la instalación confirmada')
        if operation == 'get_file_content':
            name = params.get('file', '')
            if not name or name != posixpath.basename(name) or name in ('.', '..'):
                raise ValueError('Nombre de archivo inválido')
        allowed[operation] = params
    elif operation == 'list_backups':
        module = 'Backup'
    elif operation == 'git_repositories':
        if params:
            raise ValueError('Parámetros inesperados')
        module = 'VersionControl'
        function = 'retrieve'
    elif params:
        raise ValueError('Parámetros inesperados')
    base = cfg['CPANEL_BASE_URL']
    url = urllib.parse.urlsplit(base)
    if (url.scheme != 'https' or not url.hostname or url.username
            or url.password or url.query or url.fragment or url.path not in ('', '/')):
        raise ValueError('URL base HTTPS inválida')
    endpoint = base.rstrip('/') + '/execute/' + module + '/' + function
    if allowed[operation]:
        endpoint += '?' + urllib.parse.urlencode(allowed[operation])
    request = urllib.request.Request(endpoint, headers={
        'Authorization': 'cpanel ' + cfg['CPANEL_USERNAME'] + ':' + cfg['CPANEL_API_TOKEN'],
        'Accept': 'application/json',
    })
    opener = urllib.request.build_opener(
        NoRedirect(), urllib.request.HTTPSHandler(context=ssl.create_default_context()))
    try:
        with opener.open(request, timeout=25) as response:
            body = response.read(2_000_001)
            if len(body) > 2_000_000:
                return {'ok': False, 'error': 'Respuesta demasiado grande'}
            payload = json.loads(body)
    except urllib.error.HTTPError as error:
        return {'ok': False, 'http': error.code}
    except (urllib.error.URLError, TimeoutError, OSError) as error:
        return {'ok': False, 'error': type(error).__name__}
    except (ValueError, UnicodeError):
        return {'ok': False, 'error': 'Respuesta no JSON'}
    if not isinstance(payload, dict):
        return {'ok': False, 'error': 'Estructura JSON inválida'}
    result = payload.get('result', payload)
    if not isinstance(result, dict):
        return {'ok': False, 'error': 'Estructura UAPI inválida'}
    if result.get('status') != 1 or result.get('errors'):
        return {'ok': False, 'error': 'Fallo funcional UAPI', 'status': result.get('status')}
    return {'ok': True, 'data': result.get('data')}


if __name__ == '__main__':
    # Mostrar únicamente el estado; los datos de la cuenta no se vuelcan a logs.
    result = query('list_domains')
    print(json.dumps({k: v for k, v in result.items() if k != 'data'}))
    raise SystemExit(0 if result['ok'] else 1)
