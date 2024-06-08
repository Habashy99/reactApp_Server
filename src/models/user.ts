import { User } from "../database/entity/User";
export class UserDAO {
    id?: number = null;
    firstName: string = "";
    lastName: string = "";
    email: string = "";
    password: string = "";
    address: string = "";

    save() {
        return User.save(this as UserDAO);
    }

    static async getUserByEmail(email: string): Promise<UserDAO> {
        const user = await User.findOneBy({ email: email })
        return Object.assign(new UserDAO(), user)
    }

    static async getAllUsers(): Promise<User[]> {
        return User.find();
    }

    static async getUserById(id: number): Promise<UserDAO> {
        const user = await User.findOneBy({ id })
        return Object.assign(new UserDAO(), user)
    }

    delete() {
        return User.delete({ id: this.id })
    }
}