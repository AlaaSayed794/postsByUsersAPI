create table posts(
id serial primary key,
description varchar not null,
user_id integer references users(id) not null
);

