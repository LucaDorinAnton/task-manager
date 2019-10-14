from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from secrets import token_urlsafe

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

    def add(_username, passwd):
        if Person.query.filter_by(username=_username).first():
            raise Exception('Person already exists!')
        p = Person(username=_username, password=generate_password_hash(password))
        db.session.add(p)
        db.session.commit(p)
        return 'Person added'

    def login(_username, passwd):
        p = Person.query.filter_by(username=_username).first()
        if not p:
            raise Exception('Person does not exist!')
        if not check_password_hash(p.password, passwd):
            raise Exception('Wrong Password!')
        t = token_urlsafe(64)
        p.token = t
        db.session.add(p)
        db.session.commit()
        return p

    def get(_token):
        p = Person.query.filter_by(token=_token).first()
        if not p:
            raise Exception('Person does not exist')
        else return p

    def get_id(_id):
        p = Person.query.filter_by(id=_id).first()
        if not p:
            raise Exception('Person does not exist')
        else return p

    def delete(_token):
        p = Person.query.filter_by(token=_token).first()
        if not p:
            raise Exception('Person does not exist')
        else:
            db.session.delete(p)
            db.session.commit()
            return 'Person deleted'
