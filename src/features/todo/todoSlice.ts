import {Todo, TodoApiFactory} from "../../api";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk, RootState} from "../../app/store";
import {setProgress} from "../progress/progressSlice";

export interface TodoState {
    todos: {
        byIds: {
            [id: number]: Todo
        },
        allIds: number[]
    }
}

const initialState: TodoState = {
    todos: {
        byIds: {},
        allIds: [],
    },
};

export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        fetchTodos: (state, action: PayloadAction<Todo[]>) => {
            const byIds: {[id: number]: Todo} = {}
            const allIds: number[] = []

            action.payload.forEach((todo) => {
                byIds[todo.id || 0] = todo
                allIds.push(todo.id || 0)
            })

            state.todos = {
                byIds: byIds,
                allIds: allIds,
            }
        },
        setDone: (state, action: PayloadAction<{todo: Todo, done: boolean}>) => {
            if (action.payload.todo.id === undefined) {
                return
            }
            state.todos.byIds[action.payload.todo.id] = {...state.todos.byIds[action.payload.todo.id], done: action.payload.done}
        },
        setSubject: (state, action: PayloadAction<{todo: Todo, subject: string}>) => {
            if (action.payload.todo.id === undefined) {
                return
            }
            state.todos.byIds[action.payload.todo.id] = {...state.todos.byIds[action.payload.todo.id], subject: action.payload.subject}
        },
    },
});

export const {fetchTodos, setDone, setSubject} = todoSlice.actions;

export const selectTodos = (state: RootState) => {
    return state.todo.todos.allIds.map((id) => state.todo.todos.byIds[id])
};

export const fetchTodosAsync = (): AppThunk => async (
    dispatch
) => {
    dispatch(setProgress({path: '/todos', method: 'GET', status: 'PENDING'}))
    const result = await TodoApiFactory().getTodoCollection()
    dispatch(setProgress({path: '/todos', method: 'GET', status: 'SUCCESSFUL'}))
    dispatch(fetchTodos(result.data));
};

export const setDoneAsync = (todo: Todo, done: boolean): AppThunk => async (
    dispatch
) => {
    if (todo.id === undefined) {
        return
    }
    dispatch(setProgress({path: '/todos/' + todo.id, method: 'PATCH', status: 'PENDING'}))
    await TodoApiFactory().patchTodoItem(todo.id.toString(), {done: done})
    dispatch(setProgress({path: '/todos/' + todo.id, method: 'PATCH', status: 'SUCCESSFUL'}))
    dispatch(setDone({todo, done}));
};

export const setSubjectAsync = (todo: Todo, subject: string): AppThunk => async (
    dispatch
) => {
    if (todo.id === undefined) {
        return
    }
    dispatch(setProgress({path: '/todos/' + todo.id, method: 'PATCH', status: 'PENDING'}))
    await TodoApiFactory().patchTodoItem(todo.id.toString(), {subject: subject})
    dispatch(setProgress({path: '/todos/' + todo.id, method: 'PATCH', status: 'SUCCESSFUL'}))
    dispatch(setSubject({todo, subject}));
};

export default todoSlice.reducer;