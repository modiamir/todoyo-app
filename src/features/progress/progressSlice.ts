import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../../app/store";

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'
type Status = 'PENDING' | 'SUCCESSFUL' | 'FAILED'

export interface ProgressState {
    actions: {[id: string]: {status: Status, result?: object}}
}

const initialState: ProgressState = {
    actions: {},
};

const makeId = (method: Method, path: string) => {
    return method + ' ' + path;
}

export const progressSlice = createSlice({
    name: 'progress',
    initialState,
    reducers: {
        setProgress: (state, action: PayloadAction<{path: string, method: Method, status: Status, result?: object}>) => {
            const id: string = makeId(action.payload.method, action.payload.path)
            state.actions[id] = {status: action.payload.status, result: action.payload.result}
        },
        clearProgress: (state, action: PayloadAction<{path: string, method: Method}>) => {
            const id: string = makeId(action.payload.method, action.payload.path)
            delete state.actions[id]
        },
    },
});

export const {setProgress, clearProgress} = progressSlice.actions;

export const selectStatus = (state: RootState, path: string, method: Method): Status | undefined => {
    const id: string = makeId(method, path)

    return state.progress.actions[id]?.status
}

export const selectResult = (state: RootState, path: string, method: Method): object | undefined => {
    const id: string = makeId(method, path)

    return state.progress.actions[id]?.result
}

export default progressSlice.reducer;