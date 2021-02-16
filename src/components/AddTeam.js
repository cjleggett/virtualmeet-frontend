import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
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

export default function AddTeam(setUserData) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const name = e.currentTarget.elements.name.value;
    const abbreviation = e.currentTarget.elements.abbreviation.value;

    try {
      setError("");
      setLoading(true);

      // Add team to database
      fetch(`${SERVER_URL}/teams/newTeam`, {
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({ name, abbreviation }),
      })
        .then((res) => res.json())
        .then((data) => {
          window.location.reload(false);
        });
    } catch {
      setError("Could not create team.");
    }
    setLoading(false);
  }

  const classes = useStyles();
  return (
    <form onSubmit={handleSubmit} className={classes.form} noValidate>
      {error && <p>{error}</p>}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="name"
            label="Team Name"
            name="name"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="short"
            label="Abbreviation (<5 Characters)"
            name="abbreviation"
          />
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={loading}
        >
          Add Team
        </Button>
      </Grid>
    </form>
  );
}
