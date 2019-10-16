from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from util.db_login import db_uri
from flask_redis import FlaskRedis

def set_routes(app):
    import views.person as person
    import views.task as task
    person.routes(app)
    task.routes(app)

app = Flask(__name__)
CORS(app)
app.config['CORS_ORIGINS'] = ['http://localhost:5000']
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri()
app.config['REDIS_URL'] = "redis://localhost:6379"
redis_client = FlaskRedis(app)
db = SQLAlchemy(app)

set_routes(app)
