import React from 'react'
const SERVER_URL = "http://localhost:5000"

const useTeams = () => {
  // 1
  const [teams, teamsSet] = React.useState([]);

  React.useEffect(() => {
    async function fetchTeams() {
      const fullResponse = await fetch(`${SERVER_URL}/teams/teams`, {
        credentials: "include",
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        },
      })
      const responseJson = await fullResponse.json();
      teamsSet(responseJson);
    }

    fetchTeams();
  }, []);

  // 2
  return teams;
};

export default useTeams