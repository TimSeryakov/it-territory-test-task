import {firebaseLooper} from '../helpers/firebaseLooper'
import {TaskDataType, TaskStatusType} from '../redux/todolist-reducer'
import {tasksCollectionRef} from './firebase'

// ---------------------------------------------------------------------------------------------------------------------
// TASKS API
// ---------------------------------------------------------------------------------------------------------------------

export const TASKS_API = {
    get() {
        return tasksCollectionRef
            .orderBy("order", "asc")
            .get()
            .then(snapshot => {
                return firebaseLooper(snapshot)
            })
    },
    add(taskData: {title: string, order: number, status: TaskStatusType}) {
        return tasksCollectionRef.add({...taskData})
    },
    delete(taskId: string) {
        return tasksCollectionRef.doc(taskId).delete()
    },
    update(taskId: string, taskData: TaskDataType) {
        return tasksCollectionRef.doc(taskId).update({...taskData})
    }
}

// export {}