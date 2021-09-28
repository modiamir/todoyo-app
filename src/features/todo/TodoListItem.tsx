import {FunctionComponent, useMemo, useState} from "react";
import {Todo} from "../../api";
import {Checkbox, CircularProgress, FormControl, ListItem, ListItemIcon, ListItemText, TextField} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {setDoneAsync, setSubjectAsync} from "./todoSlice";
import {selectStatus} from "../progress/progressSlice";
import {styled} from "@mui/material/styles";

const SubjectForm = styled('form')({
    width: '100%',
    display: 'grid',
})

export const TodoListItem: FunctionComponent<{ todo: Todo }> = ({todo}) => {
    const [checked, setChecked] = useState<boolean>(todo.done)
    const [descriptionExpanded, setDescriptionExpanded] = useState<boolean>(false)
    const canExpandTodo: boolean = useMemo(() => !!todo.description, [todo])
    const dispatch = useAppDispatch()
    const updatingTodo = useAppSelector((state) => selectStatus(state, '/todos/' + todo.id, 'PATCH'))

    const [newSubject, setNewSubject] = useState<string|null>(null)

    return <>
        <ListItem
            disablePadding
        >
            <ListItemButton role={undefined} dense>
                <ListItemIcon>
                    {updatingTodo === 'PENDING' ? <CircularProgress sx={{width: 4}}/> :
                        <Checkbox
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(setDoneAsync(todo, event.target.checked))
                                setChecked(!checked)
                                event.preventDefault()
                            }}
                            edge="start"
                            checked={checked}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{'aria-labelledby': todo.id?.toString()}}
                        />}
                </ListItemIcon>
                {newSubject === null && <ListItemText onClick={(event) => setNewSubject(todo.subject)} id={todo.id?.toString()} primary={todo.subject}/>}
                {newSubject !== null && <SubjectForm onSubmit={async (event) => {
                    event.preventDefault()
                    console.log(newSubject);
                    await dispatch(setSubjectAsync(todo, newSubject))
                    setNewSubject(null)

                }}>
                    <TextField
                        value={newSubject} id="standard-basic" variant="standard" disabled={updatingTodo === 'PENDING'}
                        onChange={(event) => setNewSubject(event.target.value)}
                        onBlur={() => setNewSubject(null)}
                    />
                </SubjectForm>}
                {canExpandTodo && descriptionExpanded &&
                <ExpandLess onClick={() => setDescriptionExpanded(!descriptionExpanded)}/>}
                {canExpandTodo && !descriptionExpanded &&
                <ExpandMore onClick={() => setDescriptionExpanded(!descriptionExpanded)}/>}
            </ListItemButton>
        </ListItem>
        {canExpandTodo &&
        <Collapse in={descriptionExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                <ListItemButton sx={{pl: 4}}>
                    {todo.description}
                </ListItemButton>
            </List>
        </Collapse>}
    </>
}