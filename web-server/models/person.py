from app import db
from app import redis_client
from werkzeug.security import generate_password_hash, check_password_hash
from secrets import token_urlsafe
import json

class Person(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    token = db.Column(db.String(64))

    def to_dict(self):
        data = {
            'id': self.id,
            'username': self.username,
            'password-hash': self.password,
            'token': self.token
        }
        return data

    def from_dict(dct):
        p = Person(
            id=dct['id'],
            username=dct['username'],
            password=dct['password-hash'],
            token=dct['token'])
        return p

    def add(_username, passwd):
        if Person.query.filter_by(username=_username).first():
            raise Exception('Person already exists!')
        p = Person(username=_username, password=generate_password_hash(passwd), token=token_urlsafe(32))
        redis_client.delete('people')
        db.session.add(p)
        db.session.commit()
        redis_client.set(p.token, json.dumps(p.to_dict()), ex=1800)
        return p

    def login(_username, passwd):
        p = Person.query.filter_by(username=_username).first()
        if not p:
            raise Exception('Person does not exist!')
        if not check_password_hash(p.password, passwd):
            raise Exception('Wrong Password!')
        t = token_urlsafe(32)
        if redis_client.get(p.token):
            redis_client.delete(p.token)
        if redis_client.get(p.token + '-tasks'):
            redis_client.delete(p.token + '-tasks')
        p.token = t
        redis_client.delete('people')
        db.session.commit()
        redis_client.set(p.token, json.dumps(p.to_dict()), ex=1800)
        return p

    def get(_token):
        redis_p = redis_client.get(_token)
        if redis_p:
            p = Person.from_dict(json.loads(redis_p))
        else:
            p = Person.query.filter_by(token=_token).first()
        if not p:
            raise Exception('Person does not exist')
        else:
            if not redis_p:
                redis_client.set(_token, json.dumps(p.to_dict()))
                redis_client.delete('people')
            return p

    def get_id(_id):
        p = Person.query.filter_by(id=_id).first()
        if not p:
            raise Exception('Person does not exist')
        else:
            return p

    def get_all():
        people = redis_client.get('people')
        if redis_client.get('people'):
            res = []
            people = json.loads(people)
            for p in people:
                res.append(Person.from_dict(p))
            return res
        else:
            people = list(Person.query.all())
            people_dcts = []
            for p in people:
                people_dcts.append(p.to_dict())
            redis_client.set('people', json.dumps(people_dcts), ex=60)
        return people

    def delete(_token):
        if redis_client.get(_token):
            redis_client.delete(_token)
        p = Person.query.filter_by(token=_token).first()
        if not p:
            raise Exception('Person does not exist')
        else:
            redis_client.delete('people')
            db.session.delete(p)
            db.session.commit()
            return 'Person deleted'
