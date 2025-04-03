require('dotenv').config();
const express = require("express");
const cors = require("cors");
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const db = require('./connection');
const port = process.env.PORT;
const server = express();

const corsSettings = {
    origin: process.env.FRONTEND_URL
};

server.use(cors(corsSettings));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));


const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {

        const fileExtension = file.mimetype.split('/')[1];
        cb(null, `${Date.now()}.${fileExtension}`);
    }
});


const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      
        if (file.mimetype.startsWith('image/')) {
            cb(null, true); 
        } else {
            cb(new Error('Invalid file type, only images are allowed!'), false); 
        }
    }
});

server.use('/uploads', express.static('uploads'))


server.get("/api/read", (req, res) => {
   
    db.query('SELECT * FROM user where is_deleted=0', (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        console.log('Database results:', results);
        res.json(results); 
    });
});

server.get("/api/getUserById/:id", (req, res) => {
    console.log('ById----', req.params.id);

    db.query(`SELECT * FROM user where id=${req.params.id}`, (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

      
        const user = results[0];
        if (user.profile_photo) {
           
            user.profile_photo = `http://localhost:${port}/uploads/${user.profile_photo}`;
        }
        console.log('Database results:', results);
        return res.json(results); 
    });
});

server.get("/api/delete/:id", (req, res) => {
    console.log('ById----', req.params.id);

    db.query(`UPDATE user SET is_deleted = 1 where id=${req.params.id}`, (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        
        const user = results[0];
        if (user?.profile_photo) {
           
            user.profile_photo = `http://localhost:${port}/uploads/${user.profile_photo}`;
        }
        console.log('Database results:', results);
        return res.json(results); 
    });
});


server.post("/api/create", upload.single('profile_photo'), (req, res) => {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);
    db.query(`INSERT INTO user (first_name, last_name, email, password, phone_number, profile_photo)
VALUES ("${req.body.first_name}", "${req.body.last_name}", "${req.body.email}", "${req.body.password}", ${req.body.phone_number}, "${req.file.filename}")`, (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            if (!results) {
                return res.status(200).json({ message: 'Email already exists' });
            }
            else {
                return res.status(500).send('Internal Server Error');
            }

        }

        console.log('Database results:', results);
        // res.json(results); 
        return res.status(200).send('New user created successfully!');
    });

});

server.post("/api/update", upload.single('profile_photo'), (req, res) => {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);
    let updateQuery = `UPDATE user SET 
    first_name = "${req.body.first_name}", 
    last_name = "${req.body.last_name}", 
    password = "${req.body.password}", 
    phone_number = ${req.body.phone_number}`;

// Conditionally add profile_photo to the query if a new file was uploaded
if (req.file) {
    updateQuery += `, profile_photo = "${req.file.filename}"`;
}

// Complete the update query with the user ID
updateQuery += ` WHERE id = ${req.body.id}`;

// Execute the query
db.query(updateQuery, (err, results) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Database results:', results);

        return res.status(200).send('User updated successfully!');
    });

});

server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
