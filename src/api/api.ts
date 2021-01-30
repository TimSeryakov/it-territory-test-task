import {tasksCollection} from "./firebase"
import {firebaseLooper} from "../helpers/firebaseLooper"
import {TaskDataType, TaskStatusType} from "../redux/todolist-reducer";

// ---------------------------------------------------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------------------------
// TASKS API
// ---------------------------------------------------------------------------------------------------------------------

export const TASKS_API = {
    get() {
        return tasksCollection
            // .orderBy("order", "asc")
            .get()
            .then(snapshot => {
                return firebaseLooper(snapshot)
            })
    },
    add(taskData: {title: string, order: number, status: TaskStatusType}) {
        return tasksCollection.add({...taskData})
    },
    delete(taskId: string) {
        return tasksCollection.doc(taskId).delete()
    },
    update(taskId: string, taskData: TaskDataType) {
        return tasksCollection.doc(taskId).update({...taskData})
    }
}