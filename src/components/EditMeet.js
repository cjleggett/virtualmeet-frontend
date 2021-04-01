import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import AddBoxIcon from "@material-ui/icons/AddBox";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { units, reverseUnits } from "../helpers/enum";
import { SERVER_URL } from "../helpers/constants";
import Container from "@material-ui/core/Container";
import { useAuth } from "../contexts/AuthContext";
import useTeam from "../hooks/TeamHook";
import useTeams from "../hooks/TeamsHook";
import CssBaseline from "@material-ui/core/CssBaseline";



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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function EditMeet() {
  // retrieve meet id
  const meetId = useParams().id;
  const { getSession } = useAuth();
  const theme = useTheme();

  const [meetData, setMeetData] = useState();
  const [name, setName] = useState("");
  const [distance, setDistance] = useState(0);
  const [events, setEvents] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("")
  const [personName, setPersonName] = React.useState([]);
  const currentTeam = useTeam();
  const teams = useTeams();

  const handleChange = (event) => {
    setPersonName(event.target.value);
  };

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
        setMeetData(data)
        let invitedTeams = Object.keys(data.invitedTeams)
        let teamNames = invitedTeams.map(team => data.invitedTeams[team].name)
        teamNames = teamNames.filter(name => name !== data.host.name)
        setPersonName(teamNames)
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

  async function editMeet(e) {
    e.preventDefault();
    let { invitedTeams, name, start, end } = e.currentTarget.elements;
    name = name.value;
    start = start.value;
    end = end.value;

    // Find which teams are invited through this string:
    let invitedIds = [];
    for (const team of teams) {
      if (invitedTeams.value.search(team.name) !== -1) {
        invitedIds.push(team.id);
      }
    }

    try {
      setError("");
      setLoading(true);

      // Add new team request to the database
      fetch(`${SERVER_URL}/meets/editMeet`, {
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          sessionid: getSession(),
        },
        body: JSON.stringify({
          startDate: start,
          endDate: end,
          invitedTeams: invitedIds,
          name,
          meetId
        }),
      })
        .then((res) => res.json())
        .then(() => {
          window.location.reload(false);
        });
    } catch (e) {
      setError("Failed to edit meet");
      setLoading(false);
      return;
    }
  }

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
        <Container component="main" maxWidth="xs">
          {error && <p>{error}</p>}
          <CssBaseline />
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              Edit Meet
            </Typography>
            <form onSubmit={editMeet} className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="name"
                    name="name"
                    variant="outlined"
                    defaultValue={meetData.name}
                    required
                    fullWidth
                    id="name"
                    label="Meet Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="start"
                    label="Start Date"
                    name="start"
                    type="date"
                    defaultValue={meetData.startDate}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="end"
                    label="End Date"
                    name="end"
                    type="date"
                    defaultValue={meetData.endDate}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel id="demo-mutiple-chip-label">Invite Teams</InputLabel>
                  <Select
                    labelId="demo-mutiple-chip-label"
                    id="demo-mutiple-chip"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    name="invitedTeams"
                    input={<Input id="select-multiple-chip" />}
                    renderValue={(selected) => (
                      <div className={classes.chips}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={value}
                            className={classes.chip}
                          />
                        ))}
                      </div>
                    )}
                    MenuProps={MenuProps}
                  >
                    {teams
                      .filter((team) => team.id !== currentTeam.team)
                      .map((team) => (
                        <MenuItem
                          key={team.id}
                          value={team.name}
                          style={getStyles(team.name, personName, theme)}
                        >
                          {team.name}
                        </MenuItem>
                      ))}
                  </Select>
                </Grid>
              </Grid>
              <FormControl className={classes.formControl}></FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={loading}
              >
                Update
              </Button>
            </form>
          </div>
        </Container>
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
                      <TableCell>Event Name (Remember to include Gender!)</TableCell>
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
