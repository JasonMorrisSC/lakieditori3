create table document_user_permission
(
    document_id uuid         NOT NULL,
    username    varchar(255) NOT NULL,
    permission  varchar(20)  NOT NULL,

    CONSTRAINT document_user_permission_pkey
        PRIMARY KEY (document_id, username, permission),
    CONSTRAINT document_user_permission_document_fkey
        FOREIGN KEY (document_id) REFERENCES document (id)
            ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT document_user_permission_user_fkey
        FOREIGN KEY (username) REFERENCES users (username)
            ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT document_user_permission_permission_check
        CHECK (permission IN ('READ', 'UPDATE', 'DELETE'))
);
