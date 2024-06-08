import { Task } from "../database/entity/Tasks";
//import { AppDataSource } from "../database/main";

export class TaskDAO {
    id?: number = null;
    name: string = "";
    time: string = "";
    isDone: boolean = false;
    userId: number = null;

    save() {
        return Task.save(this as TaskDAO);
        //const taskRepository = AppDataSource.getRepository(Task)
        // const newTask = new Task();
        // newTask.name = name;
        // newTask.time = time;
        // newTask.isDone = isDone;
        // newTask.userId = userId
        // await taskRepository.save(newTask);

    }
    static getAllTasks(): Promise<Task[]> {
        return Task.find()
        //const taskRepository = AppDataSource.getRepository(Task)
        // const tasks = await taskRepository.find()
    }
    static async getAllTasksByUserId(id: number): Promise<TaskDAO[]> {
        const tasks = await Task.findBy({ userId: id })
        return tasks.map((task)=>{
            return Object.assign(new TaskDAO(), task)
        })
        //const taskRepository = AppDataSource.getRepository(Task)
        //const tasks = await taskRepository.findBy({ id: id })
    }
    static async getTaskById(id: number): Promise<TaskDAO> {
        const task = await Task.findOneBy({ id })
        return Object.assign(new TaskDAO(), task)
        // const taskRepository = AppDataSource.getRepository(Task)
        //const task = await taskRepository.findOneBy({ id: id });
    }

    static async getTasksByName(name: string): Promise<TaskDAO[]> {
        const tasks = await Task.findBy({ name })
        return tasks.map((task) => {
            return Object.assign(new TaskDAO(), task)
        })
        // const taskRepository = AppDataSource.getRepository(Task)
        // const task = await taskRepository.findBy({ name: name });
    }
    delete() {
        return Task.delete({ id: this.id });
        // const taskRepository = AppDataSource.getRepository(Task)
        // const task = await taskRepository.findOneBy({ id: id });
        // const deletedTask = await taskRepository.remove(task)
    }
    deleteBulk() {
        return Task.delete({ userId: this.userId });
        //  const taskRepository = AppDataSource.getRepository(Task)
        //const task = await taskRepository.findBy({ userId: userId })
        // const deletedTask = await taskRepository.remove(task);
    }
}