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
