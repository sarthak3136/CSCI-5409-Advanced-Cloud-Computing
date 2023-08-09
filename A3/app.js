const express = require("express");
const app = express();

app.use(express.json());

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: "csci5409-a4-instance-1.ctgp35vsph5m.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "sarthak3136",
  port: "3306",
  database: "a4"
});

connection.connect((err)=>{
    if(err){
        console.log("Error connecting to database.")
    }
    else{
        console.log("Database connection successful.")
    }
});

app.post("/store-products", (req, res)=> {
        var name = req.body.products[0].name;
        var price = req.body.products[0].price;
        var availability = req.body.products[0].availability;

        const query = 'INSERT INTO products (name, price, availability) VALUES (?, ?, ?)';
        const values = [name, price, availability];
        console.log(values);
        connection.query(query, values, (error, results) => {
            if (error) {
              console.error('Error inserting data:', error);
              res.status(500).send('Error inserting data');
            } else {
              console.log('Data inserted successfully');
              res.status(200).send({message: 'Success.'});
            }
          });
    }
)

app.get("/list-products", (req, res) => {
    const query = 'SELECT * FROM products';
  
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
      } else {
        console.log('Data retrieved successfully');
        res.status(200).json({products:results});
      }
    });
});

  
app.listen(80, () => {
    console.log('Server is running on port 3001');
  });