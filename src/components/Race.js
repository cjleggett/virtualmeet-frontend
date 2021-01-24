//import { Link, useHistory } from 'react-router-dom'
import React, { Component } from 'react';
import AddEntry from './AddEntry'
const SERVER_URL = "http://localhost:5000"

class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      entries: []
    }
  }

  componentDidMount() {

    // Fetch Race info
    fetch(`${SERVER_URL}/races/race/${this.state.id}`, {
      credentials: "include",
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json;charset=UTF-8"
      },
    }).then(response => response.json())
    .then(data => {      
      this.setState({
        name: data.name,
        distance: data.distance,
        units: data.units,
        start: new Date (data.startDate),
        end: new Date(data.endDate),
        teams: data.invitedTeams,
        host: data.host
      })

      console.log('here')

      // Fetch results info
      fetch(`${SERVER_URL}/entries/${this.state.id}`, {
        credentials: "include",
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        },
      }).then(response => response.json())
      .then(data => {
        this.setState({
          entries: data
        })
      })
    })

    
  }

  formatTime(hours, minutes, seconds) {
    const secondsNum = parseFloat(seconds)
    if (minutes.length === 1) {
      minutes = "0" + minutes
    }
    if (secondsNum < 10) {
      seconds = "0" + seconds
    }
    return `${hours}:${minutes}:${seconds}`
  }

  render() {
    console.log(this.state.teams)
    return (
      <div>
        <h2>{this.state.name}</h2>
        <p><strong>Host:</strong> {this.state.host && this.state.host.name}</p>
        <p><strong>Distance:</strong> {this.state.distance && this.state.distance} {this.state.units && this.state.units}</p>
        <p><strong>Start Date:</strong> {this.state.start && this.state.start.toLocaleDateString()}</p>
        <p><strong>End Date:</strong> {this.state.end && this.state.end.toLocaleDateString()}</p>
        <AddEntry raceId={this.state.id}/>
        <h2>Entries</h2>
        {!this.state.entries.length && <p>No current races!</p> }
        {this.state.entries.length && <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Time</th>
              <th>Elevation Gain</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {this.state.entries.map(entry => (
              <tr key={entry.id}>
                <th>{entry.user}</th>
                <th>{this.formatTime(entry.hours, entry.minutes, entry.seconds)}</th>
                <th>{entry.elevation}</th>
                <th>{this.state.teams[entry.team].name}</th>
              </tr>))}
            </tbody>
        </table>}
      </div>
    );
  }
}

export default Requests;
