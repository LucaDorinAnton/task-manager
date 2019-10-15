import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


class FrontToast extends React.Component {
  render() {
    const border = this.props.good ? "border border-success" : "border border-danger";
    return <Toast show={this.props.show}
                  onClose={this.props.toggleShow}
                  className={border}
                  delay={3000}
                  autohide>
      <Toast.Header>
        <strong className='mr-auto'>{this.props.title}</strong>
      </Toast.Header>
      <Toast.Body>
        {this.props.body}
      </Toast.Body>
    </Toast>;
  }
}

class SignUp extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      username: "",
      password: "",
      repeat: ""
    };

    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswdChange = this.handlePasswdChange.bind(this);
    this.handleRepeatChange = this.handleRepeatChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleUserChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  handlePasswdChange(e) {
    this.setState({
      password: e.target.value
    });
  }
  handleRepeatChange(e) {
    this.setState({
      repeat: e.target.value
    });
  }

  submit(e) {
    e.preventDefault();
    if(this.state.password === this.state.repeat) {
        this.props.singUpHandler(this.state.username, this.state.password);
    } else {
      this.props.show_signup_match_toast();
    }
  }

  render(){
    return <Form onSubmit={this.submit}>
      <Form.Group controlId="signUpUser">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text"
                      placeholder="Your desired username"
                      value={this.state.username}
                      onChange={this.handleUserChange} />
      </Form.Group>

      <Form.Group controlId="signUpPasswd">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password"
                      placeholder="Your password here"
                      value={this.state.password}
                      onChange={this.handlePasswdChange} />
      </Form.Group>

      <Form.Group controlId="signUpRepeat">
        <Form.Label>Repeat password</Form.Label>
        <Form.Control type="password"
                      placeholder="Your password here again"
                      value={this.state.repeat}
                      onChange={this.handleRepeatChange} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Create your account
      </Button>
    </Form>;
  }
}

class LogIn extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: "",
      password: ""
    }
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handlePasswdChange = this.handlePasswdChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleUserChange(e) {
    this.setState({username: e.target.value});
  }

  handlePasswdChange(e) {
    this.setState({password: e.target.value});
  }

  submit(e) {
    e.preventDefault();
    this.props.logInHandler(this.state);
  }

  render() {
    return <Form onSubmit={this.submit}>
      <Form.Group controlId="loginUser">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text"
                      value={this.state.username}
                      onChange={this.handleUserChange}
                      placeholder="Username here"/>
      </Form.Group>

      <Form.Group controlId="loginPasswd">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password"
                      value={this.state.password}
                      onChange={this.handlePasswdChange}
                      placeholder="Password here"/>
      </Form.Group>
      <Button variant="primary" type="submit">
        Log in
      </Button>
    </Form>;
  }
}

class FrontPage extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      signup_match: false
    };

    this.showSignupMatch = this.showSignupMatch.bind(this);
    this.toggleDisplay = this.toggleDisplay.bind(this);
  }

  showSignupMatch() {
    this.setState({
      signup_match: ! this.state.signup_match
    });
  }

  toggleDisplay(){
    this.setState(state => ({
      logIn: !state.logIn
    }));
  }

  render(){
      const login_f_toast = this.props.show_login_f_toast ? <FrontToast
        title="Couldn't log in..."
        body={"Username and password didn't match"}
        show={this.props.show_login_f_toast}
        good={false}
        toggleShow={this.props.toggle_login_f_toast}/> : null;

      const login_t_toast = this.props.show_login_t_toast ? <FrontToast
          title="Logged in successfully!"
          body={"You are now logged in!"}
          show={this.props.show_login_t_toast}
          good={true}
          toggleShow={this.props.toggle_login_t_toast}/> : null;

        const signup_f_toast = this.props.show_signup_f_toast ?<FrontToast
          title="Couldn't sign you up"
          body={"That person is already registered..."}
          show={this.props.show_signup_f_toast}
          good={false}
          toggleShow={this.props.toggle_signup_f_toast}/> : null;

        const signup_t_toast = this.props.show_signup_t_toast ?<FrontToast
          title="Signed up successfully!"
          body={"You can now log in!"}
          show={this.props.show_signup_t_toast}
          good={true}
          toggleShow={this.props.toggle_signup_t_toast}/> : null;

        const match_toast = this.state.signup_match ?<FrontToast
              title="Couldn't sign you up"
              body={"Passwords do not match!"}
              show={this.state.signup_match}
              good={false}
              toggleShow={this.showSignupMatch}/> : null;


        return <><Container className='h-100'>
      <Row className='h-100'>
        <Col sm='12' md={{ span: 6, offset: 3 }} className='align-self-center'>
        <span className="h3 font-weight-bold"> Welcome to the Task Manager.</span>
        <Accordion defaultActiveKey="0" className='m-3'>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                Log In
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <LogIn logInHandler={this.props.logIn}/>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Card.Header} eventKey="1">
                Sign Up
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <SignUp singUpHandler={this.props.signUp}
                        show_signup_match_toast={this.showSignupMatch}/>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
        </Col>
        </Row>
    </Container>
    <div  style={{
        position: 'absolute',
        top: 0,
        right: 0,
        }}
          className="p-3">

      {login_f_toast}
      {login_t_toast}
      {signup_f_toast}
      {signup_t_toast}
      {match_toast}
    </div>
</>;
  }
}

export default FrontPage;
