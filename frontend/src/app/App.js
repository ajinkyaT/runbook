import React, { Component } from 'react';
import './App.css';
import {
  Route,
  withRouter,
  Switch,
  Redirect
} from 'react-router-dom';

import { getCurrentUser } from '../util/APIUtils';
import { ACCESS_TOKEN } from '../constants';

import Runlist from '../run/RunList';
import NewRun from '../run/NewRun';
import NewPost from '../post/NewPost';
import Login from '../user/login/Login';
import Signup from '../user/signup/Signup';
import Profile from '../user/profile/Profile';
import EditProfile from '../user/profile/EditProfile';
import AppHeader from '../common/AppHeader';
import NotFound from '../common/NotFound';
import LoadingIndicator from '../common/LoadingIndicator';
import PrivateRoute from '../common/PrivateRoute';

import { Layout, notification } from 'antd';
const { Content } = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleLogin = this.handleLogin.bind(this);

    notification.config({
      placement: 'topRight',
      top: 70,
      duration: 3,
    });    
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
    .then(response => {
      this.setState({
        currentUser: Object.assign({}, response),
        isAuthenticated: true,
        isLoading: false
      });
    }).catch(error => {
      this.setState({
        isLoading: false
      });  
    });
  }



  handleLogout(redirectTo="/", notificationType="success", description="You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem('userId');

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);
    
    notification[notificationType]({
      message: 'RunBook App',
      description: description,
    });
  }

  componentWillMount(){
    this.loadCurrentUser();
  }

  handleLogin() {
    notification.success({
      message: 'RunBook App',
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();   
    this.props.history.push("/");
  }

  render() {
    if(this.state.isLoading) {
      return <LoadingIndicator />
    }
    return (
        <Layout className="app-container">
          <AppHeader isAuthenticated={this.state.isAuthenticated} 
            currentUser={this.state.currentUser} 
            onLogout={this.handleLogout} />

          <Content className="app-content">
            <div className="container">
              <Switch>      
                <Route exact path="/" 
                  render={(props) => <Runlist {...props} />}>
                </Route>
                <Route path="/login" 
                  render={(props) => <Login onLogin={this.handleLogin} {...props} />}></Route>
                <Route path="/signup" component={Signup}></Route>
                <PrivateRoute path="/mypage" component={Profile} authenticated={this.state.isAuthenticated} handleLogout={this.handleLogout} currentUser={this.state.currentUser} >
                </PrivateRoute>
                <PrivateRoute authenticated={this.state.isAuthenticated} path="/runs" component={NewRun} handleLogout={this.handleLogout} currentUser={this.state.currentUser} ></PrivateRoute>
                <PrivateRoute authenticated={this.state.isAuthenticated} path="/posts" component={NewPost} handleLogout={this.handleLogout} currentUser={this.state.currentUser} ></PrivateRoute>
                <PrivateRoute authenticated={this.state.isAuthenticated} path="/editprofile" component={EditProfile} handleLogout={this.handleLogout} currentUser={this.state.currentUser} ></PrivateRoute>
                <Route component={NotFound}></Route>
              </Switch>
            </div>
          </Content>
        </Layout>
    );
  }
}

export default withRouter(App);