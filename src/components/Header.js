import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Button from '@material-ui/core/Button';
import { useAuth } from '../contexts/AuthContext'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'

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
  const { logout } = useAuth()
  const user = JSON.parse(localStorage.getItem("userData"))

  const classes = useStyles()
  return (
    <React.Fragment >
      <ElevationScroll {...props}>
        <div>
          <AppBar className={classes.root}>
            <Toolbar>
              <Typography className={classes.title} variant="h6">Hi, {user.first}!</Typography>
              <Button component={Link} to="/" color="inherit">Home</Button>
              <Button color="inherit" component={Link} to="update-profile">Update Profile</Button>
              <Typography className={classes.spacer}></Typography>
              <Button color="inherit" onClick={logout}>Log Out</Button>
            </Toolbar>
          </AppBar>
        </div>
      </ElevationScroll>
      <Toolbar />
    </React.Fragment>
  );
}