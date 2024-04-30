import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import debug from "debug";
const debugServer = debug('task:server');
import tasksRoutes from "./routes/tasksRouter";
import usersRoutes from "./routes/usersRouter";


const app = express();

debugServer('booting %o', 'My App');
app.use(express.json());

// Add headers before the routes are defined
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

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
    const whiteListed = ['/users/login']
    if (!whiteListed.includes(req.url)) {
        const token: string = req.get("Authorization");
        if (!token) {
            return res.status(400).send({ message: "missing token login again" });
        }
        if (token === "123456") {
            return next();
        } else {
            return res.status(401).send({ message: "invalid token login again" });
        }
    } else {
        return next();
    }
})

app.use("/", (req, _res, next) => {
    debugServer(req.method + ' ' + req.url);
    next();
});

app.use("/tasks", tasksRoutes);

app.use("/users", usersRoutes);

app.listen(8050, () => {
    debugServer('listening');
});