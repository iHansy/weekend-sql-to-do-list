CREATE TABLE "test" (
"id" SERIAL PRIMARY KEY,
"task" VARCHAR(50) NOT NULL,
"description" VARCHAR(255) DEFAULT 'no description',
"due_date" DATE,
"status" BOOLEAN DEFAULT false
);

INSERT INTO "tasks" ("task", "description", "due_date", "status")
VALUES('Clean room', 'Vacuum, sort clothes, and organize.', '8-10-2020', 'false');

INSERT INTO "tasks" ("task", "description", "due_date")
VALUES('Sell headphones', 'Sanitize, charge, then post on FB marketplace.', '8-13-2020');