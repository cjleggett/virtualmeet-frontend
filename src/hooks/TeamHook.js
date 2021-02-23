import React from "react";
import { SERVER_URL } from "../helpers/constants";
import { useAuth } from "../contexts/AuthContext";
import { useHistory } from "react-router-dom";

const useTeam = () => {
  // 1
  const [team, teamSet] = React.useState({
    team: undefined,
    captain: false,
    loaded: false,
  });
  const history = useHistory();
  const { getSession, logout } = useAuth();

  React.useEffect(() => {
    if (team.loaded) {
      return;
    }
    async function fetchTeam() {
      fetch(`${SERVER_URL}/teams`, {
        credentials: "include",
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          sessionid: getSession(),
        },
      })
        .then((res) => res.json())
        .then((fullResponse) => {
          fullResponse.loaded = true;
          teamSet(fullResponse);
        })
        .catch(async (e) => {
          await logout();
          console.log(e);
          history.replace("login");
        });
    }

    fetchTeam();
  });

  // 2
  return team;
};

export default useTeam;
