import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Link } from "react-router-dom"
import { Link as PrettyLink } from '@material-ui/core'


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function ForgotPassword() {

  const [ error, setError ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const [ message, setMessage ] = useState("")
  const { resetPassword } = useAuth()

  async function handleSubmit(e) {
    e.preventDefault()
    const { email } = e.currentTarget.elements

    try {
      setError("")
      setMessage("")
      setLoading(true)
      await resetPassword(email.value)
      setMessage("Check your email for further instructions")
      email.value = ""
    } catch(e) {
      setError("Failed to send reset password")
    }
    setLoading(false)

  }

  const classes = useStyles()

  return (
    <Container component="main" maxWidth="xs">
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Reset Password
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading}
          >
            Reset Password
          </Button>
          <Grid container>
            <Grid item xs>
              <PrettyLink component={Link} to="/login">
                Back to login
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
  )
}