import React from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: this.props.done,
    };

    this.updateTask = this.updateTask.bind(this);
  }

  updateTask() {
    this.setState(state => ({
      done: !state.done
    }));
  }

  render() {
    const bg = this.state.done ? 'secondary' : (this.props.important ? 'info' : 'light');
    const text = this.state.done ? 'text-white' : (this.props.important ? 'text-white' : 'text-body');
    const big_text ='h5 ' + text;
    const btn_txt = this.state.done ? 'Mark task as not done' : 'Mark task as done';
    return <Card bg={bg} style= {{ width: '18rem' }} className='m-2'>
      <Card.Header className={big_text}>
        {this.props.title}
      </Card.Header>
      <Card.Body>
        <Card.Text className={text}>
          <span>{this.props.body} </span><hr/>
          <span> Due Date: {this.props.due.toLocaleDateString()}</span>
        </Card.Text>
        <Button variant="primary" onClick={this.updateTask}>{btn_txt}</Button>
      </Card.Body>
    </Card>
  }
}

class Header extends React.Component {
  render() {
  return  <Navbar bg="dark" expand="lg" sticky='top'>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="#home" className='text-white h5'>Your Tasks</Nav.Link>
                <Nav.Link href="#link" className='text-white h5'>Your Profile</Nav.Link>
                <Nav.Link href="#link" className='text-white h5'>Leaderboard</Nav.Link>
              </Nav>
              <Navbar.Brand inline href="#home" className='text-white border border-white p-2'>Task Manager</Navbar.Brand>
            </Navbar.Collapse>
          </Navbar>;
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
  const header = new Header();
  const footer = new Footer();
  return <div>
    <Header />
    <Task title='Task no 1' body='Do the thing' done={false} important={true} due={new Date()}/>
    <Footer />
  </div>
}

export default App;
