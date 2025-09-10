CREATE TABLE "professors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"institutional_email" varchar(255) NOT NULL,
	"institutional_password" varchar(255) NOT NULL,
	CONSTRAINT "professors_institutional_email_unique" UNIQUE("institutional_email")
);
