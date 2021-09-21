# basic-api-login
Basic REST API with register and login (password encrypted) created in Node.js and Express + MySQL

Copy file into a folder, and run:
```
npm init -y

npm i express mysql body-parser cors nodemon bcryptjs
```

Create mysql database and change connection data in file:
```javascript
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_name'
});
```

Create table users in the new database:
```mysql
CREATE TABLE users ( email VARCHAR(100) PRIMARY KEY, hash TEXT NOT NULL )ENGINE=INNODB
```
To start the node application, run: 
```
nodemon .
```

Make tests with Postman.
```
POST: http://localhost:9393/api/register
GET: http://localhost:9393/api/login
```
With JSON body:
```
{
    "email": "pepe@gmail.com",
    "password": "manolo69"
}
```
