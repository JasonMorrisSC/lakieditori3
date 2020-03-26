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


-- sequence for revisions to ensure temporal ordering and unique key
CREATE SEQUENCE document_revision_seq;

CREATE TABLE document_version
(
    id                 uuid,
    revision           bigint DEFAULT nextval('document_revision_seq'),

    created_by         varchar(255) NOT NULL,
    created_date       timestamp    NOT NULL,
    last_modified_by   varchar(255) NOT NULL,
    last_modified_date timestamp    NOT NULL,

    document           text,

    CONSTRAINT document_version_pkey
        PRIMARY KEY (id, revision)
);

CREATE INDEX document_version_id_idx ON document_version (id);


CREATE TABLE document_user_permission
(
    document_id uuid,
    username    varchar(255),
    permission  varchar(20),

    CONSTRAINT document_user_permission_pkey
        PRIMARY KEY (document_id, username, permission),
    CONSTRAINT document_user_permission_document_fkey
        FOREIGN KEY (document_id) REFERENCES document (id) ON DELETE CASCADE,
    CONSTRAINT document_user_permission_users_fkey
        FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT document_user_permission_permission_check
        CHECK (permission IN ('READ', 'UPDATE', 'DELETE'))
);

CREATE INDEX document_user_permission_document_id_idx
    ON document_user_permission (document_id);
