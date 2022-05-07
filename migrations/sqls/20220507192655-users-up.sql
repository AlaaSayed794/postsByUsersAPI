CREATE TYPE user_role AS ENUM('admin','user');

CREATE TABLE users (
id serial primary key,
name varchar not null unique,
password varchar not null,
role user_role
);