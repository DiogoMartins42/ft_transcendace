#!/bin/sh

#Verifica se o diretório de dados está vazio
if [ -z "$(ls -A /var/lib/mysql/mysql)" ]; then

#echo "Empty directory. Executing mariadb-install-db."

mariadb-install-db --user=mysql --datadir=/var/lib/mysql
# Inicia o servidor MariaDB diretamente
mysqld_safe --user=mysql &

# Aguarda o MariaDB iniciar completamente
until mysqladmin ping --silent; do
    echo "Aguardando o MariaDB..."
    sleep 1
done

mariadb -v -u root << EOF
CREATE DATABASE IF NOT EXISTS ${MYSQL_DB};
CREATE USER IF NOT EXISTS '${MYSQL_USER}'@'%' IDENTIFIED BY '${MYSQL_PASSWORD}';
CREATE USER IF NOT EXISTS '${MYSQL_ADMIN}'@'%' IDENTIFIED BY '${MYSQL_ADMIN_PASSWORD}';
GRANT ALL PRIVILEGES ON ${MYSQL_DB}.* TO '${MYSQL_ADMIN}'@'%';
GRANT SELECT, INSERT, UPDATE ON ${MYSQL_DB}.* TO '${MYSQL_USER}'@'%';
ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
DELETE FROM mysql.user WHERE User = '';
DELETE FROM mysql.user WHERE User = 'PUBLIC';
FLUSH PRIVILEGES;
EOF

# Para o servidor MariaDB (opcional, se necessário)
mysqladmin -u root -p$MYSQL_ROOT_PASSWORD shutdown

#Executa o comando principal do contêiner (por exemplo, `mysqld_safe`)
else
    echo "O diretório de dados não está vazio. Pulando mariadb-install-db."
	chmod -R 755 /var/lib/mysql
	chown -R mysql:mysql /var/lib/mysql
fi

exec "$@"