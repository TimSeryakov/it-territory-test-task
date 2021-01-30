import React, {FC} from 'react'
import {PreloaderCircle} from "./PreloaderCircle"

type PreloaderPropsType = {
    message?: string
    circle?: boolean
}
export const Preloader: FC<PreloaderPropsType> = (
    {
        message = "Loading...", circle = true
    }
) => {

    return (
        <div className="w-full h-full flex justify-center items-center">
            {circle && <PreloaderCircle/>}
            <span className="text-gb-text text-3xl animate-pulse">
                {message}
            </span>
        </div>
    )
}
