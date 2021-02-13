//import { Link, useHistory } from 'react-router-dom'
import React, { Component } from 'react';
const SERVER_URL = "http://localhost:5000"

class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: []
    }
  }

  componentDidMount() {
    fetch(`${SERVER_URL}/teams/requests`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      },
    }).then(response => response.json())
    .then(data => {
      this.setState({
        requests: data
      })
    })
  }

  submit = async (reqId, approve) => {
    console.log(reqId, approve)

    // Remove request locally:
    const reqs = this.state.requests
    const newReqs = reqs.filter(req => req.id !== reqId)
    this.setState({
      requests: newReqs
    })

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

  render() {
    return (
      <div>
        <h2>Requests</h2>
        {!this.state.requests.length && <p>No new requests!</p> }
        <ul>
          {this.state.requests.map(request => (
            <li key={request.id}>
              {request.user.first} {request.user.last}
              <button onClick={() => this.submit(request.id, true)}>Approve</button>
              <button onClick={() => this.submit(request.id, false)}>Deny</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Requests;
