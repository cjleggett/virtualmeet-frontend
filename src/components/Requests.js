import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
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
}));

// class Requests extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       requests: []
//     }
//   }

//   componentDidMount() {
//     fetch(`${SERVER_URL}/teams/requests`, {
//       credentials: "include",
//       method: "GET",
//       headers: {
//         "Accept": "application/json",
//         "Content-Type": "application/json;charset=UTF-8"
//       },
//     }).then(response => response.json())
//     .then(data => {
//       this.setState({
//         requests: data
//       })
//     })
//   }

//   submit = async (reqId, approve) => {
//     console.log(reqId, approve)

//     // Remove request locally:
//     const reqs = this.state.requests
//     const newReqs = reqs.filter(req => req.id !== reqId)
//     this.setState({
//       requests: newReqs
//     })

//     // Update status of request on backend
//     fetch(`${SERVER_URL}/teams/respond`, {
//       credentials: "include",
//       method: "POST",
//       headers: {
//         "Accept": "application/json",
//         "Content-Type": "application/json;charset=UTF-8"
//       },
//       body: JSON.stringify({
//         reqId,
//         approve
//       })
//     }).then(res => {
//       console.log(res)
//     })
//   }

//   render() {
//     return (
//       <div>
//         <h2>Requests</h2>
//         {!this.state.requests.length && <p>No new requests!</p> }
//         <ul>
//           {this.state.requests.map(request => (
//             <li key={request.id}>
//               {request.user.first} {request.user.last}
//               <button onClick={() => this.submit(request.id, true)}>Approve</button>
//               <button onClick={() => this.submit(request.id, false)}>Deny</button>
//             </li>
//           ))}
//         </ul>
//         <Card className={classes.card}>
//           <CardContent className={classes.cardContent}>
//             <Typography gutterBottom variant="h5" component="h2">
//               Add Your Team
//             </Typography>
//             <Typography>
//               Don't see your team? Add a new team below.
//             </Typography>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }
// }

export default function Requests() {
  const [requests, setRequests] = useState([])
  const classes = useStyles()

  useEffect(() => {
    if (requests.length) {
      return
    }
    fetch(`${SERVER_URL}/teams/requests`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      },
    }).then(response => response.json())
    .then(data => {
      setRequests(data)
    })
  })

  function submit(reqId, approve) {
    console.log(reqId, approve)

    // Remove request locally:
    const reqs = requests
    const newReqs = reqs.filter(req => req.id !== reqId)
    setRequests(newReqs)

    // Update status of request on backend
    fetch(`${SERVER_URL}/teams/respond`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      },
      body: JSON.stringify({
        reqId,
        approve
      })
    }).then(res => {
      console.log(res)
    })
  }

  return (
    <div>
      <Typography variant="h4" className={classes.title} >
        Your Unhandled Requests:
      </Typography>
      {!requests.length && <p>No new requests!</p> }
      <ul>
        {requests.map(request => (
          <Card className={classes.card} key={request.id}>
            <CardContent className={classes.cardContent}>
              <Toolbar>
                <Typography gutterBottom variant="h5" className={classes.name}>
                  {request.user.first} {request.user.last} 
                </Typography>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={() => submit(request.id, true)}
                  >
                    Approve
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={() => submit(request.id, false)}
                  >
                    Deny
                </Button>
              </Toolbar>
            </CardContent>
          </Card>
        ))}
      </ul>
    </div>
  )
}

// export default Requests;

{/*<li key={request.id}>
{request.user.first} {request.user.last}
<button onClick={() => submit(request.id, true)}>Approve</button>
<button onClick={() => submit(request.id, false)}>Deny</button>
</li>*/}