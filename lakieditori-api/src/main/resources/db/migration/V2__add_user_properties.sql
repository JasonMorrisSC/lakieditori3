CREATE TABLE user_properties
(
    user_id uuid,
    key     varchar(255),
    value   text NOT NULL,

    CONSTRAINT user_properties_pkey
        PRIMARY KEY (user_id, key),
    CONSTRAINT user_properties_user_fkey
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX user_properties_user_id_idx ON user_properties (user_id);
