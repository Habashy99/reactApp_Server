const dotenv = require('dotenv').config();
const express = require("express");
const debug = require("debug")('worker:a');
// const http = require("http");

// const server = http.createServer((req, res) => {
//     res.write("hello");
//     res.end();

// });
// server.listen(8050);
let tasks = [
    {
        "taskName": "firstTask",
        "taskTime": "2h"
    },
    {
        "taskName": "secondTask",
        "taskTime": "3h"
    }
];
const app = express();
debug('booting %o', 'My App');
app.use(express.json());

app.get("/", (req, res, next) => {
    debug(req.method + ' ' + req.url);
    res.send("Hello");
});

app.get("/tasks", (req, res, next) => {
    debug(req.method + ' ' + req.url);
    res.send(tasks);
});

app.post("/tasks/add", (req, res, next) => {
    const task = req.body.task
    tasks.push({ task });
    res.send(`${task.taskName} has been added to the task array`);
});

app.put("/tasks/edit", (req, res, next) => {
    const task = tasks[req.body.index];
    task.taskName = req.body.taskName;
    task.taskTime = req.body.taskTime;

    res.send(`${task.taskName} with ${task.taskTime} has been changed`);
})

app.delete("/tasks/delete",(req,res,next)=>{

    const taskIndex =req.body.index
    const deletedTask = tasks.splice(taskIndex,1)

    res.send(`${JSON.stringify(deletedTask)} has been deleted`);
})



app.listen(8050, () => {
    debug('listening');
});