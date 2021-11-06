import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AuthProvider } from './components/loading/Auth';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Groups from './pages/Groups';
import DiscussionTitles from './pages/DiscussionTitles';
import Discussion from './pages/Discussion';
import Header from './pages/Header';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Search from './pages/Search';
import './styles/css/reset.css';
import { Toaster } from 'react-hot-toast';

const Routes = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Toaster 
          toastOptions={{
            className: 'toast-bar'
          }}
        position="bottom-right"
        reverseOrder={false}
        />
        <Switch>
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={Signup} />
          <Route exact path='/profile/:uid' component={Profile} />
          <Route exact path='/groups' component={Groups} />
          <Route exact path='/discussions/:optionalGroup' component={DiscussionTitles} />
          <Route exact path='/discussions/:group/:uid' component={Discussion} />
          <Route exact path='/search/:keyword' component={Search} />
          <Route path='/' component={Home} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default Routes;
