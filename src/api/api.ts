import {firebaseLooper} from '../helpers/firebaseLooper'
import {TaskDataType, TaskStatusType} from '../redux/todolist-reducer'
import {db, tasksCollectionRef} from './firebase'

// ---------------------------------------------------------------------------------------------------------------------
// TASKS API
// ---------------------------------------------------------------------------------------------------------------------

export const TASKS_API = {
    get() { // Done
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
    delete(id: string) {
        return tasksCollectionRef.doc(id).delete()
    },
    update(id: string, taskData: TaskDataType) {
        return tasksCollectionRef.doc(id).update({...taskData})
    },
    updateOrder(tasks: TaskDataType[]) {
        const batch = db.batch()
        tasks.forEach(task => {
            batch.update(tasksCollectionRef.doc(task.id), {order: task.order})
        })
        return batch.commit()
    }
}