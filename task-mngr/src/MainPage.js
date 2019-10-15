import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import CardColumns from 'react-bootstrap/CardColumns';
import Collapse from 'react-bootstrap/Collapse';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import dateformat from 'dateformat';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

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

function put_fetch(url) {
    return fetch(url, {
    method: 'PUT',
    mode: 'cors',
    });
}

function delete_fetch(url) {
    return fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    });
}

class MainPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 'task',
      open: false
    };

    this.pageChange = this.pageChange.bind(this);
    this.setOpen = this.setOpen.bind(this);
  }

  setOpen() {
    this.setState(state => ({
      open: !state.open
    }));
  }

  pageChange(p) {
    this.setState({
      page: p
    });
  }

  render() {
    const showButton = this.state.page === "task";
    var page;
    switch(this.state.page) {
      case 'task':
        page = <TaskList p_token={this.props.p_token}
                         open={this.state.open}/>;
        break;
      case 'leader':
        page = <LeaderboardPage p_token={this.props.p_token}/>;
        break;
      default:
        page = <ProfilePage p_token={this.props.p_token}/>;
    }

    return <>
    <Header
      pageChange={this.pageChange}
      showButton={showButton}
      setOpen={this.setOpen}
      open={this.state.open}
      logout={this.props.logout}
     />
    {page}
    </>;
  }
}

class ProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      noTasks: 0,
      noImpTasks: 0,
      impTasksP: 0,
      noComplTasks: 0,
      complTasksP: 0,
      username: ""
    };
    this.getProfile = this.getProfile.bind(this);

    this.getProfile();
  }

  getProfile() {
    fetch(base_url + "/person/" + this.props.p_token + "/profile").then(resp => resp.json()).then(json => {
      if(typeof json.e != "undefined") {
        console.log('Error here: ' + JSON.stringify(json));
      } else {
        this.setState({
          username: json.user,
          noTasks: json.tasks,
          noImpTasks: json.imp_tasks,
          impTasksP: json.imp_p,
          noComplTasks: json.done_tasks,
          complTasksP: json.done_p
        });
      }
    });
  }


  render() {
    return <Container>
      <Row>
        <Col sm='12' md={{ span: 10, offset: 1 }} className='pt-5 mt-5 align-self-center'>
      <Card style={{width: "28 rem"}}>
      <Card.Body>
          <Card.Title> {this.state.username}'s profile </Card.Title>
          <Card.Text> See how you have been doing on the task manager.</Card.Text>
      </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroupItem>No. of tasks: <strong>{this.state.noTasks}</strong></ListGroupItem>
          <ListGroupItem>No. of important tasks: <strong>{this.state.noImpTasks} ({Number((this.state.impTasksP * 100).toFixed(2))}%)</strong></ListGroupItem>
          <ListGroupItem>No of completed tasks: <strong>{this.state.noComplTasks} ({Number((this.state.complTasksP * 100).toFixed(2))}%)</strong></ListGroupItem>
        </ListGroup>
      </Card>
      </Col>
    </Row>
  </Container>;
  }
}

class LeaderboardPage extends React.Component {

  render() {
    return <span>I am a Leaderboard page!</span>;
  }
}

class TaskCollapseButton extends React.Component {

}

class TaskConstructor extends React.Component {

