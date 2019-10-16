from app import db
from models.person import Person
from secrets import token_urlsafe
import datetime as dt

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)
    due = db.Column(db.DateTime, nullable=False)
    title = db.Column(db.String(), nullable=False)
    body = db.Column(db.String(), nullable=False)
    important = db.Column(db.Boolean(), nullable=False)
    done = db.Column(db.Boolean(), nullable=False)
    token = db.Column(db.String(64))

    def to_dict(self):
        data = {
        'id': self.id,
        'token': self.token,
        'owner_id': self.owner_id,
        'due': self.due.strftime("%Y-%m-%d"),
        'title': self.title,
        'body': self.body,
        'important': self.important,
        'done': self.done
        }
        return data

    def from_dict(dct):
        t = Task(
            id=dct['id'],
            owner_id=dct['owner_id'],
            token=dct['token'],
            due=dt.datetime.strptime(dct['due'], "%Y-%m-%d"),
            title=dct['title'],
            body=dct['body'],
            important=dct['important'],
            done=dct['done'])
        return t

    def add(task_dict):
        """
        task_dict: {
            'owner_token' : str(64) -> person.token,
            'due': datetime.datetime,
            'title': str(),
            'body': str(),
            'important': bool(),
            'done': bool()
        }
        """
        p = Person.get(task_dict['owner_token'])
        if not p:
            raise Exception('Owner does not exist!')
        try:
            t = Task(
                owner_id= p.id,
                due= task_dict['due'],
                title= task_dict['title'],
                body= task_dict['body'],
                important= task_dict['important'],
                done= task_dict['done'],
                token=token_urlsafe(32)
                )
        except:
            raise Exception('Problem in request dict')
        db.session.add(t)
        db.session.commit()
        return t

    def get(_token):
        t = Task.query.filter_by(token=_token).first()
        if not t:
            raise Exception('Task does not exist!')
        else:
            return t

    def toggle_done(_token):
        t = Task.query.filter_by(token=_token).first()
        if not t:
            raise Exception('Task does not exist!')
        else:
            t.done = not t.done
            db.session.commit()
            return t.to_dict()

    def get_all(_token):
        p = Person.get(_token)
        if not p:
            raise Exception('Owner does not exist!')
        tasks = list(Task.query.filter_by(owner_id=p.id))
        res = []
        for t in tasks:
            res.append(t.to_dict())
        tasks = res
        return tasks

    def delete(_token):
        t = Task.query.filter_by(token=_token).first()
        if not t:
            raise Exception('Task does not exist!')
        else:
            db.session.delete(Task.get(t.token))
            db.session.commit()
            return 'Task deleted'
