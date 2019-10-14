from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from util.db_login import db_uri

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = db_uri()
db = SQLAlchemy(app)
