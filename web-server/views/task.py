from flask import jsonify, request, abort
from models.person import Person
from models.task import Task
from datetime import datetime as dt

def routes(app):

    @app.route('/person/<token>/new_task', methods=['POST'])
    def add_task(token):
        """
            _request (dict): {
                'due' : str(YYYY-MM-DD),
                'title': str,
                'body': str,
                'important': str(true/false),
            }
        """
        try:
            _request = request.get_json()
            if not _request:
                abort(400)
            due =  dt.strptime(_request['due'], '%Y-%m-%d')
            title = _request['title']
            body = _request['body']
            important = True if _request['important'] == 'true' else False
            done = False
            dct = {
                'owner_token': token,
                'due' : due,
                'title': title,
                'body': body,
                'important': important,
                'done': False
            }
            t = Task.add(dct)
            return jsonify(t.to_dict()), 200
        except Exception as e:
            return jsonify({'e' : e.__str__()}), 500


    @app.route('/task/<token>', methods=['GET'])
    def get_task(token):
        try:
            t = Task.get(token)
            return jsonify(t.to_dict()), 200
        except Exception as e:
            return jsonify({
                'e': e.__str__()
            }), 500

    @app.route('/task/<token>/toggle', methods=['PUT'])
    def toggle_task(token):
        try:
            response = Task.toggle_done(token)
            return response, 200
        except Exception as e:
            return jsonify({
                'e': e.__str__()
            }), 500

    @app.route('/task/<token>', methods=['DELETE'])
    def delete_task(token):
        try:
            response = Task.delete(token)
            return response, 200
        except Exception as e:
            return jsonify({
                'e': e.__str__()
            }), 500
