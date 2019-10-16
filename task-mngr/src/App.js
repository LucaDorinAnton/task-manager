import React from 'react';
import './App.css';
import Navbar from 'react-bootstrap/Navbar';

import FrontPage from './FrontPage.js';
import MainPage from './MainPage.js';

const base_url = "http://localhost:5000";

function post_json(url, data) {
    return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
      }
    });
}

class TopLevelController extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      p_token: "",
      user: "",
      login_f_toast: false,
      login_t_toast: false,
      signup_f_toast: false,
      signup_t_toast: false,
      loggedIn: false
    };

    this.toggle_login_f_toast = this.toggle_login_f_toast.bind(this);
    this.toggle_login_t_toast = this.toggle_login_t_toast.bind(this);
    this.toggle_signup_f_toast = this.toggle_signup_f_toast.bind(this);
    this.toggle_signup_t_toast = this.toggle_signup_t_toast.bind(this);
    this.signUp = this.signUp.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logout = this.logout.bind(this);
  }

  toggle_login_f_toast() {
    this.setState({
      login_f_toast: false
    });
  }

  toggle_login_t_toast() {
    this.setState({
      login_t_toast: false,
      loggedIn: true
    });

  }

  toggle_signup_f_toast() {
    this.setState({
      signup_f_toast: false
    });
  }

  toggle_signup_t_toast() {
    this.setState({
      signup_t_toast: false,
      loggedIn: true
    });
  }

  logIn(data) {
    const url = base_url + "/login";
    post_json(url, data).then(resp => resp.json()).then(json => {
      if(typeof json.e != "undefined") {
        this.setState({login_f_toast: true});
      } else {
        this.setState({
          login_t_toast: true,
          p_token: json.token,
          user: json.username});
      }
    });
  }

  signUp(user, pass) {
    const data = {
      username: user,
      password: pass
    };
    const url = base_url + "/signup";
    post_json(url, data).then(resp => resp.json()).then(json => {
      if(typeof json.e != "undefined") {
        this.setState({signup_f_toast: true});
      } else {
        this.setState({
          signup_t_toast: true,
          p_token: json.token,
          user: json.username
        });
      }
    });
  }

  logout() {
    this.setState({
      p_token: "",
      loggedIn: false
    });
  }

  render() {

    const mainPanel= !this.state.loggedIn ? <FrontPage
      logIn={this.logIn}
      signUp={this.signUp}
      show_login_f_toast={this.state.login_f_toast}
      show_login_t_toast={this.state.login_t_toast}
      show_signup_f_toast={this.state.signup_f_toast}
      show_signup_t_toast={this.state.signup_t_toast}
      toggle_login_f_toast={this.toggle_login_f_toast}
      toggle_login_t_toast={this.toggle_login_t_toast}
      toggle_signup_f_toast={this.toggle_signup_f_toast}
      toggle_signup_t_toast={this.toggle_signup_t_toast}/> : <MainPage
        p_token={this.state.p_token}
        user={this.state.user}
        logout={this.logout}
       />;
  return <>
    {mainPanel}
    <Footer />
  </>;
  }
}


class Footer extends React.Component {
  render() {
    return <Navbar bg='dark' expand='lg' fixed='bottom'>
      <span className='text-white h5 text-center p-1 w-100'> | Demo web app for integrating React JS, Flask Python and Redis. |</span>
    </Navbar>;
  }
}

function App() {
  return <TopLevelController />;
}

export default App;
