import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { SERVER_URL } from "../helpers/constants";

const useTeams = () => {
  // 1
  const [teams, teamsSet] = React.useState([]);
  const [loaded, setLoaded] = React.useState(false);
  const { getSession } = useAuth();

  React.useEffect(() => {
    if (loaded) {
      return
    }
    async function fetchTeams() {
      const fullResponse = await fetch(`${SERVER_URL}/teams/teams`, {
        credentials: "include",
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          sessionid: getSession(),
        },
      });
      const responseJson = await fullResponse.json();
      teamsSet(responseJson);
      setLoaded(true)
    }

    fetchTeams();
  });

  // 2
  return teams;
};

export default useTeams;
