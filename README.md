# Database Setup
sudo -u postgres psql

create user admin with password 'siriusB' valid until 'infinity';

create database krasnovidovo owner admin encoding 'UTF8';


# REDIS
redis-server - запуск сервера
