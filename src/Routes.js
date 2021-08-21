import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import AllGroups from './Pages/AllGroups';
import Discussion from './Pages/Discussion';
import Group from './Pages/Group';
import Header from './Pages/Header';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Search from './Pages/Search';

function Routes() {

  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/groups" component={AllGroups} />
        <Route exact path="/discussion" component={Discussion} />
        <Route exact path="/group" component={Group} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/search" component={Search} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes;
