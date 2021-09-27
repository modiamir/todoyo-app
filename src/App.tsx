import React, {FunctionComponent} from 'react';
import {
    BrowserRouter,
    useRoutes
} from "react-router-dom";

import {Counter} from './features/counter/Counter';
import {Home} from './features/home/Home';
import './App.css';
import DashboardLayout from "./layout/dashboard";
import {TodoList} from "./features/todo/TodoList";

const Router: FunctionComponent = () => {
    return useRoutes([
        {
            path: '/',
            element: <DashboardLayout/>,
            children: [
                {
                    path: '/',
                    element: <Home/>,
                },
                {
                    path: '/todo',
                    element: <TodoList/>,
                }
            ],
        },
    ])
}

function App() {
    return (
        <BrowserRouter>
            <Router/>
        </BrowserRouter>
    );
}

export default App;
