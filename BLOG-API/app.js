const express = require("express");
const bodyParser = require("body-parser");
const connectMongoDb = require("./init/mongodb");
const {authRoute,categoryRoute, fileRoute, postRoute} = require("./routes")
const {errorHandler} = require("./middlewares");
const {notFound} = require("./controller");
const cors = require('cors');

const app = express();

connectMongoDb();

app.use(cors({origin: ["http://localhost:5173"]}))

app.use(bodyParser.urlencoded({limit:"500mb",extended:true}));

app.use(express.json({limit:"500mb"}))

app.use("/api/v1/auth",authRoute);
app.use("/api/v1/category",categoryRoute);
app.use("/api/v1/file",fileRoute);
app.use("/api/v1/post",postRoute);

app.use(errorHandler);

app.use("*",notFound)


module.exports = app;