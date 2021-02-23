import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { SERVER_URL } from "../helpers/constants";
import { formatDate } from "../helpers/dates";
import { useAuth } from "../contexts/AuthContext";

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
  title: {
    textAlign: "center",
  },
}));

export default function AddEntry({ event, handleClose }) {
  const { getSession } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const { hours, minutes, seconds, date } = e.currentTarget.elements;

    try {
      setError("");
      setLoading(true);

      // Add new team request to the database
      fetch(`${SERVER_URL}/entries/new`, {
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          sessionid: getSession(),
        },
        body: JSON.stringify({
          hours: hours.value,
          minutes: minutes.value,
          seconds: seconds.value,
          event: event.id,
          date: date.value,
        }),
      }).then(() => {
        handleClose();
      });
    } catch (e) {
      setError("Failed to create a race");
      setLoading(false);
      return;
    }
  }

  const classes = useStyles();

  return (
    <div>
      <Typography className={classes.title} component="h1" variant="h5">
        {event.name}
      </Typography>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className={classes.form}
        noValidate
      >
        {error && <p>{error}</p>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="hours"
              label="Hours"
              name="hours"
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="minutes"
              label="Minutes"
              name="minutes"
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="seconds"
              label="Seconds"
              name="seconds"
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="date"
              label="Date"
              name="date"
              type="date"
              defaultValue={formatDate(new Date())}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
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
            Submit Time
          </Button>
        </Grid>
      </form>
    </div>
  );
}
