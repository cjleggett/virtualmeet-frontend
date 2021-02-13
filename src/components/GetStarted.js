import React, {  } from 'react'
import { useAuth } from '../contexts/AuthContext'
import useTeam from '../hooks/TeamHook'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import JoinTeam from './JoinTeam'
import AddTeam from './AddTeam'

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  explanation: {
    textAlign: "center",
    paddingBottom: 10,
  }
}));

export default function GetStarted(setUserData) {

  const { currentUser } = useAuth()
  const team = useTeam()

  const classes = useStyles()

  return (
    <Container className={classes.cardGrid} maxWidth="md">
      <div className={classes.explanation}>
        <Typography variant="h2">Welcome!</Typography>
        <Typography>It looks like you haven't joined a team yet. Let's fix that.</Typography>
      </div>
      <Grid container spacing={4}>
      <Grid item xs={12} sm={9} md={6}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Join Team
                </Typography>
                <Typography>
                  Check the dropdown below to see if your team is already online!
                </Typography>
                <JoinTeam setUserData={setUserData}/>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={9} md={6}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  Add Your Team
                </Typography>
                <Typography>
                  Don't see your team? Add a new team below.
                </Typography>
                <AddTeam setUserData={setUserData}/>
              </CardContent>
            </Card>
          </Grid>
      </Grid>
    </Container>
  )
}