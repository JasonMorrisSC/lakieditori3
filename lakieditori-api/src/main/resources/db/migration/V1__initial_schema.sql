CREATE TABLE users
(
    id        uuid PRIMARY KEY,
    username  varchar(255) NOT NULL UNIQUE,
    password  varchar(255) NOT NULL,
    superuser boolean      NOT NULL,
    enabled   boolean      NOT NULL
);

CREATE INDEX users_username_idx ON users (username);

CREATE TABLE document
(
    id                 uuid PRIMARY KEY,

    created_by         varchar(255) NOT NULL REFERENCES users (username),
    created_date       timestamp    NOT NULL,
    last_modified_by   varchar(255) NOT NULL REFERENCES users (username),
    last_modified_date timestamp    NOT NULL,

    document           text         NOT NULL
);
