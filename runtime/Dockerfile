FROM wordpress:cli-php8.2 AS cli
FROM wordpress:php8.2-apache
COPY --from=cli /usr/local/bin/wp /usr/local/bin/wp
RUN a2enmod headers rewrite proxy proxy_http && mkdir -p /var/local-evidence
COPY apache-local.conf /etc/apache2/conf-enabled/render-local.conf
COPY php-local.ini /usr/local/etc/php/conf.d/render-local.ini
ENTRYPOINT ["apache2-foreground"]
