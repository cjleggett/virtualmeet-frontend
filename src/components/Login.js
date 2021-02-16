import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useAuth } from "../contexts/AuthContext";
import { useHistory, Link } from "react-router-dom";
import { Link as PrettyLink } from "@material-ui/core";
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

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, updateUserData, updateSession } = useAuth();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const { email, password } = e.currentTarget.elements;

      // Log in user using firebase auth
      setError("");
      setLoading(true);
      const res = await login(email.value, password.value);

      // Once User is logged in, begin a session in the backend:
      res.user
        .getIdToken(true)
        .then(function (idToken) {
          fetch(`${SERVER_URL}/auth/login`, {
            credentials: "include",
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({ idToken }),
          })
            .then((res) => res.json())
            .then((data) => {
              updateSession(data.sessionId)
              delete data.sessionId
              updateUserData(data);
              history.push("/");
            })
            .catch();
        })
        .catch();
    } catch (e) {
      console.log(e);
      setError("Failed to log in");
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
          Sign in
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <PrettyLink component={Link} to="/forgot-password">
                Forgot password?
              </PrettyLink>
            </Grid>
            <Grid item>
              <PrettyLink component={Link} to="/signup">
                {"Don't have an account? Sign Up"}
              </PrettyLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
