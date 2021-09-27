import {FunctionComponent} from "react";
import MuiLink from "@mui/material/Link";
import MuiMenuItem from "@mui/material/MenuItem";
import {Link as RouterLink} from 'react-router-dom';

interface LinkProps {
    to: string
}

interface MenuItemProps {
    to?: string
}

export const Link: FunctionComponent<LinkProps> = ({to, children, ...otherProps}) => {
    return <MuiLink component={RouterLink} to={to} {...otherProps} >
        {children}
    </MuiLink>
}

export const MenuItem: FunctionComponent<MenuItemProps> = ({to, children, ...otherProps}) => {
    return <MuiMenuItem component={RouterLink} to={to || '#'} {...otherProps} >
        {children}
    </MuiMenuItem>
}
