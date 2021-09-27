import Button from "@mui/material/Button";
import {useAppDispatch} from "../../app/hooks";
import {useEffect} from "react";
import {fetchTodosAsync} from "../todo/todoSlice";

export function Home() {
    return <div><Button variant="contained">Hello World</Button></div>
}
