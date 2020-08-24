CREATE TABLE transformation
(
    name       varchar(255) PRIMARY KEY,
    definition text NOT NULL,
    CONSTRAINT transformation_name_check CHECK (name ~ '^[A-Za-z0-9\-\.\_]+$')
);
