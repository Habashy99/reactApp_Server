import * as express from 'express';
import debug from "debug";
const debugServer = debug('task:server');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
import { UserDAO } from "../models/user"

router.get("/", async (_req, res) => {
    try {
        const users = await UserDAO.getAllUsers();
        if (users.length === 0) {
            return res.status(400).send("The users array is empty try to add more users");
        }
        debugServer("all the users are retrieved")
        return res.status(200).send(users);
    } catch (error) {
        debugServer("the users' array is empty %o", error)
        return res.status(500).send({ message: "the users' array is empty" });
    }
});

router.get("/search", async (req, res) => {
    try {
        const userId = req.query.id;
        if (!userId) {
            return res.status(400).send("The user id is empty");
        }
        debugServer("the user are retrieved");
        const searchedUsers = await UserDAO.getUserById(Number(userId))
        return res.status(200).send(searchedUsers);

    } catch (error) {
        debugServer("the user not found %o", error)
        return res.status(500).send({ message: "the user not found" });
    }
});

router.get("/email", async (req, res) => {
    try {
        const userEmail = req.query.email;
        if (!userEmail) {
            return res.status(400).send("The user email is empty");
        }
        debugServer("the user are retrieved");
        const searchedUsers = await UserDAO.getUserByEmail(String(userEmail));
        return res.status(200).send(searchedUsers);
    } catch (error) {
        debugServer("the user not found %o", error)
        return res.status(500).send({ message: "the user not found" });
    }
});

router.put("/edit", async (req, res) => {
    try {
        const userId = Number(req.body.id)
        if (userId === undefined) {
            return res.status(400).send("id should not be empty");
        }
        const user = await UserDAO.getUserById(userId);
        if (!user) {
            throw new Error("fail to fetch the selected user")
        }
        if (req.body.firstName === "" || req.body.lastName === "" || req.body.address === "") {
            throw new Error("user name should not be empty")
        }
        for (let key in req.body) {
            if (user.hasOwnProperty(key)) {
                user[key] = req.body[key];
            }
        }
        await user.save()

        debugServer(`${user.firstName} with ${user.lastName} and ${user.address} has been changed `)
        return res.status(200).send({ message: `success` });
    } catch (error) {
        debugServer("modifying the user failed %o", error)
        return res.status(400).send({ message: "modifying the user failed" });
    }
});

router.delete("/delete", (req, res) => {
    try {
        const userId = Number(req.body.id)
        if (typeof userId === "string") {
            return res.status(400).send("index should not be string must be number");
        }

        // const userAndTasksTransaction = db.transaction(() => {
        //     TaskDAO.deleteBulk(userId);
        //     UserDAO.delete(userId);
        // }
        // );
        // console.log(userAndTasksTransaction);
        // userAndTasksTransaction()
        debugServer("the userID has been deleted successfully")
        return res.status(200).send({ message: "success" });
    } catch (error) {

        debugServer("delete userID failed %o", error);
        return res.status(500).send({ message: "delete userID failed" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            return res.status(400).send({ message: "email or password not valid" })
        }
        let storedUser = await UserDAO.getUserByEmail(email)
        const verifyHashedPassword = await bcrypt.compare(password, storedUser.password)
        if (email === storedUser.email && verifyHashedPassword) {
            const token = jwt.sign({
                userId: storedUser.id,
            }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
            let user = { ...storedUser, token }
            delete user.password;
            debugServer("the user has been logIn successfully")
            return res.status(200).send({ message: "logIn successfully", user })
        } else {
            return res.status(400).send({ message: "email or password not found" })
        }
    } catch (error) {
        debugServer("failed to logIn %o", error);
        return res.status(500).send({ message: "logIn failed" });
    }
});

router.post("/signUp", async (req, res) => {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password;
        const address = req.body.address;
        if (!firstName || !lastName || !email || !password || !address) {
            return res.status(400).send({ message: "firstName or lastName or email or password or address not valid" })
        }
        const existingUser = await UserDAO.getUserByEmail(email)
        if (existingUser.email) {
            return res.status(400).send({ message: "this email is used" })
        }
        let hashedPassword = await bcrypt.hash(password, 10)
        let newUser = new UserDAO();
        for (let key in req.body) {
            if (newUser.hasOwnProperty(key)) {
                newUser[key] = req.body[key];
            }
        }
        newUser.password = hashedPassword;
        await newUser.save();
        const token = jwt.sign({
            userId: newUser.id,
        }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        debugServer("the user has been signUp successfully")
        return res.status(200).send({ message: "signUp successfully", user: { ...newUser, token } })
    } catch (error) {
        debugServer("failed to signUp %o", error);
        return res.status(500).send({ message: "signUp failed" });
    }
});

export default router;