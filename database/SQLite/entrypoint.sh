#!/bin/sh

# Create database schema
sqlite3 /data/database.db < /SQLite/init.sql

# Insert user from env
if [ -n "$DB_USER" ] && [ -n "$DB_PASSWORD" ]; then
    echo "INSERT INTO users (username, password) VALUES ('$DB_USER', '$DB_PASSWORD');" | sqlite3 /data/database.db
    echo "✅ User inserted: $DB_USER"
else
    echo "⚠️ No user inserted: USERNAME or PASSWORD missing"
fi

# Just wait so you can see logs
sleep 2