  constructor(props) {
    super(props);

    this.state={
      title: "",
      body: "",
      due: new Date(),
      important: false
    };

    this.onDueChange = this.onDueChange.bind(this);
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onBodyChange = this.onBodyChange.bind(this);
    this.onImportantChange = this.onImportantChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  onDueChange(date) {
    this.setState({
      due: date
    });
  }

  onTitleChange(e) {
    this.setState({
      title: e.target.value
    });
  }

  onBodyChange(e) {
    this.setState({
      body: e.target.value
    });
  }

  onImportantChange(e) {
    this.setState({
      important: e.target.checked
    });
  }

  submit(e) {
    e.preventDefault();
    const data = {
      due: dateformat(this.state.due, 'yyyy-mm-dd'),
      title: this.state.title,
      body: this.state.body,
      important: this.state.important
    }
    post_json(base_url + '/person/' + this.props.p_token + '/new_task', data).then(resp => resp.json()).then(json => {
          if(typeof json.e != "undefined") {
            console.log('Error here: ' + JSON.stringify(json));
          } else {
            this.props.update();
          }
    });
  }


  render(){
    return <div>
            <Collapse in={this.props.open}>
              <div id='task-form'>
                <Card style={{width: '36rem'}} className='p-2'>
                  <Form onSubmit={this.submit}>
                    <Form.Group controlId="taskTitle">
                      <Form.Label>Title</Form.Label>
                      <Form.Control value={this.state.title} onChange={this.onTitleChange} type="text" placeholder="Title for your task" />
                    </Form.Group>
                    <Form.Group controlId="taskBody">
                      <Form.Label>Body</Form.Label>
                      <Form.Control value={this.state.body} onChange={this.onBodyChange} type="text" placeholder="Body for your task" />
                    </Form.Group>
                    <Form.Group controlId="taskDate">
                      <Form.Label>Due Date</Form.Label><br/>
                      <DatePicker selected={this.state.due} onChange={this.onDueChange}/>
                    </Form.Group>
                    <Form.Group controlId="taskImportant">
                      <Form.Check value={this.state.important} onChange={this.onImportantChange} type="checkbox" label="Important Task" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Create Task
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

    this.state = {
      tasks: []
    };
    this.getTasks = this.getTasks.bind(this);
    this.getTasks();
  }

  getTasks() {
    console.log('Getting tasks!');
    fetch(base_url + '/person/' + this.props.p_token + '/tasks').then(resp => resp.json()).then(json => {
      this.setState({
        tasks: json.tasks
      });
    })
  }

  render() {
    const tasks = this.state.tasks.map((t) =>
    <Task done={t.done}
          important={t.important}
          title={t.title}
          body={t.body}
          due={t.due}
          key={t.token}
          token={t.token}
          p_token={this.props.p_token}
          update={this.getTasks}/>);

    return <div className='p-2'>
      <TaskConstructor open={this.props.open} p_token={this.props.p_token} update={this.getTasks}/><hr/>
      <span className='h3 m-3'> Task List </span> <br/>
      <CardColumns className="border mx-1 mb-5">
        {tasks}
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
    this.deleteTask = this.deleteTask.bind(this);
  }

  deleteTask() {
    delete_fetch(base_url + '/task/' + this.props.token).then(resp => resp.json()).then(json => {
      if(typeof json.e != "undefined") {
        console.log('Problem here: ' + JSON.stringify(json));
      } else {
        this.props.update();
      }
    });

  }

  updateTask() {
    this.setState(state => ({
      done: !state.done
    }));
    put_fetch(base_url + "/task/" + this.props.token + '/toggle').then(resp => resp.json()).then(json => {
      if(typeof json.e != "undefined") {
        console.log('Problem here: ' + JSON.stringify(json));
      }
    });
  }

  render() {
    const bg = this.state.done ? 'secondary' : (this.props.important ? 'info' : 'light');
    const text = this.state.done ? 'text-white' : (this.props.important ? 'text-white' : 'text-body');
    const big_text ='h5 ' + text + ' text-center';
    const btn_txt = this.state.done ? 'Mark task as not done' : 'Mark task as done';
    const due = new Date(Date.parse(this.props.due)).toLocaleDateString();

    return <Card bg={bg} className='m-2'>
      <Card.Header className={big_text}>
        {this.props.title}
      </Card.Header>
      <Card.Body>
        <Card.Text className={text}>
          <span>{this.props.body} </span><hr/>
          <span> Due Date: {due}</span>
        </Card.Text>
        <Button variant="primary" onClick={this.updateTask}>{btn_txt}</Button>
        <Button className="ml-3" variant="danger" onClick={this.deleteTask}>Delete Task</Button>
      </Card.Body>
    </Card>
  }
}

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      t: true,
      p: false,
      l: false,
    };

    this.handleTaskClick = this.handleTaskClick.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleLeaderboardClick = this.handleLeaderboardClick.bind(this);
  }

  handleTaskClick() {
    this.props.pageChange('task');
  }

  handleLeaderboardClick() {
    this.props.pageChange('leader');
  }

  handleProfileClick() {
    this.props.pageChange('profile');
  }

  render() {
    const btn = this.props.showButton ? <Button className='ml-2 h5 primary'
                  onClick={this.props.setOpen}
                  aria-controls="task-form"
                  aria-expanded={this.props.open}> Create new Task </Button> : null;

    const t_selected = this.state.t ? "text-white h5 border-bottom border-white" : "text-white h5";
    const p_selected = this.state.p ? "text-white h5 border-bottom border-white" : "text-white h5";
    const l_selected = this.state.l ? "text-white h5 border-bottom border-white" : "text-white h5";

  return  <Navbar bg="dark" expand="lg" sticky='top'>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link onClick={this.handleTaskClick} href="#home" className={t_selected}>Your Tasks</Nav.Link>
                <Nav.Link onClick={this.handleProfileClick} href="#profile" className={p_selected}>Your Profile</Nav.Link>
                <Nav.Link onClick={this.handleLeaderboardClick} href="#leaderboard" className={l_selected}>Leaderboard</Nav.Link>
                <Nav.Link onClick={this.props.logout} href="#logout" className="text-white h5">Logout</Nav.Link>
                {btn}
              </Nav>
              <Navbar.Brand onClick={this.handleTaskClick} href="#home" className='text-white border border-white p-2'>Task Manager</Navbar.Brand>
            </Navbar.Collapse>
          </Navbar>;
  }
}

export default MainPage;
