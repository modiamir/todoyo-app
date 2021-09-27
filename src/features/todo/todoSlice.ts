import {Todo, TodoApiFactory} from "../../api";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk, RootState} from "../../app/store";

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
        markAsDone: (state, action: PayloadAction<Todo>) => {
            if (action.payload.id === undefined) {
                return
            }
            state.todos.byIds[action.payload.id] = {...state.todos.byIds[action.payload.id], done: false}
        }
    },
});

export const {fetchTodos, markAsDone} = todoSlice.actions;

export const selectTodos = (state: RootState) => {
    return state.todo.todos.allIds.map((id) => state.todo.todos.byIds[id])
};

export const fetchTodosAsync = (): AppThunk => async (
    dispatch
) => {
    const result = await TodoApiFactory().getTodoCollection()
    dispatch(fetchTodos(result.data));
};

export const markAsDoneAsync = (todo: Todo): AppThunk => async (
    dispatch
) => {
    if (todo.id === undefined) {
        return
    }
    await TodoApiFactory().patchTodoItem(todo.id.toString(), {done: false})
    dispatch(markAsDone(todo));
};

export default todoSlice.reducer;