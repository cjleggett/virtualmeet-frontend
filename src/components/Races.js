//import { Link, useHistory } from 'react-router-dom'
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
const SERVER_URL = "http://localhost:5000"

class Meets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meets: []
    }
  }

  componentDidMount() {
    fetch(`${SERVER_URL}/meets`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      },
    }).then(response => response.json())
    .then(data => {
      console.log(data)
      this.setState({
        meets: data
      })
    })
  }

  render() {
    return (
      <div>
        <h2>Meets</h2>
        {!this.state.meets.length && <p>No current meets!</p> }
        <ul>
          {this.state.meets.length && this.state.meets.map(meet => (
            <li key={meet.id}>
              <Link to={`/meet/${meet.id}`}>{meet.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Meets;
