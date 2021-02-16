import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? (
          <div>
            <Header />
            <Component style={{ marginTop: 200 }} {...props} />
          </div>
        ) : (
          <Redirect to="/login" />
        );
      }}
    ></Route>
  );
}
