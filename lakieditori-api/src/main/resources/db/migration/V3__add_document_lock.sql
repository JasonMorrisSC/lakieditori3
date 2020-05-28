CREATE TABLE document_lock
(
    document_id uuid,
    username    varchar(255) NOT NULL,
    date        timestamp    NOT NULL,

    CONSTRAINT document_lock_pkey
        PRIMARY KEY (document_id),
    CONSTRAINT document_lock_document_fkey
        FOREIGN KEY (document_id) REFERENCES document (id) ON DELETE CASCADE,
    CONSTRAINT document_lock_user_fkey
        FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE ON UPDATE CASCADE
);
