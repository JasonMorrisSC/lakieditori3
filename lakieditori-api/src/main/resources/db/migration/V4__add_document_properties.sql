CREATE TABLE document_properties
(
    document_id uuid,
    key         varchar(255),
    value       text NOT NULL,

    CONSTRAINT document_properties_pkey
        PRIMARY KEY (document_id, key),
    CONSTRAINT document_properties_document_fkey
        FOREIGN KEY (document_id) REFERENCES document (id) ON DELETE CASCADE
);

CREATE INDEX document_properties_document_id_idx ON document_properties (document_id);
