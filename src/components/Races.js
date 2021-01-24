//import { Link, useHistory } from 'react-router-dom'
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
const SERVER_URL = "http://localhost:5000"

class Races extends Component {
  constructor(props) {
    super(props);
    this.state = {
      races: []
    }
  }

  componentDidMount() {
    fetch(`${SERVER_URL}/races`, {
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
        races: data
      })
    })
  }

  render() {
    return (
      <div>
        <h2>Races</h2>
        {!this.state.races.length && <p>No current races!</p> }
        <ul>
          {this.state.races.length && this.state.races.map(race => (
            <li key={race.id}>
              <Link to={`/race/${race.id}`}>{race.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Races;
