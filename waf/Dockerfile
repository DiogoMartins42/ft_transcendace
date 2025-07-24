FROM owasp/modsecurity-crs:nginx

EXPOSE 80

COPY nginx.conf /etc/nginx/nginx.conf
COPY modsecurity.conf /etc/modsecurity/modsecurity.conf
COPY crs-setup.conf /etc/modsecurity/crs-setup.conf

CMD ["nginx", "-g", "daemon off;"]