const express = require('express');
const mysql = require('mysql');
const bodyparser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 9393;

const app = express();

app.disable('x-powered-by');    //to hide that our app is created in node
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false}));
app.use(cors());

//ROUTES
app.get('/', (req,res) => {
    res.send('Welcome to API users')
})

//register new user
app.post('/api/register', (req,res) => {
    const {email, password} = req.body;     //req.body = is what we get in JSON format on the frontend
    
    //Chck if the mail already exists
    const sql_check_email = `SELECT * FROM users WHERE email = "${email}"`;
    connection.query(sql_check_email, (err, results) => {
        if(err) throw err;
        if(results.length > 0){
            //already exists
            res
                .status(303)    
                .json({message: 'Cannot create, User already exists'});
        }else{
            //not exist, can register
            //Encrypt password
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            const sql = 'INSERT INTO users SET ?';

            const userObj = {
                email: email,
                hash: hash
            }

            connection.query(sql, userObj, err => {
                if(err) throw err;
                res
                    .status(201)    //status created
                    .json({message: 'User created'});
            });
        }
    })   

})

//Check if the login is succesful
app.get('/api/login', (req, res) => {
    const {email, password} = req.body;

    const sql = `SELECT hash FROM users WHERE email = "${email}"`;

    connection.query(sql, (err, results) => {
        if(err) throw err;
        if(results.length > 0){
            //let hash_db = results['hash'];
            let hash_db = results[0]['hash'];
            if(bcrypt.compareSync(password, hash_db)){
                //equals
                res
                .status(200)    //status ok
                .json({login: true});
            }else{
                //not equals
                res
                .status(403)    //status forbidden
                .json({login: false});
            }            
        }else{
            res
                .status(404)    //status not found
                .json({message: 'No results'});
        }
    })
});

//DATABASE
//CREATE TABLE users ( email VARCHAR(100) PRIMARY KEY, hash TEXT NOT NULL )ENGINE=INNODB
//MySQL DB CONFIG
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'prueba_users'
});

// Check connection
connection.connect(error => {
    if(error) throw error;
    console.log('Database connection succesfull');
})

//APP LISTEN
app.listen(PORT, () => console.log(`API users running in port ${PORT}`));