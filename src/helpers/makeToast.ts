import {toast} from "react-toastify"
import { NotificationMessageType } from "../redux/notification-reducer"

type MakeToastType = {message: string, type: NotificationMessageType}

export const makeToast = ({message, type}: MakeToastType) => {
    toast(message, {
        type: type,
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
    })
}