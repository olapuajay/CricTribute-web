var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/mydb');


var db = mongoose.connection;


db.on('error', () => {
    console.log('Error in connecting to database');
})
db.once('open', () => {
    console.log('Connected to database');
})

// Signup 

app.post('/signUp', (req, res) => {
    var name = req.body.username;
    var password = req.body.password;
  
    // Check if user already exists before insertion
    db.collection('form').findOne({ 'name': name }, (err, user) => {
      if (err) {
        throw err;
      }
  
      if (user) {
        // User already exists, handle the error
        console.log('User already exists!');
        return res.send("Error: Username already taken!"); // Send appropriate error message
      } else {
        // User doesn't exist, proceed with insertion
        var data = {
          'name': name,
          'password': password
        };
  
        db.collection('form').insertOne(data, (err, collection) => {
          if (err) {
            throw err;
          }
          console.log('Record Inserted Successfully');
        });
  
        return res.redirect('home.html');
      }
    });
});

// Login route
app.post('/signIn', (req, res) => {
    var name = req.body.username;
    var password = req.body.password;
  
    db.collection('form').findOne({ 'name': name }, (err, user) => {
      if (err) {
        throw err;
      }
  
      if (!user) {
        // User not found, handle error
        console.log('User not found!');
        return res.send("Error: Invalid username or password!");
      } else {
        // User found, check password (assuming password is plain text for now)
        if (user.password === password) {
          console.log('Login successful!');
          // Successful login logic (e.g., redirect to protected page, set session variable)
          return res.redirect("home.html"); // Modify this response for your application
        } else {
          // Password mismatch, handle error
          console.log('Invalid password!');
          return res.send("Error: Invalid username or password!");
        }
      }
    });
});



app.get('/', (req, res) => {
    res.set({
        "Allow-access-Allow-Origin": '*'
    });
    return res.redirect('signUp.html');
});

const port = 1000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});