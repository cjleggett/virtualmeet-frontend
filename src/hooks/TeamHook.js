import React from "react";
import { SERVER_URL } from '../helpers/constants'

const useTeam = () => {
  // 1
  const [team, teamSet] = React.useState({
    team: undefined,
    captain: false,
    loaded: false,
  });

  React.useEffect(() => {
    async function fetchTeam() {
      fetch(`${SERVER_URL}/teams`, {
        credentials: "include",
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      }).then(res => res.json()).then(fullResponse => {
        console.log(fullResponse)
        fullResponse.loaded = true;
        teamSet(fullResponse);
        console.log('here')
      }).catch(e => {
        console.log('here')
        console.log(e)
      })
      
    }

    fetchTeam();
  }, []);

  // 2
  return team;
};

export default useTeam;
