import {AdvertDataType} from "../redux/adverts-reducer"
import {advertsCollection, firebaseIncrement, firebaseTimestamp, usersCollection} from "./firebase"
import {OrderByType, OrderDirectionType} from "../redux/app-reducer";
import {firebaseLooper} from "../helpers/firebaseLooper";

// ---------------------------------------------------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------------------------------------------------------------------------------
// USERS API
// ---------------------------------------------------------------------------------------------------------------------

export const USERS_API = {
    get(orderDirection: OrderDirectionType = "asc") {
        return usersCollection
            .orderBy("userName", orderDirection)
            .get()
            .then(snapshot => {
                return firebaseLooper(snapshot)
            })
    },
    add(userData: UserDataType) {
        return usersCollection.add({...userData})
    },
    delete(userID: string) {
        return usersCollection.doc(userID).delete()
    },
    update(userID: string, userData: UserDataType) {
        return usersCollection.doc(userID).update({...userData})
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// ADVERTS API
// ---------------------------------------------------------------------------------------------------------------------

export const ADVERTS_API = {
    get(searchQuery: string | null = null, orderBy: OrderByType = "title", orderDirection: OrderDirectionType = "asc"): Promise<AdvertDataType[]> {
        if (searchQuery) {
            return advertsCollection
                // Поиск только по _title, но предусмотрена возможность поиска по _description
                .orderBy("_title")
                .startAt(searchQuery.toLowerCase())
                .endAt(searchQuery.toLowerCase() + "\uf8ff")
                .get()
                .then(snapshot => {
                    return firebaseLooper(snapshot)
                })
        } else {
            return advertsCollection
                .orderBy(orderBy, orderDirection)
                .get()
                .then(snapshot => {
                    return firebaseLooper(snapshot)
                })
        }
    },
    getByID(advertID: string) {
        const advertRef = advertsCollection.doc(advertID)

        // Так себе решение
        // Для продакшена необходимо использовать распределенные счётчики
        // https://firebase.google.com/docs/firestore/solutions/counters
        advertRef
            .update({
                views: firebaseIncrement(1)
            })

        return advertRef.get()
    },
    add(ownerID: string, advertData: AdvertDataType) {

        delete advertData.ID

        return advertsCollection.add({
            ...advertData,
            ownerID,
            created: firebaseTimestamp(),
            _title: advertData.title.toLowerCase(),
            _description: advertData.description.toLowerCase()
        })
    },
    delete(advertID: string) {
        return advertsCollection.doc(advertID).delete()
    },
    update(advertID: string, advertData: AdvertDataType) {
        return advertsCollection.doc(advertID).update({
            ...advertData,
            modified: firebaseTimestamp(),
            _title: advertData.title.toLowerCase(),
            _description: advertData.description.toLowerCase()
        })
    },
    getOwned(ownerID: string, orderBy: OrderByType = "title", orderDirection: OrderDirectionType = "asc") {
        return advertsCollection
            .where("ownerID", "==", ownerID)
            .orderBy(orderBy, orderDirection)
            .get()
            .then(snapshot => {
                return firebaseLooper(snapshot)
            })
    },
}