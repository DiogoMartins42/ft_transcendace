FROM alpine:3.21.4

RUN apk update && apk add --no-cache sqlite

WORKDIR /data

COPY init.sql /init/init.sql

COPY entrypoint.sh /init/entrypoint.sh

ENTRYPOINT [ "/init/entrypoint.sh" ]

CMD ["sh", "-c", "sqlite3 /data/database.db < /init/init.sql && echo '✅ Database created.' && sleep 1"]
