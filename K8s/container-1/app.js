const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs');
const path = require("path");
const { default: axios } = require('axios');
const { error } = require('console');

app.use(express.json());
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.send("hello world!!!!!!!!!!!!!!!!!! from the shell and Terraform, this was from video conatiner1");
})

// Post API to store file
app.post('/store-file', (req, res)=> {
    const file = req.body.file;
    var data = req.body.data;

    // 1) Invalid JSON Input
    if(file == null || !file){
        return res.status(400).json({   file: null, error: 'Invalid JSON input.' });
    }

    // 2) Storing the Data in File
    const filePath = `/sarthak_PV_dir/${file}`
    console.log(filePath)

    fs.writeFile(filePath, data, (err) => {
        if(err){
            console.log(err);
            res.status(500).json({  file, error: 'Error while storing file to the storage.' });
        }else{
            res.json({  file: file, message: 'Success.'   })
        }
    })

})
app.post('/calculate', (req, res) => {
    const file = req.body.file;
    const product = req.body.product;

    if(file === null || !file){
        return res.status(400).json({file: null, error: 'Invalid JSON input.'});
    }

    //const filePath = path.join(__dirname, file);
    const filePath = `/sarthak_PV_dir/${file}`

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if(err){
            return res.status(400).json({file: file, error: "File not found."})
        }
        else{
            axios.post("http://container2-service/container2", req.body)
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