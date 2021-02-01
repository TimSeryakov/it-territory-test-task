import { createSlice, PayloadAction } from '@reduxjs/toolkit'


// types
// ---------------------------------------------------------------------------------------------------------------------
export type NotificationStateType = {
    notification: { message: string, type: NotificationMessageType } | null
}

export type NotificationMessageType = "info" | "success" | "warning" | "error" | "default"

// action creators types
// ---------------------------------------------------------------------------------------------------------------------
export type NotificationActionTypes =
    | ReturnType<typeof setNotificationMessageAC>
    | ReturnType<typeof setNotificationMessageEmptyAC>

export enum NOTIFICATIONS {
    SYNC_ERROR = "Error while syncing data"
}

// reducer
// ---------------------------------------------------------------------------------------------------------------------
const slice = createSlice({
    name: "notifications",
    initialState: {
        notification: null
    } as NotificationStateType,
    reducers: {
        setNotificationMessageAC(state, action: PayloadAction<{ message: string, type: NotificationMessageType }>) {
            state.notification = { message: action.payload.message, type: action.payload.type }
        },
        setNotificationMessageEmptyAC(state) { // action: PayloadAction<undefined>
            state.notification = null
        }
    }
})

// actions creators export
// ---------------------------------------------------------------------------------------------------------------------
export const {setNotificationMessageAC, setNotificationMessageEmptyAC} = slice.actions


// ---------------------------------------------------------------------------------------------------------------------
const notificationReducer = slice.reducer
export default notificationReducer


