import * as express from 'express';
import debug from "debug";
const debugServer = debug('task:server');
const router = express.Router();
import { TaskDAO } from "../models/task"
import { Task } from '../database/entity/Tasks'

router.get("/", async (req, res) => {
    const tasks = await TaskDAO.getAllTasksByUserId(req.body.id)
    try {
        debugServer("all the tasks are retrieved")
        return res.status(200).send(tasks);
    } catch (error) {
        debugServer("the tasks' array is empty %o", error)
        return res.status(500).send({ message: "the tasks' array is empty" });
    }
});

router.get("/search", async (req, res) => {
    try {
        const taskName = req.query.name;
        if (!taskName) {
            return res.status(400).send("The task name is empty");
        }
        const tasks = await TaskDAO.getTasksByName(taskName.toString())
        debugServer("the task are retrieved");
        return res.status(200).send(tasks);
    } catch (error) {
        debugServer("the task not found %o", error)
        return res.status(500).send({ message: "the task not found" });
    }
});

router.post("/add", async (req, res) => {
    try {
        let task: Task = req.body.task as Task
        task.userId = req.body.userId;
        if (Object.keys(task).length === 0) {
            return res.status(400).send("error the task has no values");
        }
        if (task.name == "" || task.time == "" || !task.userId || task.isDone == undefined) {
            return res.status(400).send("task name or task time should not be empty");
        }
        const newTask = new TaskDAO()
        for (let key in req.body) {
            if (newTask.hasOwnProperty(key)) {
                newTask[key] = req.body[key];
            }
        }
        await newTask.save()
        debugServer("the task added successfully")
        return res.status(200).send(newTask);
    } catch (error) {
        debugServer("the task fail to added to the tasks' table %o", error)
        return res.status(400).send({ message: "the task fail to added to the tasks' array" });
    }
});

router.put("/edit", async (req, res) => {
    try {
        if (req.body.task.id === undefined) {
            return res.status(400).send("id should not be empty");
        }
        const task = await Task.findOneBy({ id: req.body.task.id });
        if (Object.keys(task).length === 0) {
            return res.status(400).send("fail to fetch the selected task");
        }
        if (req.body.task.name === "" || req.body.task.time === "") {
            return res.status(400).send("task name or task time should not be empty ");
        }
        const editedTask = new Task()
        for (let key in req.body) {
            if (editedTask.hasOwnProperty(key)) {
                editedTask[key] = req.body[key];
            }
        }
        await editedTask.save()
        debugServer("the task was modified successfully")
        return res.status(200).send(editedTask);
    } catch (error) {
        debugServer("modifying the task failed %o", error)
        return res.status(400).send({ message: "modifying the task failed" });
    }
})

router.delete("/delete", async (req, res) => {
    try {
        const taskId = req.body.id
        if (typeof taskId === "string") {
            return res.status(400).send("index should not be string must be number");
        }
        const deletedTask = new TaskDAO();
        await deletedTask.delete()
        // const deletedTask = await TaskDAO.delete(taskId);
        // if (!result) {
        //     throw new Error("deleted task fail")
        // }
        debugServer("the task has been deleted successfully")
        return res.status(200).send({ message: "delete task success", deletedTask: deletedTask });
    } catch (error) {
        debugServer("delete task failed %o", error)
        return res.status(500).send({ message: "delete task failed" });
    }
})
router.delete("/deleteBulk", async (req, res) => {
    try {
        const userId = req.body.userId
        if (typeof userId === "string") {
            return res.status(400).send("index should not be string must be number");
        }

        const deletedTasks = new TaskDAO();
        await deletedTasks.deleteBulk();

        // if (deletedTasks== 0) {
        //     throw new Error("deleted tasks fail")
        // }
        debugServer("the task has been deleted successfully")
        return res.status(200).send({ message: "delete tasks success", deletedTasks });
    } catch (error) {
        debugServer("delete task failed %o", error)
        return res.status(500).send({ message: "delete tasks failed" });
    }
})

export default router;