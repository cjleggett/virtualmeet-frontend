import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Button from '@material-ui/core/Button';
import { useAuth } from '../contexts/AuthContext'
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, Link } from 'react-router-dom'
import useTeam from '../hooks/TeamHook'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  spacer: {
    flexGrow: 1,
  },
  title: {
    marginRight: 20,
  },
  link: {
    color: theme.color
  }
}))

function ElevationScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window ? window() : undefined,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export default function Header(props) {
  const team = useTeam()
  console.log(team)
  const { logout, serverURL } = useAuth()
  const user = JSON.parse(localStorage.getItem("userData"))
  const history = useHistory()

  async function handleLogout() {

    // Log out on frontend
    await logout()

    // Terminate session on backend
    fetch(`${serverURL()}/auth/logout`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      },
      body: JSON.stringify({})
    })

    history.push('login')
  }

  const classes = useStyles()
  return (
    <React.Fragment >
      <ElevationScroll {...props}>
        <div>
          <AppBar className={classes.root}>
            <Toolbar>
              <Typography className={classes.title} variant="h6">Hi, {user.first}!</Typography>
              <Button component={Link} to="/" color="inherit">Home</Button>
              {team && team.captain && <div>
                <Button color="inherit" component={Link} to="requests">Manage Requests</Button>
                <Button color="inherit" component={Link} to="make-race">New Race</Button>
              </div>}
              <Button color="inherit" component={Link} to="update-profile">Update Profile</Button>
              <Typography className={classes.spacer}></Typography>
              <Button color="inherit" onClick={handleLogout}>Log Out</Button>
            </Toolbar>
          </AppBar>
        </div>
      </ElevationScroll>
      <Toolbar />
    </React.Fragment>
  );
}