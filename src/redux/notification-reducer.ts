// ---------------------------------------------------------------------------------------------------------------------
// Init State
// ---------------------------------------------------------------------------------------------------------------------

export const initialState: NotificationStateType = {
    notification: null
}

// ---------------------------------------------------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------------------------------------------------

export type NotificationStateType = {
    notification: { message: string, type: NotificationMessageType } | null
}

export type NotificationMessageType = "info" | "success" | "warning" | "error" | "default"

// ---------------------------------------------------------------------------------------------------------------------
// Action Creators Types
// ---------------------------------------------------------------------------------------------------------------------

export type NotificationActionTypes =
    | ReturnType<typeof setNotificationMessageAC>
    | ReturnType<typeof setNotificationMessageEmptyAC>

// ---------------------------------------------------------------------------------------------------------------------
// Enum as const
// ---------------------------------------------------------------------------------------------------------------------

enum NOTIFICATION {
    SET_NOTIFICATION = "NOTIFICATION/SET_NOTIFICATION",
    SET_NOTIFICATION_EMPTY = "NOTIFICATION/SET_NOTIFICATION_EMPTY"
}

//
export enum NOTIFICATION_MESSAGES {
    SYNC_ERROR = "Error while sync data"
}

// ---------------------------------------------------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------------------------------------------------

const notificationReducer = (state: NotificationStateType = initialState, action: NotificationActionTypes): NotificationStateType => {
    switch (action.type) {
        case NOTIFICATION.SET_NOTIFICATION: {
            return {
                notification: {message: action.payload.message, type: action.payload.type}
            }
        }
        case NOTIFICATION.SET_NOTIFICATION_EMPTY: {
            return {
                notification: null,
            }
        }
        default:
            return state
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// Action Creators
// ---------------------------------------------------------------------------------------------------------------------

export const setNotificationMessageAC = (message: string, type: NotificationMessageType) =>
    ({ type: NOTIFICATION.SET_NOTIFICATION, payload: { message, type } }) as const

export const setNotificationMessageEmptyAC = () =>
    ({type: NOTIFICATION.SET_NOTIFICATION_EMPTY}) as const

// ---------------------------------------------------------------------------------------------------------------------

export default notificationReducer


