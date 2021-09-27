import {FunctionComponent, useMemo, useState} from "react";
import {Todo} from "../../api";
import {Checkbox, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import StarBorder from "@mui/icons-material/StarBorder";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {useAppDispatch} from "../../app/hooks";
import {markAsDone, markAsDoneAsync} from "./todoSlice";

export const TodoListItem: FunctionComponent<{ todo: Todo }> = ({todo}) => {
    const [checked, setChecked] = useState<boolean>(todo.done)
    const [descriptionExpanded, setDescriptionExpanded] = useState<boolean>(false)
    const canExpandTodo: boolean = useMemo(() => !!todo.description, [todo])
    const dispatch = useAppDispatch()

    return <>
        <ListItem
            disablePadding
        >
            <ListItemButton role={undefined} dense>
                <ListItemIcon>
                    <Checkbox
                        onClick={(event) => {
                            dispatch(markAsDoneAsync(todo))
                            setChecked(!checked)
                            event.preventDefault()
                        }}
                        edge="start"
                        checked={checked}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{'aria-labelledby': todo.id?.toString()}}
                    />
                </ListItemIcon>
                <ListItemText id={todo.id?.toString()} primary={todo.subject} />
                {canExpandTodo && descriptionExpanded && <ExpandLess onClick={() => setDescriptionExpanded(!descriptionExpanded)} />}
                {canExpandTodo && !descriptionExpanded && <ExpandMore onClick={() => setDescriptionExpanded(!descriptionExpanded)} />}
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