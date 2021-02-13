import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import CardActionArea from '@material-ui/core/CardActionArea';
import useTeam from '../hooks/TeamHook'
import { useHistory } from 'react-router-dom'
const SERVER_URL = "http://localhost:5000"

const useStyles = makeStyles((theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    margin: 20,
  },
  cardContent: {
    flexGrow: 1,
  },
  explanation: {
    textAlign: "center",
    paddingBottom: 10,
  },
  name: {
    flexGrow: 1,
  },
  button: {
    margin: 5,
  },
  title: {
    margin: 10
  }
}))

export default function Meets() {
  const [meets, setMeets] = useState()
  const team = useTeam()
  const history = useHistory()

  useEffect(() => {
    if (meets !== undefined) {
      return
    }
    fetch(`${SERVER_URL}/meets`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      },
    }).then(response => response.json())
    .then(data => {
      setMeets(data)
    })
  })

  const classes = useStyles()

  return (
    <div>
      <h2>Meets</h2>
      {meets && !meets.length && <p>No current meets!</p> }
      <ul>
        {meets && meets.length && meets.map(meet => (
          <Card className={classes.card} key={meet.id}>
            <CardActionArea onClick={() => history.push(`meet/${meet.id}`)}>
              <CardContent className={classes.cardContent}>
                <Toolbar>
                  <Typography gutterBottom variant="h5" className={classes.name}>
                    {meet.name} 
                  </Typography>
                  {
                    team.captain && meet.host._path.segments[1] === team.team &&
                    <Button
                      className={classes.button}
                      variant="contained"
                      color="primary"
                      onClick={e => {
                        e.stopPropagation()
                        history.push(`edit-meet/${meet.id}`)}
                      }
                    >
                      Edit
                    </Button>
                  }
                </Toolbar>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </ul>
    </div>
  );
}