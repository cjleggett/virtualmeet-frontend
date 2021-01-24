import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Signup from "./Signup";
import Dashboard from "./Dashboard"
import Login from "./Login"
import ForgotPassword from "./ForgotPassword"
import PrivateRoute from "./PrivateRoute"
import UpdateProfile from "./UpdateProfile"
import AddTeam from "./AddTeam"
import JoinTeam from "./JoinTeam"
import Requests from "./Requests"
import MakeRace from "./MakeRace"
import Race from "./Race.js"

class App extends React.Component {
  render() {
    return (
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute exact path="/" component={Dashboard}/>
            <PrivateRoute path="/update-profile" component={UpdateProfile}/>
            <PrivateRoute path="/add-team" component={AddTeam}/>
            <PrivateRoute path="/join-team" component={JoinTeam}/>
            <PrivateRoute path="/requests" component={Requests}/>
            <PrivateRoute path="/make-race" component={MakeRace}/>
            <PrivateRoute path="/race/:id" component={Race}/>
            <Route path="/signup" component={Signup}/>
            <Route path="/login" component={Login}/>
            <Route path="/forgot-password" component={ForgotPassword}/>
          </Switch>
        </AuthProvider>
      </Router>
    )
  }
}

export default App;
