import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AllGroups from './pages/AllGroups';
import Discussion from './pages/Discussion';
import Group from './pages/Group';
import Header from './pages/Header';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Search from './pages/Search';

const Routes = () => {

  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/groups" component={AllGroups} />
        <Route exact path="/discussion" component={Discussion} />
        <Route exact path="/group" component={Group} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/search" component={Search} />
        <Route  path="/" component={Home} />
      </Switch>
    </Router>
  )
}

export default Routes;
