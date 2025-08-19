FROM owasp/modsecurity-crs:nginx

USER root

COPY nginx.conf /etc/nginx/templates/nginx.conf.template
COPY modsecurity.conf /etc/nginx/templates/modsecurity.d/modsecurity.conf.template
COPY crs-setup.conf /etc/nginx/templates/modsecurity.d/crs-setup.conf.template

RUN mkdir -p /var/log/nginx && chown -R nginx:nginx /var/log/nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
