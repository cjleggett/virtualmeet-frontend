import React, { useState } from "react";
import useTeam from "../hooks/TeamHook";
import GetStarted from "./GetStarted";
import Meets from "./Meets";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { makeStyles } from "@material-ui/core/styles";
import { useAuth } from '../contexts/AuthContext'
import { Typography, Toolbar, Button, Link } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function Dashboard() {
  const { sessionId } = useAuth()
  console.log(sessionId)
  const team = useTeam();
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );
  const classes = useStyles();
  const baseURL = window.location.origin.toString();

  function copy() {
    var tempInput = document.createElement("input");
    tempInput.value = `${baseURL}/signup?team=${team.team}`;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  }

  return (
    <div>
      {team.loaded && (
        <div>
          <div>
            {!team.team &&
              userData &&
              userData.requests &&
              !userData.requests.length && (
                <GetStarted setUserData={setUserData} />
              )}
          </div>
          {team.captain && (
            <div style={{ margin: 10 }}>
              <Typography variant="h4">Invite your team!</Typography>
              <Typography>
                Send the following link to your team so members can create
                accounts and log in{" "}
              </Typography>
              <Toolbar>
                <Link>{`${baseURL}/signup?team=${team.team}`}</Link>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  startIcon={<FileCopyIcon></FileCopyIcon>}
                  onClick={copy}
                >
                  Copy Link
                </Button>
              </Toolbar>
            </div>
          )}
          <div>
            <Meets />
          </div>
        </div>
      )}
    </div>
  );
}
