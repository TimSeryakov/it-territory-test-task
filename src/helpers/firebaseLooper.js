export const firebaseLooper = (snapshot) => {
    let data = []
    snapshot.forEach(doc => {
        data.push({
            ...doc.data(),
            ID: doc.id
        })
    })
    return data
}