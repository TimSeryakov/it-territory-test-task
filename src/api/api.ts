import {firebaseLooper} from '../helpers/firebaseLooper'
import {TaskDataType, TaskStatusType} from '../redux/todolist-reducer'
import {db, tasksCollectionRef} from './firebase'

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
    add(title: string, order: number) {
        const newTaskRef = tasksCollectionRef.doc()
        const id = newTaskRef.id
        newTaskRef.set({title, order, status: "active"})
            // .then(() => ({id, title, order, status: "active" as TaskStatusType}))
        return ({id, title, order, status: "active" as TaskStatusType})
    },
    delete(id: string) {
        return tasksCollectionRef.doc(id).delete()
    },
    update(id: string, taskData: TaskDataType) {
        return tasksCollectionRef.doc(id).update(taskData)
    },
    updateOrder(tasks: TaskDataType[]) {
        const batch = db.batch()
        tasks.forEach(task => {
            batch.update(tasksCollectionRef.doc(task.id), {order: task.order})
        })
        return batch.commit()
    }
}