import express from 'express';
import debug from "debug";
const debugServer = debug('task:server');
const router = express.Router();

interface Task {
    taskName: string;
    taskTime: string;
}

let tasks: Task[] = [
    {
        "taskName": "firstTask",
        "taskTime": "2h"
    },
    {
        "taskName": "secondTask",
        "taskTime": "3h"
    }
];


router.get("/", (req, res) => {
    try {
        if (tasks.length === 0) {
            return res.status(400).send("The task is empty try to add more tasks");
        }
        debugServer("all the tasks are retrieved")
        return res.status(200).send(tasks);
    } catch (error) {
        debugServer("the tasks' array is empty %o", error)
        return res.status(500).send({ message: "the tasks' array is empty" });
    }
});

router.get("/search", (req, res) => {
    try {
        const taskName = req.query.taskName;
        if (!taskName) {
            return res.status(400).send("The task name is empty");
        }
        debugServer("the task are retrieved");
        const searchedTasks = tasks.filter((task) => {
            return task.taskName == taskName
        });
        return res.status(200).send(searchedTasks);
    } catch (error) {
        debugServer("the task not found %o", error)
        return res.status(500).send({ message: "the task not found" });
    }
});

router.post("/add", (req, res) => {
    try {
        const task: Task = req.body.task as Task
        if (Object.keys(task).length === 0) {
            return res.status(400).send("error the task has no values");
        }
        if (task.taskName == "" || task.taskTime == "") {
            return res.status(400).send("task name or task time should not be empty");
        }
        tasks.push(task);
        debugServer("the task added to the tasks' array successfully")
        return res.status(200).send(`${task.taskName} has been added to the task array`);
    } catch (error) {
        debugServer("the task fail to added to the tasks' array %o", error)
        return res.status(400).send({ message: "the task fail to added to the tasks' array" });
    }
});

router.put("/edit", (req, res) => {
    try {
        if (req.body.index === undefined) {
            return res.status(400).send("index should not be empty");
        }
        const task = tasks[req.body.index];
        if (Object.keys(task).length === 0) {
            return res.status(400).send("fail to fetch the selected task");
        }
        if (req.body.taskName === "" || req.body.taskTime === "") {
            return res.status(400).send("task name or task time should not be empty ");
        }

        task.taskName = req.body.taskName;
        task.taskTime = req.body.taskTime;
        debugServer("the task was modified successfully")
        return res.status(200).send(`${task.taskName} with ${task.taskTime} has been changed`);
    } catch (error) {
        debugServer("modifying the task failed %o", error)
        return res.status(400).send({ message: "modifying the task failed" });
    }
})

router.delete("/delete", (req, res) => {
    try {
        const taskIndex = req.body.index
        if (typeof taskIndex === "string") {
            return res.status(400).send("index should not be string must be number");
        }
        const deletedTask = tasks.splice(taskIndex, 1)
        if (deletedTask.length === 0) {
            throw new Error("deleted task fail")
        }
        debugServer("the task has been deleted successfully")
        return res.status(200).send(`${JSON.stringify(deletedTask)} has been deleted`);
    } catch (error) {
        debugServer("delete task failed %o", error)
        return res.status(500).send({ message: "delete task failed" });
    }
})

export default router;