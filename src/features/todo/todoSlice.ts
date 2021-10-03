import {Todo, TodoApiFactory} from "../../api";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk, RootState} from "../../app/store";
import {setProgress} from "../progress/progressSlice";
import update from "immutability-helper";

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

export const selectTodo = (state: RootState, todoId: number) => {
    return state.todo.todos.byIds[todoId]
};

export const selectTodos = (state: RootState) => {
    return state.todo.todos.allIds.map((id) => state.todo.todos.byIds[id])
};

export const selectTodosMap = (state: RootState) => {
    return state.todo.todos.byIds
};

export const selectAllTodoIds = (state: RootState) => {
    return state.todo.todos.allIds
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

export const reorder = (dragIndex: number, hoverIndex: number): AppThunk => (
    dispatch,
    getState
) => {
    const state = getState()
    const todos = selectTodos(state)
    const dragTodo = todos[dragIndex]
    dispatch(fetchTodos(update(todos, {
        $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragTodo],
        ],
    })))
}

export const setPositionAsync = (todoId: string, position: number): AppThunk => async (dispatch) => {
    dispatch(setProgress({path: '/todos/' + todoId, method: 'PATCH', status: 'PENDING'}))
    await TodoApiFactory().patchTodoItem(todoId.toString(), {position: position})
    dispatch(setProgress({path: '/todos/' + todoId, method: 'PATCH', status: 'SUCCESSFUL'}))
}

export default todoSlice.reducer;