import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Button from "@material-ui/core/Button";
import { useAuth } from "../contexts/AuthContext";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, Link } from "react-router-dom";
import useTeam from "../hooks/TeamHook";
import { SERVER_URL } from "../helpers/constants";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  spacer: {
    flexGrow: 1,
  },
  title: {
    marginRight: 20,
  },
  link: {
    color: theme.color,
  },
}));

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
  const team = useTeam();
  const { logout, updateUserData, getSession } = useAuth();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );
  if (!user) {
    fetch(`${SERVER_URL}/users/current`, {
      credentials: "include",
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        sessionid: getSession(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.msg === "no current user") {
          handleLogout();
        } else {
          updateUserData(data);
          setUser(data);
        }
      })
      .catch();
  }
  const history = useHistory();

  async function handleLogout() {
    // Log out on frontend
    await logout();

    // Terminate session on backend
    fetch(`${SERVER_URL}/auth/logout`, {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        sessionid: getSession(),
      },
      body: JSON.stringify({}),
    });

    history.replace("login");
  }

  const classes = useStyles();
  return (
    <React.Fragment>
      {user && (
        <ElevationScroll {...props}>
          <div>
            <AppBar className={classes.root}>
              <Toolbar>
                <Typography className={classes.title} variant="h6">
                  Hi, {user.first}!
                </Typography>
                <Button component={Link} to="/" color="inherit">
                  Home
                </Button>
                {team && team.captain && (
                  <div>
                    <Button color="inherit" component={Link} to="/requests">
                      Manage Requests
                    </Button>
                    <Button color="inherit" component={Link} to="/make-meet">
                      New Meet
                    </Button>
                  </div>
                )}
                <Button color="inherit" component={Link} to="/update-profile">
                  Update Profile
                </Button>
                <Typography className={classes.spacer}></Typography>
                <Button color="inherit" onClick={handleLogout}>
                  Log Out
                </Button>
              </Toolbar>
            </AppBar>
          </div>
        </ElevationScroll>
      )}
      <Toolbar />
    </React.Fragment>
  );
}
