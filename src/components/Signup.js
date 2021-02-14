import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'
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
import { genders } from '../helpers/enum'
import {SERVER_URL} from '../helpers/constants'
import {formatDate} from '../helpers/dates'


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

export default function Signup() {

  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const { signup, updateUserData } = useAuth()
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    let {password, passwordConfirm, first, last, birthday, email, gender} = e.currentTarget.elements
    gender = gender.value
    first = first.value
    last = last.value
    birthday = birthday.value
    

    if (password.value !== passwordConfirm.value) {
      return setError('Passwords do not match')
    }

    try {

      // Create new auth user
      setError('')
      setLoading(true)
      const res = await signup(email.value, password.value)

      // get id token for new user
      res.user.getIdToken(true).then(function(idToken) {
        
        // Add new user info to database
        fetch(`${SERVER_URL}/auth/signup`, {
          credentials: 'include',
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8"
          },
          body: JSON.stringify({
            idToken,
            gender,
            first,
            last,
            birthday,
          })
        }).then(response => response.json()).then( data => {
          console.log('signup success')
          updateUserData(data)
          history.push('/')
        })
      })


    } catch(e) {
      setError('Failed to create an account')
      setLoading(false)
      return
    }
  }

  const classes = useStyles()

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
                defaultValue={formatDate(new Date())}
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
                  {genders.map(gender => (
                    <MenuItem value={gender}>{gender}</MenuItem>
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
  )
}