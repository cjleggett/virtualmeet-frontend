import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
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

export default function Login() {

  const [ error, setError ] = useState('')
  const [ loading, setLoading ] = useState(false)
  const { serverURL } = useAuth()
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()
    const name = e.currentTarget.elements.name.value
    const abbreviation = e.currentTarget.elements.abbreviation.value
    console.log(name)

    try {
      setError('')
      setLoading(true)

      // Add team to database
      fetch(`${serverURL()}/teams/newTeam`, {
        credentials: 'include',
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        },
        body: JSON.stringify({name, abbreviation})
      }).then(res => res.json()).then(() => {
        history.push('/')
      })
    } catch {
      setError('Could not create team.')
    }
    setLoading(false)
  }

  const classes = useStyles()
  return (
    <Container component="main" maxWidth="xs">
      {error && <p>{error}</p>}
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Add Your Team
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} noValidate>
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
                name="short"
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
          <Grid container justify="flex-end">
            <Grid item>
              <PrettyLink component={Link} to="/">Cancel</PrettyLink>
            </Grid>
          </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}