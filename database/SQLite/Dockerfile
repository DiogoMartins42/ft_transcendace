FROM alpine:3.21.4

RUN apk update && apk add --no-cache sqlite

WORKDIR /data

COPY init.sql /SQLite/init.sql

COPY entrypoint.sh /SQLite/entrypoint.sh

ENTRYPOINT [ "/SQLite/entrypoint.sh" ]

CMD ["sh", "-c", "sqlite3 /data/database.db < /SQLite/init.sql && echo '✅ Database created.' && sleep 1"]
