const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require("path");
const csvParser = require('csv-parser');

app.use(express.json());
app.use(bodyParser.json());

app.post("/container2", (req, res) => {
    const file = req.body.file;
    const product = req.body.product;

    //const filePath = path.join(__dirname, "..", file);
    const filePath = `/apps/file/${file}`
    const products = {};

    // Read the file
    fs.createReadStream(filePath).pipe(csvParser()).on('data', (row) => {
        const productName = row.product;
        const amount = row.amount;
        
        if(productName in products){
            products[productName] = parseInt(products[productName]) +  parseInt(amount);
        }
        else{
            products[productName] = parseInt(amount);
        }
        console.log(row);
    })
    .on('end', ()=> {
        if(isCSV(filePath)){
            console.log("Products object is: ");
            console.log(products);
            res.json({file: file, sum: products[product]});
        }
        else{
            res.json({file: filePath, error: 'Input file not in CSV format.'})
        }
    })
});

function isCSV(filePath) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    const lines = fileData.trim().split('\n');

    for(const line of lines) {
        const values = line.trim().split(',');
        if(values.length < 2){
            return false;
        }
    }
    return true;
}

app.listen(3000, ()=> {
    console.log('Server is listening on port 3000');
})
