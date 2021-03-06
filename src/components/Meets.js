import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import CardActionArea from "@material-ui/core/CardActionArea";
import useTeam from "../hooks/TeamHook";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { SERVER_URL } from "../helpers/constants";

const useStyles = makeStyles((theme) => ({
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    margin: 20,
  },
  cardContent: {
    flexGrow: 1,
  },
  explanation: {
    textAlign: "center",
    paddingBottom: 10,
  },
  name: {
    flexGrow: 1,
  },
  button: {
    margin: 5,
  },
  delete_button: {
    backgroundColor: "red",
    color: "white",
    margin: 5,
  },
  title: {
    margin: 10,
  },
}));

export default function Meets() {
  const [meets, setMeets] = useState();
  const team = useTeam();
  const history = useHistory();
  const { getSession } = useAuth();

  useEffect(() => {
    if (meets !== undefined) {
      return;
    }
    fetch(`${SERVER_URL}/meets`, {
      credentials: "include",
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        sessionid: getSession(),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMeets(data);
      });
  });

  function deleteMeet(meetId) {
    if (window.confirm('Are you sure you want to delete this meet? This action cannot be undone!')) {
      fetch(`${SERVER_URL}/meets/deleteMeet`, {
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          sessionid: getSession(),
        },
        body: JSON.stringify({
          meetId
        }),
      }).then(() => {
        let newMeets = [...meets]
        newMeets = newMeets.filter(meet => meet.id !== meetId)
        setMeets(newMeets)
      })
    }
  }

  const classes = useStyles();

  return (
    <div>
      <Typography variant="h4" className={classes.title}>
        Meets:
      </Typography>
      {meets && !meets.length && (
        <Typography className={classes.title}>No current meets!</Typography>
      )}
      <ul>
        {meets &&
          meets.length &&
          meets.map((meet) => (
            <Card className={classes.card} key={meet.id}>
              <CardActionArea onClick={() => history.push(`meet/${meet.id}`)}>
                <CardContent className={classes.cardContent}>
                  <Toolbar>
                    <Typography
                      gutterBottom
                      variant="h5"
                      className={classes.name}
                    >
                      {meet.name}
                    </Typography>
                    {team.captain && meet.host._path.segments[1] === team.team && (
                      <div>
                      <Button
                        component="span"
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          history.push(`edit-meet/${meet.id}`);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        component="span"
                        className={classes.button}
                        variant="contained"
                        color="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMeet(meet.id);
                        }}
                      >
                        Delete
                      </Button>
                      </div>
                    )}
                  </Toolbar>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
      </ul>
    </div>
  );
}
