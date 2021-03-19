import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useHistory, Link, useLocation } from "react-router-dom";
import { Link as PrettyLink } from "@material-ui/core";
import { genders } from "../helpers/enum";
import { SERVER_URL } from "../helpers/constants";
import Box from "@material-ui/core/Box";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  red: {
    color: "red",
  },
}));

export default function Signup() {
  const teamId = useQuery().get("team");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, updateUserData, updateSession } = useAuth();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    let {
      password,
      passwordConfirm,
      first,
      last,
      birthday,
      email,
      gender,
    } = e.currentTarget.elements;
    gender = gender.value;
    first = first.value;
    last = last.value;
    birthday = birthday.value;

    if (password.value !== passwordConfirm.value) {
      return setError("Passwords do not match");
    }

    if (!first) {
      setError("Please enter your first name.")
      return
    }

    if (!last) {
      setError("Please enter your last name.")
      return
    }

    if (!birthday) {
      setError("Please enter your birthday.")
      return
    }

    try {
      // Create new auth user
      setError("");
      setLoading(true);
      const res = await signup(email.value, password.value);

      // get id token for new user
      res.user.getIdToken(true).then(function (idToken) {
        // Add new user info to database
        fetch(`${SERVER_URL}/auth/signup`, {
          credentials: "include",
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
          body: JSON.stringify({
            idToken,
            gender,
            first,
            last,
            birthday,
            teamId,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            updateSession(data.sessionId);
            delete data.sessionId;
            updateUserData(data);
            history.push("/");
          });
      });
    } catch (e) {
      setError(e.message ? e.message : "An unknown error occured.");
      setLoading(false);
      return;
    }
  }

  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      {error && <p>{error}</p>}
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="first"
                variant="outlined"
                required
                id="firstName"
                label="First Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                id="lastName"
                label="Last Name"
                name="last"
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="date"
                label="Birthday"
                name="birthday"
                type="date"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="gender">Gender</InputLabel>
              <Select
                labelId="gender"
                id="gender"
                name="gender"
                defaultValue="Prefer not to say"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {genders.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="passwordConfirm"
                label="Confirm Password"
                type="password"
                id="confirm-password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <Box fontStyle="italic" fontWeight="fontWeightLight">
                  *Privacy Note: Your name and age will be visible to
                  other users on the site. Your email, password, gender, and exact
                  birthday will not be shared with anyone.
                </Box>
              </Typography>
            </Grid>
            {error &&
            <Grid item xs={12}>
              <Typography className={classes.red}>
                <Box fontWeight="fontWeightLight">
                  *Error: {error}
                </Box>
              </Typography>
            </Grid>}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <PrettyLink component={Link} to="/login">
                Already have an account? Sign in
              </PrettyLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
