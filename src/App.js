import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard"
import Login from "./components/Login"
import ForgotPassword from "./components/ForgotPassword"
import PrivateRoute from "./components/PrivateRoute"
import UpdateProfile from "./components/UpdateProfile"
import AddTeam from "./components/AddTeam"
import JoinTeam from "./components/JoinTeam"
import Requests from "./components/Requests"
import AddMeet from "./components/AddMeet"
import Meet from "./components/Meet"
import Layout from "./components/Layout"
import EditMeet from "./components/EditMeet"
import './styles/app.css'

class App extends React.Component {
  render() {
    return (
      <Layout>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={Dashboard}/>
              <PrivateRoute path="/update-profile" component={UpdateProfile}/>
              <PrivateRoute path="/add-team" component={AddTeam}/>
              <PrivateRoute path="/join-team" component={JoinTeam}/>
              <PrivateRoute path="/requests" component={Requests}/>
              <PrivateRoute path="/make-meet" component={AddMeet}/>
              <PrivateRoute path="/meet/:id" component={Meet}/>
              <PrivateRoute path="/edit-meet/:id" component={EditMeet}/>
              <Route path="/signup" component={Signup}/>
              <Route path="/login" component={Login}/>
              <Route path="/forgot-password" component={ForgotPassword}/>
            </Switch>
          </AuthProvider>
        </Router>
        </Layout>
    )
  }
}

export default App;
