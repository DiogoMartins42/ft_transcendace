FROM owasp/modsecurity-crs:nginx

EXPOSE 80

RUN apt-get update && \
    apt-get install -y nginx libnginx-mod-security && \
    apt-get clean

RUN sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/' /etc/modsecurity/modsecurity.conf

COPY nginx.conf /etc/nginx/nginx.conf
COPY modsecurity.conf /etc/modsecurity/modsecurity.conf
COPY crs-setup.conf /etc/modsecurity/crs-setup.conf
COPY modsecurity_rules.conf /etc/modsecurity/modsecurity_rules.conf

CMD ["nginx", "-g", "daemon off;"]