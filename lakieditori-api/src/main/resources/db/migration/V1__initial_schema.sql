create table users
(
    username varchar(255) PRIMARY KEY,
    password varchar(255) NOT NULL,
    enabled  boolean      NOT NULL
);

create table document
(
    id                 varchar(255) PRIMARY KEY CHECK (id ~ '^[A-Za-z0-9_\\-]+$'),

    created_by         varchar(255) NOT NULL REFERENCES users (username),
    created_date       timestamp    NOT NULL,
    last_modified_by   varchar(255) NOT NULL REFERENCES users (username),
    last_modified_date timestamp    NOT NULL,

    document           text         NOT NULL
);
