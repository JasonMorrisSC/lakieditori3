CREATE TABLE users
(
    id         uuid PRIMARY KEY,

    username   varchar(255) NOT NULL UNIQUE,
    password   varchar(255) NOT NULL,

    first_name varchar(255),
    last_name  varchar(255),

    superuser  boolean      NOT NULL,
    enabled    boolean      NOT NULL
);

CREATE INDEX users_username_idx ON users (username);

CREATE TABLE document
(
    id                 uuid PRIMARY KEY,

    created_by         varchar(255) NOT NULL REFERENCES users (username) ON UPDATE CASCADE,
    created_date       timestamp    NOT NULL,
    last_modified_by   varchar(255) NOT NULL REFERENCES users (username) ON UPDATE CASCADE,
    last_modified_date timestamp    NOT NULL,

    document           text         NOT NULL
);
