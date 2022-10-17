CREATE DATABASE shortly;

CREATE TABLE "users" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL
);

CREATE TABLE "sessions" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "users"("id"),
    token TEXT NOT NULL,
    createdAt TIMESTAMP NOT NULL
);

CREATE TABLE "links" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "users"("id"),
    url TEXT NOT NULL, 
    "shortUrl" TEXT NOT NULL,
    "visitCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL
);