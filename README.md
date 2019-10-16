# task-manager
Simple task management web app for demonstrating Flask, React, and Redis

Choose a branch (redis / flask / react) as a starting point and then build up to master.

# Dependencies:

Python3:
* Flask, FlaskSQLAlchemy, FlaskCORS, FlaskRedis

Node:
* npm, react, react-bootstrap, react-datepicker, dateformat

Redis (some version)

Current database is Postgresql, but that can by changed easily in FlaskSQLAlchemy to any SQL db.

# Running instructions

Terminal one -> navigate to /task-mngr -> run npm start

Terminal two -> navigate to /web-server -> export FLASK_APP=app.py -> flask run

Make sure to have Redis and Postgres running in the background (either on separate terminals or as services)
