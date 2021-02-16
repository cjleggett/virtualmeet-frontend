import { SERVER_URL } from "../helpers/constants";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useParams } from "react-router-dom";
import { HashLink as Link } from "react-router-hash-link";
import { Link as PrettyLink } from "@material-ui/core";
import EventCard from "./EventCard";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

const useStyles = makeStyles((theme) => ({
  title: {
    margin: 10,
    textAlign: "center",
  },
  padded: {
    margin: 10,
  },
}));

export default function Meet() {
  const meetId = useParams().id;
  const [meetData, setMeetData] = useState();
  const [events, setEvents] = useState();

  useEffect(() => {
    if (meetData) {
      return;
    }
    fetch(`${SERVER_URL}/meets/meets/${meetId}`, {
      credentials: "include",
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMeetData(data);
      });
  });

  useEffect(() => {
    if (events) {
      return;
    }
    fetch(`${SERVER_URL}/events/${meetId}`, {
      credentials: "include",
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      });
  });

  const classes = useStyles();

  function getTeams() {
    const newTeams = [];
    for (const key in meetData.invitedTeams) {
      newTeams.push({
        id: key,
        name: meetData.invitedTeams[key].name,
        abbreviation: meetData.invitedTeams[key].abbreviation,
      });
    }
    return newTeams;
  }

  return (
    <div>
      {meetData && (
        <div>
          <Typography className={classes.title} variant="h4">
            {meetData.name}
          </Typography>
          <Typography className={classes.padded} variant="h6">
            Start: {meetData.startDate}
          </Typography>
          <Typography className={classes.padded} variant="h6">
            End: {meetData.endDate}
          </Typography>
          <Typography className={classes.padded} variant="h6">
            Teams:
          </Typography>
          <List>
            {getTeams().map((team) => (
              <ListItem key={team.id}>
                {team.name} ({team.abbreviation})
              </ListItem>
            ))}
          </List>
          <Typography className={classes.padded} variant="h6">
            Events:
          </Typography>
          {events && (
            <div>
              <List>
                {events.map((event) => (
                  <ListItem key={event.id}>
                    <PrettyLink
                      component={Link}
                      to={`/meet/${meetId}#${event.id}`}
                    >
                      {event.name}
                    </PrettyLink>
                  </ListItem>
                ))}
              </List>
              {events.map((event) => (
                <div id={event.id}>
                  <div style={{ height: 25 }}></div>
                  <EventCard
                    event={event}
                    invitedTeams={meetData.invitedTeams}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
