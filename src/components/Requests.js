import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"
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
  title: {
    margin: 10,
  },
}));

export default function Requests() {
  const [requests, setRequests] = useState();
  const classes = useStyles();
  const { getSession } = useAuth()

  useEffect(() => {
    if (requests) {
      return;
    }
    fetch(`${SERVER_URL}/teams/requests`, {
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
        setRequests(data);
      });
  });

  function submit(reqId, approve) {
    // Remove request locally:
    const reqs = requests;
    const newReqs = reqs.filter((req) => req.id !== reqId);
    setRequests(newReqs);

    // Update status of request on backend
    fetch(`${SERVER_URL}/teams/respond`, {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        sessionid: getSession(),
      },
      body: JSON.stringify({
        reqId,
        approve,
      }),
    }).then((res) => {});
  }

  return (
    <div>
      <Typography variant="h4" className={classes.title}>
        Your Unhandled Requests:
      </Typography>
      {requests && !requests.length && <p>No new requests!</p>}
      <ul>
        {requests &&
          requests.map((request) => (
            <Card className={classes.card} key={request.id}>
              <CardContent className={classes.cardContent}>
                <Toolbar>
                  <Typography
                    gutterBottom
                    variant="h5"
                    className={classes.name}
                  >
                    {request.user.first} {request.user.last}
                  </Typography>
                  <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={() => submit(request.id, true)}
                  >
                    Approve
                  </Button>
                  <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={() => submit(request.id, false)}
                  >
                    Deny
                  </Button>
                </Toolbar>
              </CardContent>
            </Card>
          ))}
      </ul>
    </div>
  );
}
