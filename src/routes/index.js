const express = require('express');
const bodyParser = require('body-parser');
const routesUsers = require("./usersRoutes.js");
const { checkAuthorization }= require("../middleware.js");
const routes = (app) => {

    app.use((req, res, next) => {
        console.log(req.method + " " + req.path + " - " + req.ip);
        next();
    })
   
    app.use(bodyParser.json());
    app.use('/users', checkAuthorization , routesUsers );

}

module.exports = routes;