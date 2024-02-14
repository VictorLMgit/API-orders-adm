const express = require('express');
const bodyParser = require('body-parser');
const routesUsers = require("./usersRoutes.js");
const routesAuth = require("./authRoutes.js");
const routesProducts = require("./productRoutes.js");
const routesOrders = require("./orderRoutes.js");
const routesReports = require("./reportRoutes.js");
const Middlewares = require("../middleware.js");
const routes = (app) => {

    app.use((req, res, next) => {
        console.log(req.method + " " + req.path + " - " + req.ip);
        next();
    })
   
    app.use(bodyParser.json());
    app.use('/users', Middlewares.checkAuthorization , routesUsers );
    app.use('/products', Middlewares.checkAuthorization, routesProducts );
    app.use('/orders', Middlewares.checkAuthorization, routesOrders );
    app.use('/reports', Middlewares.checkAuthorization, routesReports );
    app.use('/credentials', routesAuth );

}

module.exports = routes;