CREATE TABLE document_lock
(
    document_id uuid,

    CONSTRAINT document_lock_pkey
        PRIMARY KEY (document_id),
    CONSTRAINT document_lock_document_fkey
        FOREIGN KEY (document_id) REFERENCES document (id) ON DELETE CASCADE
);
