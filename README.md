# COMP3335Project

Group 18 COMP3335 Project.

Built with `Node.js`.

Web Server: `express.js`

Render Engine: `pug / jade`

Database: `mysql`

## Requirement

1. Nodejs

2. npm

3. MySQL

4. SendGrid API Key

5. Linux Environment Recommended.

## Setup

### Database Tables

Database and Tables 's SQL already in `database.sql` file.
Just Copy and Paste those commands to the SQL Server.

### Config

1. Create a `.env` file in this directory.

2. Then Follow This format:

```
sendgrid_api=YOUR SENDGRID API KEY
PORT=8080
MYSQLUSER=MYSQLSERVER USER
MYSQLHOST=MYSQLSERVER IP ADDRESS
MYSQLDB=COMP3335
MYSQLPASS=MYSQLSERVER PASSWORD
```

You can change the PORT 8080 to any other port you like.

3. Put your self-signed / ca signed certificates in side `src/Server/certs` and name it `server.cert` and `server.key`

### Libraries

Make sure you have `build-essential` installed in your OS.

## Build and Run

First Run: `npm install`

Then: `npm run build`

Then: `npm start` to Start Server.

Open Browser and go to `https://localhost:PORT` (if you have certificates) 

or `http://localhost:PORT` (if you have *NO* certificates)