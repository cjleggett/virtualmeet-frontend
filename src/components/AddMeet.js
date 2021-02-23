import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import useTeams from "../hooks/TeamsHook";
import useTeam from "../hooks/TeamHook";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import Chip from "@material-ui/core/Chip";
import { SERVER_URL } from "../helpers/constants";
import { formatDate } from "../helpers/dates";
import { useAuth } from "../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function AddMeet() {
  const { getSession } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const teams = useTeams();
  const currentTeam = useTeam();

  const classes = useStyles();
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    setPersonName(event.target.value);
  };

  async function handleSubmit(e) {
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
      fetch(`${SERVER_URL}/meets/newMeet`, {
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
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          history.push(`/edit-meet/${data.id}`);
        });
    } catch (e) {
      setError("Failed to create a meet");
      setLoading(false);
      return;
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      {error && <p>{error}</p>}
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Create Meet
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
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
                defaultValue={formatDate(new Date())}
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
                defaultValue={formatDate(new Date())}
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
            Create Meet
          </Button>
        </form>
      </div>
    </Container>
  );
}
