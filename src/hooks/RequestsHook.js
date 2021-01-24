import React from 'react'
const SERVER_URL = "http://localhost:5000"

const useRequests = () => {
  // 1
  const [requests, requestsSet] = React.useState([]);

  React.useEffect(() => {
    async function fetchRequests() {
      const fullResponse = await fetch(`${SERVER_URL}/teams/requests`, {
        credentials: "include",
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8"
        },
      })
      const responseJson = await fullResponse.json();
      requestsSet(responseJson);
    }

    fetchRequests();
  }, []);

  // 2
  return requests;
};

export default useRequests