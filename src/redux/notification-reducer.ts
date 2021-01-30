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
    ADD_ADVERT_SUCCESS = "Advert successfully created",
    ADD_ADVERT_ERROR = "Error while advert saving",
    EDIT_ADVERT_SUCCESS = "Advert successfully edited",
    LOGIN_SUCCESS = "You have successfully logged in",
    LOGIN_ERROR = "Invalid username or password",
    LOGOUT_SUCCESS = "Successfully signout",
    AUTH_ERROR = "Login please"
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


