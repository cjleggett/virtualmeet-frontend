import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory, Link } from 'react-router-dom'
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


export default function UpdateProfile() {

  const [ error, setError ] = useState("")
  const [ loading, setLoading ] = useState(false)
  const { updateEmail, updatePassword, serverURL, currentUser, updateUserData } = useAuth()
  const userData = JSON.parse(localStorage.getItem("userData"))
  const history = useHistory()

  async function handleSubmit(e) {
    let {password, passwordConfirm, first, last, birthday, email, gender} = e.currentTarget.elements
    e.preventDefault()
    setError("")
    setLoading(true)
    if (password.value !== passwordConfirm.value) {
      return setError("Passwords do not match")
    }

    // Update database information:
    gender = gender.value
    first = first.value
    last = last.value
    birthday = birthday.value

    fetch(`${serverURL()}/users/editUser`, {
      credentials: 'include',
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      },
      body: JSON.stringify({
        gender,
        first,
        last,
        birthday
      })
    }).then(() => {
      updateUserData({gender, first, last, birthday})
      const promises = []
      if (email.value !== currentUser.email) {
        promises.push(updateEmail(email.value))
      }

      if (password.value) {
        promises.push(updatePassword(password.value))
      }
      Promise.all(promises).then(() => {
        history.push("/")
      })
      .catch(() => {})
      
    }).catch(() => {
      setError("Failed to update profile. Try logging out and trying again.")
    }).finally(() => {
      setLoading(false)
    })

  }

  const classes = useStyles()
  return (
    <Container component="main" maxWidth="xs">
      {error && <p>{error}</p>}
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Update Profile
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="first"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                defaultValue={userData.first}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="last"
                autoComplete="lname"
                defaultValue={userData.last}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="date"
                label="Birthday"
                name="birthday"
                type="date"
                defaultValue="2017-05-24"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel id="gender">Gender</InputLabel>
                <Select
                  defaultValue="Woman"
                  labelId="gender"
                  id="gender"
                  name="gender"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"Woman"}>Woman</MenuItem>
                  <MenuItem value={"Man"}>Man</MenuItem>
                  <MenuItem value={"Other"}>Other</MenuItem>
                  <MenuItem value={"Prefer not to say"}>Prefer not to say</MenuItem>
                </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                defaultValue={currentUser.email}
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="password"
                label="Password (Leave blank to keep the same)"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="passwordConfirm"
                label="Confirm Password (Leave blank to keep the same)"
                type="password"
                id="confirm-password"
                autoComplete="current-password"
              />
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
            Update
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <PrettyLink component={Link} to="/">Cancel</PrettyLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}