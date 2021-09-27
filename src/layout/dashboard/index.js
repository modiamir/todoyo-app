import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {Container, Grid, MenuList, Paper, Stack} from "@mui/material";
import {MenuItem} from "../../components/common/Link";

const RootStyle = styled('div')(({theme}) => ({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
  marginTop: theme.spacing(5),
  paddingBottom: theme.spacing(5),
}));

const MenuPaper = styled(Paper)(({theme}) => ({
  width: '100%',
}))

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  return (
    <RootStyle>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Stack direction="row" spacing={2}>
            <MenuPaper>
              <MenuList dense>
                <MenuItem to="/">Home</MenuItem>
                <MenuItem to="/todo">Todo</MenuItem>
                <MenuItem>Logout</MenuItem>
              </MenuList>
            </MenuPaper>
          </Stack>
        </Grid>
        <Grid item xs={12} md={9}>
          <Outlet />
        </Grid>
      </Grid>
      </Container>
    </RootStyle>
  );
}
