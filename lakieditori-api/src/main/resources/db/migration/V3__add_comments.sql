CREATE TABLE document_comments
(
    document_schema_name varchar(255),
    document_id          uuid,
    id                   uuid,

    created_by           varchar(255) NOT NULL,
    created_date         timestamp    NOT NULL,
    last_modified_by     varchar(255) NOT NULL,
    last_modified_date   timestamp    NOT NULL,

    path                 text         NOT NULL,
    comment              text         NOT NULL,

    CONSTRAINT document_comments_pkey
        PRIMARY KEY (document_schema_name, document_id, id),
    CONSTRAINT document_comments_document_fkey
        FOREIGN KEY (document_schema_name, document_id)
            REFERENCES document (schema_name, id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT document_comments_created_by_user_fkey
        FOREIGN KEY (created_by) REFERENCES users (username) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT document_comments_last_modified_by_user_fkey
        FOREIGN KEY (last_modified_by) REFERENCES users (username) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX document_comments_document_idx ON document_comments (document_schema_name, document_id);
