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
    add(taskData: {title: string, order: number, status: TaskStatusType}) {
        return tasksCollectionRef.add({...taskData})
    },
    delete(taskId: string) {
        return tasksCollectionRef.doc(taskId).delete()
    },
    update(taskId: string, taskData: TaskDataType) {
        return tasksCollectionRef.doc(taskId).update({...taskData})
    },
    updateOrder(tasksData: TaskDataType[]) {
        const batch = db.batch()
        for (let i = 0; i < tasksData.length; i++) {
            batch.update(tasksCollectionRef.doc(tasksData[i].id), {order: tasksData[i].order})
        }
        return batch.commit()
    }
}