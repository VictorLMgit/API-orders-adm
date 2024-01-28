const express = require('express');
const routes = require("./routes/index.js");
// import routes from "./routes/index.js";

const app = express();
routes(app)
module.exports = app;
// export default app;