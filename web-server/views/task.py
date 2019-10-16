from flask import jsonify, request, abort
from models.person import Person
from models.task import Task
from datetime import datetime as dt

def get_p_completed_t(p):
    tasks = Task.get_all(p.token)
    res = 0
    for t in tasks:
        if t['done']:
            res += 1
    return res

def routes(app):

    @app.route('/person/<token>/new_task', methods=['POST'])
    def add_task(token):
        """
            _request (dict): {
                'due' : str(YYYY-MM-DD),
                'title': str,
                'body': str,
                'important': bool(True/False),
            }
        """
        try:
            _request = request.get_json(force=True)
            if not _request:
                abort(400)
            due =  dt.strptime(_request['due'], '%Y-%m-%d')
            title = _request['title']
            body = _request['body']
            important = bool( _request['important'])
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
            raise e
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
            return jsonify(response), 200
        except Exception as e:
            return jsonify({
                'e': e.__str__()
            }), 500

    @app.route('/task/<token>', methods=['DELETE'])
    def delete_task(token):
        try:
            response = Task.delete(token)
            return jsonify(response), 200
        except Exception as e:
            raise e
            return jsonify({
                'e': e.__str__()
            }), 500

    @app.route('/person/<token>/tasks', methods=['GET'])
    def get_person_tasks(token):
        try:
            return jsonify({'tasks': Task.get_all(token)}), 200
        except Exception as e:
            return jsonify({'e': e.__str__()}), 500


    @app.route('/person/<token>/profile', methods=['GET'])
    def get_person_profile(token):
        try:
            p = Person.get(token)
            tasks = Task.get_all(token)
            cnt_tasks = len(tasks)
            imp_tasks = 0
            done_tasks = 0
            for t in tasks:
                if t['done']:
                    done_tasks += 1
                if t['important']:
                    imp_tasks += 1
            imp_p = 0
            done_p = 0
            if cnt_tasks != 0:
                imp_p = imp_tasks / cnt_tasks
                done_p = done_tasks / cnt_tasks
            res = {
                'tasks': cnt_tasks,
                'imp_tasks': imp_tasks,
                'done_tasks' : done_tasks,
                'imp_p': imp_p,
                'done_p': done_p,
                'user': p.username
            }
            return jsonify(res), 200
        except Exception as e:
            return jsonify({
                'e': e.__str__()
            }), 500

    @app.route('/leaderboard', methods=['GET'])
    def get_leaderboard():
        try:
            people = Person.get_all()
            people.sort(key=get_p_completed_t, reverse=True)
            if len(people) > 10:
                people = people[:10]
            res = []
            cnt = 1
            for p in people:
                res.append({
                    'user': p.username,
                    'tasks': get_p_completed_t(p),
                    'place': cnt
                })
                cnt += 1
            return jsonify({
                'leaderboard': res
            }), 200
        except Exception as e:
            return jsonify({
                'e': e.__str__()
            }), 500
