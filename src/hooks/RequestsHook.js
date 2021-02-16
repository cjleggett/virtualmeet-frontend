import React from "react";
import { useAuth } from "../contexts/AuthContext"
import { SERVER_URL } from "../helpers/constants";

const useRequests = () => {
  // 1
  const [requests, requestsSet] = React.useState([]);
  const { getSession } = useAuth()

  React.useEffect(() => {
    async function fetchRequests() {
      const fullResponse = await fetch(`${SERVER_URL}/teams/requests`, {
        credentials: "include",
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          sessionid: getSession(),
        },
      });
      const responseJson = await fullResponse.json();
      requestsSet(responseJson);
    }

    fetchRequests();
  }, []);

  // 2
  return requests;
};

export default useRequests;
