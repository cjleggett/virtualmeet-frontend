import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import AddBoxIcon from "@material-ui/icons/AddBox";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import { units, reverseUnits } from "../helpers/enum";
import { SERVER_URL } from "../helpers/constants";
import { useAuth } from "../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
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
  table: {
    minWidth: 650,
  },
  container: {
    maxWidth: "95%",
    margin: "auto",
  },
  select: {
    minWidth: 100,
  },
  spacer: {
    flexGrow: 1,
  },
}));

export default function EditMeet() {
  // retrieve meet id
  const meetId = useParams().id;
  const { getSession } = useAuth();

  const [meetData, setMeetData] = useState();
  const [name, setName] = useState("");
  const [distance, setDistance] = useState(0);
  const [events, setEvents] = useState();

  const classes = useStyles();

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
        sessionid: getSession(),
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
        sessionid: getSession(),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      });
  });

  async function handleSubmit(e) {
    e.preventDefault();
    let { gender, units } = e.currentTarget.elements;
    try {
      // Add new team request to the database
      fetch(`${SERVER_URL}/events/newEvent`, {
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          sessionid: getSession(),
        },
        body: JSON.stringify({
          name,
          distance,
          gender: gender.value,
          units: units.value,
          meetId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Add new row to table
          let newEvents = [...events];
          newEvents.push({
            name,
            distance,
            units: units.value,
            gender: gender.value,
            id: data.id,
          });
          setEvents(newEvents);
          setName("");
          setDistance(0);
        });
    } catch (e) {
      return;
    }
  }

  return (
    <div>
      {meetData && (
        <div>
          <Typography className={classes.title} variant="h4">
            {meetData.name}
          </Typography>
          <Typography className={classes.title} variant="h6">
            Start: {meetData.startDate}
          </Typography>
          <Typography className={classes.title} variant="h6">
            End: {meetData.endDate}
          </Typography>
          <Typography className={classes.title} variant="h6">
            Teams:
          </Typography>
          <Typography className={classes.title} variant="h4">
            Events:
          </Typography>
          {events && (
            <div>
              <TableContainer className={classes.container} component={Paper}>
                <form onSubmit={(e) => handleSubmit(e)}>
                  <Table className={classes.table} aria-label="simple table">
                    <caption>
                      Note: Athletes who identify as neither men nor women will
                      be allowed to enter whichever event they feel most
                      comfortable in.
                    </caption>
                    <TableHead>
                      <TableRow>
                        <TableCell>Event Name</TableCell>
                        <TableCell>Distance</TableCell>
                        <TableCell>Gender(s)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow hover key={event.id}>
                          <TableCell>{event.name}</TableCell>
                          <TableCell>
                            {event.distance} {reverseUnits[event.units]}
                          </TableCell>
                          <TableCell>{event.gender}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell>
                          <TextField
                            value={name}
                            variant="outlined"
                            id="name"
                            label="Event Name"
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                          />
                        </TableCell>
                        <TableCell>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                value={distance}
                                name="distance"
                                variant="outlined"
                                id="distance"
                                label="Distance"
                                type="number"
                                onChange={(e) => setDistance(e.target.value)}
                              />
                            </Grid>
                            <Select
                              defaultValue={units.Meters}
                              id="units"
                              name="units"
                            >
                              {Object.entries(units).map((entry) => (
                                <MenuItem key={entry[1]} value={entry[1]}>
                                  {entry[0]}
                                </MenuItem>
                              ))}
                            </Select>
                          </Grid>
                        </TableCell>
                        <TableCell>
                          <Toolbar>
                            <FormControl>
                              <InputLabel id="gender">Genders</InputLabel>
                              <Select
                                className={classes.select}
                                id="genders"
                                name="gender"
                                labelId="genders"
                                defaultValue="All"
                              >
                                <MenuItem value="Men">Men</MenuItem>
                                <MenuItem value="Women">Women</MenuItem>
                                <MenuItem value="All">All</MenuItem>
                              </Select>
                            </FormControl>
                            <Typography className={classes.spacer}></Typography>
                            <IconButton type="submit">
                              <AddBoxIcon
                                style={{ fontSize: 50 }}
                                color="primary"
                              />
                            </IconButton>
                          </Toolbar>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </form>
              </TableContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
