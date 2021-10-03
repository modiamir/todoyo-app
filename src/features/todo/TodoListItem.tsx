import {FunctionComponent, useMemo, useRef, useState} from "react";
import {Todo} from "../../api";
import {Checkbox, CircularProgress, FormControl, ListItem, ListItemIcon, ListItemText, TextField} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectTodo, setDoneAsync, setPositionAsync, setSubjectAsync} from "./todoSlice";
import {selectStatus} from "../progress/progressSlice";
import {styled} from "@mui/material/styles";
import {DropTargetMonitor, useDrag, useDrop, XYCoord} from "react-dnd";
import {ItemTypes} from "./ItemTypes";
import DragHandleIcon from '@mui/icons-material/DragHandle';

const style = {
    // border: '1px dashed gray',
    // padding: '0.5rem 1rem',
    // marginBottom: '.5rem',
    // backgroundColor: '#3e2723',
    // cursor: 'move',
    // paddingLeft: '.5rem',
}

const SubjectForm = styled('form')({
    width: '100%',
    display: 'grid',
})

interface TodoListItemProps {
    moveCard: (dragIndex: number, hoverIndex: number) => void
    index: number
    todoId: number
}

interface DragItem {
    index: number
    id: string
    type: string
}

export const TodoListItem: FunctionComponent<TodoListItemProps> = ({todoId, index, moveCard}) => {
    const todo = useAppSelector((state) => selectTodo(state, todoId))
    const [checked, setChecked] = useState<boolean>(todo.done)
    const [descriptionExpanded, setDescriptionExpanded] = useState<boolean>(false)
    const canExpandTodo: boolean = useMemo(() => !!todo.description, [todo])
    const dispatch = useAppDispatch()
    const updatingTodo = useAppSelector((state) => selectStatus(state, '/todos/' + todo.id, 'PATCH'))
    const [newSubject, setNewSubject] = useState<string|null>(null)

    const ref = useRef<HTMLDivElement>(null)
    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.TODO,
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })

    const [{ isDragging }, drag, dragPreview] = useDrag({
        type: ItemTypes.TODO,
        item: () => {
            return { id: todo.id, index }
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
        end(item, monitor) {
            if (item.id === undefined) {
                return
            }
            dispatch(setPositionAsync(item.id.toString(), item.index))
        },
    })
    const opacity = isDragging ? 0 : 1
    dragPreview(drop(ref))

    return <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
        <ListItem
            sx={{backgroundColor: 'white'}}
            disablePadding
        >
            <div ref={drag} style={{cursor: 'move',}} >
                <DragHandleIcon />
            </div>
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
    </div>
}