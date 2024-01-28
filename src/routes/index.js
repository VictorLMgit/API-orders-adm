const express = require('express');
const bodyParser = require('body-parser');
const routesUsers = require("./usersRoutes.js");
const routes = (app) => {

    app.use((req, res, next) => {
        console.log(req.method + " " + req.path + " - " + req.ip);
        next();
    })
   
    
    // app.get("/users", (req, res)=>{
    //     res.send("Tudo certo");
    // });
    app.use(bodyParser.json());
    // app.use(express.json);
    app.use('/users', routesUsers);

}

module.exports = routes;