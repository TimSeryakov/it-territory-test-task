import React from 'react'
import cat from "./cat.svg"

export const Page404 = () => {
    return (
        <section className="mx-auto bg-gb-dark-medium rounded-2xl py-5 text-gb-text text-xl py-56">
            <div className="flex items-center justify-center w-full">
                <div className="flex flex-col text-gray-700 lg:flex-row lg:space-x-16 lg:space-x-reverse">
                    <div className="order-1 max-w-md px-2 text-sm md:text-base lg:px-0">
                        <header className="mb-6">
                            <h2 className="text-4xl font-bold leading-none text-gb-light select-none lg:text-6xl pb-5">
                                404.
                            </h2>
                            <h3 className="text-xl font-light text-gb-text leading-normal lg:text-3xl md:text-3xl">
                                Sorry, we couldn't find this page.
                            </h3>
                        </header>

                        <p className="max-w-sm mb-5 leading-5 md:leading-7 text-gb-text pb-5">
                            Don't worry, sometimes even we make mistakes.
                            You can find plenty of other things on our homepage.
                        </p>

                        <a href="/"
                           className="px-4 py-2 text-gb-light rounded-md bg-gb-text
                                           focus:outline-none focus:shadow-outline mx-auto
                                           uppercase opacity-70 hover:opacity-100">
                            Back to Homepage
                        </a>
                    </div>

                    <div className="max-w-lg">
                        <img src={cat} alt="Page not found. Meow."/>
                    </div>

                </div>
            </div>
        </section>
    )
}