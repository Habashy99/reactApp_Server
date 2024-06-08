const dotenv = require('dotenv')
dotenv.config();
const express = require("express");
import debug from "debug";
const debugServer = debug('task:server');
import tasksRoutes from "./routes/tasksRouter";
import usersRoutes from "./routes/usersRouter";
import { AppDataSource } from "./database/main";
const jwt = require('jsonwebtoken');


const app = express();

debugServer('booting %o', 'My App');
app.use(express.json());

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Pass to next layer of middleware
    if (req.method === "OPTIONS") {
        res.status(200).end();
    } else {
        next();
    }
});
app.use((req, res, next) => {
    const whiteListed = ['/users/login', '/users/signUp']
    try {
        if (!whiteListed.includes(req.url)) {
            const token: string = req.get("Authorization")!;
            if (!token) {
                return res.status(403).send({ message: "missing token login again" });
            }
            const data = jwt.verify(token, process.env.TOKEN_SECRET)
            req.body.userId = data.userId;
            return next();
        } else {
            return next();
        }
    } catch (_error) {
        return res.status(403).send({ message: "invalid token login again" });
    }
})

app.use("/", (req, _res, next) => {
    debugServer(req.method + ' ' + req.url);
    next();
});

app.use("/tasks", tasksRoutes);

app.use("/users", usersRoutes);

AppDataSource.initialize()
    .then(() => {
        app.listen(8050, () => {
            debugServer('listening');
        });
    })
    .catch((error) => console.log(error))
