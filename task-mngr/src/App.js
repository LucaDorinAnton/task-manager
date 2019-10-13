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
import CardColumns from 'react-bootstrap/CardColumns';
import  DatePicker from 'react-datepicker';
import Collapse from 'react-bootstrap/Collapse'

import 'react-datepicker/dist/react-datepicker.css';

class TaskConstructor extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      open: false
    };

    this.setOpen = this.setOpen.bind(this);
  }

  setOpen() {
    this.setState(state => ({
      open: !state.open
    }));
  }

  render(){
    return <div>
        <Button className='h5 primary'
              onClick={this.setOpen}
              aria-controls="task-form"
              aria-expanded={this.state.open}> Create new Task </Button>
            <Collapse in={this.state.open}>
              <div id='task-form'>
                <Card style={{width: '36rem'}} className='p-2'>
                  <Form>
                    <Form.Group controlId="taskTitle">
                      <Form.Label>Title</Form.Label>
                      <Form.Control type="text" placeholder="Title for your task" />
                    </Form.Group>
                    <Form.Group controlId="taskBody">
                      <Form.Label>Body</Form.Label>
                      <Form.Control type="text" placeholder="Body for your task" />
                    </Form.Group>
                    <Form.Group controlId="taskDate">
                      <Form.Label>Due Date</Form.Label><br/>
                      <DatePicker/>
                    </Form.Group>
                    <Form.Group controlId="taskImportant">
                      <Form.Check type="checkbox" label="Important Task" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                </Form>
              </Card>
            </div>
          </Collapse>
        </div>;
  }
}

class TaskList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className='p-2'>
      <TaskConstructor/><hr/>
      <span className='h3 m-3'> Task List </span> <br/>
      <CardColumns className="border mt-2">
        <Task title='Task no 1' body='Do the thing' done={false} important={true} due={new Date()}/>
      </CardColumns>
    </div>
  }
}

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
    const big_text ='h5 ' + text + ' text-center';
    const btn_txt = this.state.done ? 'Mark task as not done' : 'Mark task as done';
    return <Card bg={bg} className='m-2'>
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
    <TaskList/>
    <Footer />
  </div>
}

export default App;
