CREATE TABLE users
(
    id         uuid PRIMARY KEY,

    username   varchar(255) NOT NULL UNIQUE,
    password   varchar(255) NOT NULL,

    first_name varchar(255),
    last_name  varchar(255),

    superuser  boolean      NOT NULL,
    enabled    boolean      NOT NULL,

    CONSTRAINT users_username_check CHECK (username ~ '^[A-Za-z0-9\\-]+$')
);

CREATE INDEX users_username_idx ON users (username);


CREATE TABLE user_properties
(
    user_id uuid,
    key     varchar(255),
    value   text NOT NULL,

    CONSTRAINT user_properties_pkey
        PRIMARY KEY (user_id, key),
    CONSTRAINT user_properties_user_fkey
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT user_properties_key_check CHECK (key ~ '^[A-Za-z0-9\\-]+$')
);

CREATE INDEX user_properties_user_id_idx ON user_properties (user_id);


CREATE TABLE schema
(
    name varchar(255) PRIMARY KEY,
    CONSTRAINT schema_name_check CHECK (name ~ '^[A-Za-z0-9\\-]+$')
);


CREATE TABLE schema_definition
(
    schema_name varchar(255),
    index       integer,
    name        varchar(255) NOT NULL,
    definition  text         NOT NULL,
    CONSTRAINT schema_definition_pkey
        PRIMARY KEY (schema_name, index),
    CONSTRAINT schema_definition_schema_fkey
        FOREIGN KEY (schema_name) REFERENCES schema (name) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT schema_definition_name_unique UNIQUE (schema_name, name),
    CONSTRAINT schema_definition_name_check CHECK (name ~ '^[A-Za-z0-9\\-\\.\\_]+$')
);

CREATE INDEX schema_definition_schema_name_idx ON schema_definition (schema_name);


CREATE TABLE document
(
    schema_name        varchar(255),
    id                 uuid,

    created_by         varchar(255) NOT NULL REFERENCES users (username) ON UPDATE CASCADE,
    created_date       timestamp    NOT NULL,
    last_modified_by   varchar(255) NOT NULL REFERENCES users (username) ON UPDATE CASCADE,
    last_modified_date timestamp    NOT NULL,

    document           text         NOT NULL,

    CONSTRAINT document_pkey
        PRIMARY KEY (schema_name, id),
    CONSTRAINT document_schema_fkey
        FOREIGN KEY (schema_name) REFERENCES schema (name) ON UPDATE CASCADE
);

CREATE INDEX document_schema_name_idx ON document (schema_name);


-- metadata about document, settings etc.
CREATE TABLE document_properties
(
    document_schema_name varchar(255),
    document_id          uuid,
    key                  varchar(255),
    value                text NOT NULL,

    CONSTRAINT document_properties_pkey
        PRIMARY KEY (document_schema_name, document_id, key),
    CONSTRAINT document_properties_document_fkey
        FOREIGN KEY (document_schema_name, document_id)
            REFERENCES document (schema_name, id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT document_properties_key_check CHECK (key ~ '^[A-Za-z0-9\\-]+$')
);

CREATE INDEX document_properties_document_id_idx ON document_properties (document_id);


CREATE TABLE document_lock
(
    document_schema_name varchar(255),
    document_id          uuid,
    username             varchar(255) NOT NULL,
    date                 timestamp    NOT NULL,

    CONSTRAINT document_lock_pkey
        PRIMARY KEY (document_schema_name, document_id),
    CONSTRAINT document_lock_document_fkey
        FOREIGN KEY (document_schema_name, document_id)
            REFERENCES document (schema_name, id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT document_lock_user_fkey
        FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX document_lock_document_id_idx ON document_lock (document_id);


CREATE TABLE document_user_permission
(
    document_schema_name varchar(255),
    document_id          uuid,
    username             varchar(255),
    permission           varchar(20),

    CONSTRAINT document_user_permission_pkey
        PRIMARY KEY (document_schema_name, document_id, username, permission),
    CONSTRAINT document_user_permission_document_fkey
        FOREIGN KEY (document_schema_name, document_id)
            REFERENCES document (schema_name, id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT document_user_permission_users_fkey
        FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT document_user_permission_permission_check
        CHECK (permission IN ('READ', 'UPDATE', 'DELETE'))
);

CREATE INDEX document_user_permission_document_id_idx
    ON document_user_permission (document_schema_name, document_id);


-- sequence for revisions to ensure temporal ordering and unique key
CREATE SEQUENCE document_revision_seq;

CREATE TABLE document_version
(
    schema_name        varchar(255),
    id                 uuid,
    revision           bigint DEFAULT nextval('document_revision_seq'),

    created_by         varchar(255) NOT NULL,
    created_date       timestamp    NOT NULL,
    last_modified_by   varchar(255) NOT NULL,
    last_modified_date timestamp    NOT NULL,

    document           text,

    CONSTRAINT document_version_pkey
        PRIMARY KEY (schema_name, id, revision)
);

CREATE INDEX document_version_id_idx ON document_version (schema_name, id);
