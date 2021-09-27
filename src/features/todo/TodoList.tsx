import {FunctionComponent, useEffect, useState} from "react";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import {Paper} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {fetchTodosAsync, selectTodos} from "./todoSlice";
import {Todo} from "../../api";
import {TodoListItem} from "./TodoListItem";

export const TodoList: FunctionComponent = () => {
    const [open, setOpen] = useState(true);

    const dispatch = useAppDispatch()

    useEffect(() => dispatch(fetchTodosAsync()), [])
    const todos: Todo[] = useAppSelector(selectTodos)

    const handleClick = () => {
        setOpen(!open);
    };
    return <Paper sx={{paddingLeft: '10px', paddingRight: '10px'}}>
        <List
            sx={{ width: '100%', bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Todos
                </ListSubheader>
            }
        >
            {todos.map((todo) => <TodoListItem key={todo.id} todo={todo}/>)}
        </List>
    </Paper>
}