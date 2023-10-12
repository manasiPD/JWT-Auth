const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const secretKey = "secretkey";

app.get('/', (req, res) => {
    res.json({
        message: "a sample api"
    })
});

app.post('/login', (req, res) => {
    const user = {
        id: 1,
        username: "Mansi",
        email: "abc@gmail.com"
    }
    // jwt.sign is a function in which there are 2-3 parameters
    // 1st parameter contains the details which help in generating token
    // we can store password in the 2nd secretkey parameter
    // 3rd parameter is the expire time, which means inn how much time the session is gonna expire
    // then there is a callback function with 2 parameters
    jwt.sign({ user }, secretKey, { expiresIn: '300s' }, (err, token) => {
        // here we send token a response
        res.json({
            token
        })
    })
})

app.post('/profile', verifyToken, (req, res) => {
    jwt.verify(req.token, secretKey, (err, authData) => {
        if(err){
            res.send({result: 'Invalid token'})
        }else{
            res.json({
                message: 'profile accessed',
                authData
            })
        }
    })
})

function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization']; 
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const token = bearer[1];
        req.token = token;
        next();
    }else{
        res.send({
            result: 'Invalid token'
        })
    }
}

app.listen(3000, () => {
    console.log("Listening on port 3000");
})