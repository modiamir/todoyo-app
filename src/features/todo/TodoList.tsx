import {FunctionComponent, useCallback, useEffect, useState} from "react";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {CircularProgress, Paper} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {fetchTodosAsync, reorder, selectAllTodoIds, selectTodos, selectTodosMap} from "./todoSlice";
import {Todo} from "../../api";
import {TodoListItem} from "./TodoListItem";
import {selectStatus} from "../progress/progressSlice";

export const TodoList: FunctionComponent = () => {

    const dispatch = useAppDispatch()

    useEffect(() => dispatch(fetchTodosAsync()), [])
    const fetchingTodos = useAppSelector((state) => selectStatus(state, '/todos', 'GET'))
    const todos: { [id: number]: Todo } = useAppSelector(selectTodosMap)
    const todosIds: number[] = useAppSelector(selectAllTodoIds)

    const moveCard = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            dispatch(reorder(dragIndex, hoverIndex))
        },
        [dispatch]
    )

    const renderTodoListItem = (todoId: number, index: number) => {
        return (
            <TodoListItem
                key={todoId}
                index={index}
                todoId={todoId}
                moveCard={moveCard}
            />
        )
    }

    return <Paper sx={{paddingLeft: '10px', paddingRight: '10px'}}>
        <DndProvider backend={HTML5Backend}>
            <List
                sx={{width: '100%', bgcolor: 'background.paper'}}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Todos
                    </ListSubheader>
                }
            >
                {fetchingTodos === 'PENDING' ? <CircularProgress/> :
                    <>
                        {todosIds.map((todoId, index) => renderTodoListItem(todoId, index))}
                    </>}

            </List>

        </DndProvider>
    </Paper>
}