import express from 'express';
import debug from "debug";
const debugServer = debug('task:server');
const router = express.Router();

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
}

let users: User[] = [
    {
        id: "1",
        "firstName": "body",
        "lastName": "habashy",
        "email": "habashy@yahoo.com",
        "password": "123456",
        "address": "Alex,Egypt"
    },
    {
        id: "2",
        "firstName": "mohamed",
        "lastName": "habashy",
        "email": "mohamedHabashy@yahoo.com",
        "password": "123456",
        "address": "Alex,Egypt"
    }
];


router.get("/", (req, res) => {
    try {
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

router.get("/search", (req, res) => {
    try {
        const userID = req.query.id;
        if (!userID) {
            return res.status(400).send("The user id is empty");
        }
        debugServer("the user are retrieved");
        const searchedUsers = users.filter((user) => {
            return user.id == userID
        });
        return res.status(200).send(searchedUsers);

    } catch (error) {
        debugServer("the user not found %o", error)
        return res.status(500).send({ message: "the user not found" });
    }
});
router.get("/email", (req, res) => {
    try {
        const userEmail = req.query.email;
        if (!userEmail) {
            return res.status(400).send("The user email is empty");
        }
        debugServer("the user are retrieved");
        const searchedUsers = users.filter((user) => {
            return user.email == userEmail
        });
        return res.status(200).send(searchedUsers);
    } catch (error) {
        debugServer("the user not found %o", error)
        return res.status(500).send({ message: "the user not found" });
    }
});

router.post("/add", (req, res) => {
    try {
        const user: User = req.body.user as User
        if (Object.keys(user).length === 0) {
            return res.status(400).send("error the user has no values");
        }
        if (user.firstName == "" || user.lastName == "" || user.email == "" || user.password == "" || user.address == "") {
            return res.status(400).send("user data should not be empty");
        }
        users.push(user);
        debugServer("the user added to the users' array successfully")
        return res.status(200).send(`${user.firstName} has been added to the user array`);
    } catch (error) {
        debugServer("the user fail to added to the users' array %o", error)
        return res.status(400).send({ message: "the user fail to added to the users' array" });
    }
});

router.put("/edit", (req, res) => {
    try {
        if (req.body.index === undefined) {
            return res.status(400).send("index should not be empty");
        }
        const user = users[req.body.index];
        if (Object.keys(user).length === 0) {
            throw new Error("fail to fetch the selected user")
        }
        if (req.body.firstName === "" || req.body.lastName === "") {
            throw new Error("user name should not be empty")
        }
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        debugServer("the user was modified successfully")
        return res.status(200).send(`${user.firstName} with ${user.lastName} has been changed`);
    } catch (error) {
        debugServer("modifying the user failed %o", error)
        return res.status(400).send({ message: "modifying the user failed" });
    }
});

router.delete("/delete", (req, res) => {
    try {
        const userID = req.body.index
        if (typeof userID === "string") {
            return res.status(400).send("index should not be string must be number");
        }
        const deletedUser = users.splice(userID, 1)
        if (deletedUser.length === 0) {
            throw new Error("deleted user fail")
        }
        debugServer("the userID has been deleted successfully")
        return res.status(200).send({ message: "success" });
    } catch (error) {
        debugServer("delete userID failed %o", error);
        return res.status(500).send({ message: "delete userID failed" });
    }
});

router.post("/login", (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        if (!email || !password) {
            return res.status(400).send({ message: "email or password not valid" })
        }
        const storedUser = users.find((user) => user.email == email);
        if (email === storedUser.email && password === storedUser.password) {
            let user = { ...storedUser, token: "123456" }
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

export default router;