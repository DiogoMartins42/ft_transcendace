FROM alpine:3.21.4

EXPOSE 3306

#RUN apk update && apk add --no-cache mariadb=10.11.10-r0 mariadb-client=10.11.10-r0
RUN apk update && apk add --no-cache mariadb mariadb-client

RUN mkdir -p /run/mysqld && chown -R mysql:mysql /run/mysqld && \
	mkdir -p /var/lib/mysql && chown -R mysql:mysql /var/lib/mysql

COPY ./conf/mariadb-server.cnf /etc/my.cnf.d/mariadb-server.cnf

COPY ./conf/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]

CMD ["mysqld_safe"]

