import React, {ChangeEvent, useCallback, useState} from 'react'
import {TaskItem} from '../TaskItem/TaskItem'
import {RootStateType} from '../../redux/store'
import {useDispatch, useSelector} from 'react-redux'
import {
    addTaskTC,
    editTaskTitleTC,
    removeTaskTC,
    toggleTaskStatusTC,
    updateTasksOrderTC
} from '../../redux/todolist-reducer'
import {List} from 'react-movable'
import {Preloader} from '../common/Preloader/Preloader'

export const TodoList = () => {
    const taskSelector = useCallback((state: RootStateType) => state.todolist, [])
    const {tasks, isSyncing} = useSelector(taskSelector)
    const dispatch = useDispatch()

    const editTask = (id: string, newValue: string) => {
        dispatch(editTaskTitleTC(id, newValue))
    }
    const toggleStatus = (id: string) => {
        dispatch(toggleTaskStatusTC(id))
    }
    const removeTask = (id: string) => {
        dispatch(removeTaskTC(id))
    }

    return (
        <section className="my-12">
            <Header isFetching={isSyncing && tasks.length !== 0}/>
            <AddTaskInput/>
            {tasks.length === 0
                ?
                <div className="flex justify-center items-center h-96 py-24">
                    <Preloader message="Requesting data..."/>
                </div>
                :
                <main>
                    <List
                        lockVertically
                        values={tasks}
                        onChange={({oldIndex, newIndex}) =>
                            dispatch(updateTasksOrderTC(oldIndex, newIndex))
                        }
                        renderList={({children, props}) => {
                            return <ul {...props}>
                                {children}
                            </ul>
                        }}
                        renderItem={({value, props, isDragged, isSelected}) => {
                            return <TaskItem {...props}
                                             id={value.id}
                                             status={value.status}
                                             title={value.title}
                                             order={value.order}
                                             removeTask={removeTask}
                                             toggleStatus={toggleStatus}
                                             editTask={editTask}
                                             focused={isDragged || isSelected}
                            />
                        }}
                    />
                </main>
            }
        </section>
    )
}
//----------------------------------------------------------------------------------------------------------------------
// Built-in components
//----------------------------------------------------------------------------------------------------------------------

const Header = (props: { isFetching: boolean }) => {
    return (
        <header className="text-gb-text opacity-40 focus:outline-none mb-14 relative">
            <a href="https://youtu.be/5coefdzLlYc" target="_blank" rel="noreferrer" className="focus:outline-none">
                <h1 className="text-4xl mb-3">Watcha gonna do, whatcha gonna do</h1>
                <h2 className="text-xl my-1">When they come for you</h2>
                <h3 className="text-sm">Bad boys, bad boys...</h3>
            </a>
            <div className="inline-block text-blue-50 absolute bottom-0 right-0 mb-1 mr-12">
                {props.isFetching && <Preloader message="Syncing..."/>}
            </div>
        </header>
    )
}

const AddTaskInput = () => {
    const [typedText, setTypedText] = useState<string | null>()
    const dispatch = useDispatch()

    const addTask = () => {
        if (typedText) {
            dispatch(addTaskTC(typedText))
            setTypedText(null)
        }
    }

    const inputOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTypedText(e.currentTarget.value)
    }

    const inputOnKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && typedText) {
            dispatch(addTaskTC(typedText))
            setTypedText(null)
        }
    }

    return (
        <div className="mt-10 mb-5 flex px-2">
            <input value={typedText ? typedText : ""}
                   type="input"
                   placeholder="Type something..."
                   className="bg-gb-dark-medium text-gb-light border-gb-text
                              p-3 text-2xl mr-1 border-b-2
                              placeholder-gb-dark-soft focus:outline-none flex-auto"
                   onChange={inputOnChangeHandler}
                   onKeyPress={inputOnKeyPressHandler}
            />
            <button className="ml-1 px-1 text-gb-text opacity-75 hover:opacity-100 focus:outline-none"
                    onClick={addTask}
            >
                <AddIcon/>
            </button>
        </div>
    )
}

// Icons (SVG)
//----------------------------------------------------------------------------------------------------------------------

const AddIcon = () => {
    return (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
            />
        </svg>
    )
}