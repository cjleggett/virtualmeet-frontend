import React, { useState } from "react";
import useTeams from "../hooks/TeamsHook";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import { SERVER_URL } from "../helpers/constants";

const useStyles = makeStyles((theme) => ({
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

export default function JoinTeam(setUserData) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const teams = useTeams();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      let { team } = e.currentTarget.elements;
      team = team.value;
      // Add new team request to the database
      fetch(`${SERVER_URL}/teams/join`, {
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          teamId: team,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          let userData = JSON.parse(localStorage.getItem("userData"));
          userData.requests = data.requests;
          localStorage.setItem("userData", JSON.stringify(userData));
          setUserData.setUserData.setUserData(userData);
        });
    } catch (e) {
      setError("Failed to create a request");
      setLoading(false);
      return;
    }
  }

  const classes = useStyles();

  return (
    <form onSubmit={handleSubmit} className={classes.form} noValidate>
      {error && <p>{error}</p>}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <InputLabel id="team">Team</InputLabel>
          <Select labelId="team" id="team" name="team">
            <MenuItem disabled="true" value="">
              <em>Select Your Team</em>
            </MenuItem>
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        disabled={loading}
      >
        Send Join Request
      </Button>
    </form>
  );
}
