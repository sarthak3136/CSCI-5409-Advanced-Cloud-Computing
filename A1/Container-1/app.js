const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require("path");
const { default: axios } = require('axios');
const { error } = require('console');

app.use(express.json());
app.use(bodyParser.json());

app.post('/calculate', (req, res) => {
    const file = req.body.file;
    const product = req.body.product;

    if(file === null || !file){
        return res.status(400).json({file: null, error: 'Invalid JSON input'});
    }

    //const filePath = path.join(__dirname, "..", file);
    const filePath = `/apps/file/${file}`

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if(err){
            return res.status(400).json({file: filePath, error: "File not found."})
        }
        else{
            axios.post("http://container2:3000/container2", req.body)
            .then(({ data }) => {
                return res.json(data);
            })
            .catch((error) => {
                return res.status(400).json(error);
            })
        }
    })
});

app.listen(6000, ()=> {
    console.log('Server is listening on port 6000');
})