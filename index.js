const dotenv = require('dotenv').config();
const express = require("express");
const debug = require("debug")('task:server');

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
    try {
        if (tasks.length === 0) {
            throw new Error("The task is empty")
        }
        res.send(tasks);
    } catch (error) {
        res.send(error);
    }
});

app.post("/tasks/add", (req, res, next) => {
    debug(req.method + ' ' + req.url);
    try {
        const task = req.body.task
        if (task == {}) {
            throw new Error("error the task has no values")
        }
        if (task.taskName == "") {
            throw new Error("task name should not be empty")
        }
        if (task.taskTime == "") {
            throw new Error("task time should not be empty")
        }
        tasks.push({ task });

        if (tasks.length === tasks.length + 1) {
            throw new Error("task not added")
        }
        res.send(`${task.taskName} has been added to the task array`);
    } catch (error) {
        res.send(error);
    }
});

app.put("/tasks/edit", (req, res, next) => {
    debug(req.method + ' ' + req.url);
    try {
        if (req.body.index === undefined) {
            throw new Error("index should not be empty")
        }
        const task = tasks[req.body.index];
        if (task == {}) {
            throw new Error("fail to fetch the selected task")
        }
        if (req.body.taskName === "") {
            throw new Error("task name should not be empty")
        }
        if (req.body.taskTime === "") {
            throw new Error("task time should not be empty")
        }
        task.taskName = req.body.taskName;
        task.taskTime = req.body.taskTime;

        res.send(`${task.taskName} with ${task.taskTime} has been changed`);
    } catch (error) {
        res.send(error);
    }
})

app.delete("/tasks/delete", (req, res, next) => {
    debug(req.method + ' ' + req.url);
    try {
        const taskIndex = req.body.index
        if (typeof taskIndex === "string") {
            throw new Error("index should not be string must be number")
        }
        const deletedTask = tasks.splice(taskIndex, 1)
        if (deletedTask == []) {
            throw new Error("deleted task fail")
        }
        res.send(`${JSON.stringify(deletedTask)} has been deleted`);
    } catch (error) {
        res.send(error);
    }
})



app.listen(8050, () => {
    debug('listening');
});