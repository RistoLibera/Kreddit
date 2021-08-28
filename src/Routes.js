import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './components/user/Auth';
// Page components
import Login from './pages/Login';
import Signup from './pages/Signup';
import AllGroups from './pages/AllGroups';
import Discussion from './pages/Discussion';
import Group from './pages/Group';
import Header from './pages/Header';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Search from './pages/Search';
// import './styles/css/reset.css';

const Routes = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Switch>
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/profile/:uid' component={Profile} />
          <Route exact path='/allgroups' component={AllGroups} />
          <Route exact path='/discussion' component={Discussion} />
          <Route exact path='/group' component={Group} />
          <Route exact path='/search' component={Search} />
          <Route path='/' component={Home} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default Routes;
