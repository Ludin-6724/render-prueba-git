# Fuentes y procedencia

Consultadas al preparar el paquete el 8 de septiembre de 2026. Las funciones disponibles deben confirmarse contra el servidor real y su versión. Estos documentos no acreditan que una conexión haya sido realizada.

1. **OpenAI — instrucciones de proyecto con AGENTS.md.** Ubicación y lectura de instrucciones en el proyecto: [Documentación oficial](https://learn.chatgpt.com/docs/agent-configuration/agents-md)
   **Aplicación y elección de proyecto/carpeta:** [Documentación oficial](https://learn.chatgpt.com/docs/app)
2. **cPanel — Manage API Tokens.** Creación, expiración y revocación: [Documentación oficial](https://docs.cpanel.net/cpanel/security/manage-api-tokens-in-cpanel/)
3. **cPanel — How to Use cPanel API Tokens.** Autenticación y llamadas UAPI sobre HTTPS: [Documentación oficial](https://docs.cpanel.net/knowledge-base/security/how-to-use-cpanel-api-tokens/)
4. **cPanel — Backup Wizard.** Copias de archivos/bases de datos y limitaciones de restauración completa: [Documentación oficial](https://docs.cpanel.net/cpanel/files/backup-wizard/)
5. **cPanel UAPI — DomainInfo/list_domains.** Consulta de dominios de la cuenta: [Documentación oficial](https://api.docs.cpanel.net/specifications/cpanel.openapi/domain-information/domaininfo-list_domains)
6. **cPanel — Developer Portal y operaciones Fileman.** Verificar el esquema de cada función antes de usarla: [Documentación oficial](https://api.docs.cpanel.net/) y [Documentación oficial](https://api.docs.cpanel.net/specifications/cpanel.openapi/manage-files/fileman-upload_files)
7. **Elegant Themes — The Divi Library.** Diseños reutilizables del constructor: [Documentación oficial](https://www.elegantthemes.com/documentation/divi/divi-library/)
8. **WordPress — wp_enqueue_script.** Incorporación de JavaScript al sitio: [Documentación oficial](https://developer.wordpress.org/reference/functions/wp_enqueue_script/)
   **Temas hijos:** [Documentación oficial](https://developer.wordpress.org/themes/advanced-topics/child-themes/)
9. **GSAP — ScrollTrigger:** [Documentación oficial](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
   **Three.js — Fundamentals:** [Documentación oficial](https://threejs.org/manual/en/fundamentals.html)
10. **cPanel — Application Manager.** Aplicaciones Passenger y requisitos del proveedor: [Documentación oficial](https://docs.cpanel.net/cpanel/software/application-manager/)
11. **cPanel — despliegue con Git:** [Documentación oficial](https://docs.cpanel.net/knowledge-base/web-services/guide-to-git-set-up-deployment/)

## Evidencia específica del cliente

- Entrevista y aclaraciones compartidas por Ludin Guerra en esta conversación.
- Capturas de cPanel compartidas por Ludin: dominio principal, SSL, caché, archivos, bases de datos, Git, tokens API, Node.js y Python.
- Export local `rendermultimedia.WordPress.2026-09-05.xml`, cuyo análisis se verificó al preparar este paquete: 104 registros, 7 páginas publicadas y 39 referencias de adjuntos, con marcadores de Divi. No se incluye en el ZIP y no debe interpretarse como respaldo integral.
- La contratación del proveedor y los accesos declarados proceden de los mensajes del usuario. Las capacidades de API, permisos efectivos, rendimiento y versiones instaladas quedan pendientes de comprobación.
