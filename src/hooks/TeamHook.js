import React from 'react'
const SERVER_URL = "http://localhost:5000"

const useTeam = () => {
  // 1
  const [team, teamSet] = React.useState({team: undefined, captain: false});

  React.useEffect(() => {
    async function fetchTeam() {
      const fullResponse = await fetch(`${SERVER_URL}/teams`, {
        credentials: "include",
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        },
      })
      const responseJson = await fullResponse.json();
      teamSet(responseJson);
    }

    fetchTeam();
  }, []);

  // 2
  return team;
};

export default useTeam