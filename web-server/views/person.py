from flask import jsonify, request, abort
from models.person import Person

def routes(app):

    @app.route('/signup', methods=['POST'])
    def signup():
        """
        request (dict):
            {
                "username": str(),
                "password": str()
            }
        """
        try:
            _request = request.get_json(force=True)
            if not _request:
                abort(400)
            p = Person.add(
                str(_request['username']),
                str(_request['password']))
            return jsonify(p.to_dict())
        except Exception as e:
            raise e
            return jsonify({
                'e': e.__str__()
            }), 500

    @app.route('/login', methods=['POST'])
    def login():
        """
        request (dict):
            {
                "username": str(),
                "password": str()
            }
        """
        try:
            _request = request.get_json(force=True)
            if not _request:
                abort(400)
            response = Person.login(
                            str(_request['username']),
                            str(_request['password']))
            return jsonify(response.to_dict())
        except Exception as e:
            return jsonify({
                'e': e.__str__()
            }), 500

    @app.route('/person/<token>', methods=['GET'])
    def get_person(token):
        try:
            p = Person.get(token)
            return jsonify(p.to_dict())
        except Exception as e:
            return jsonify({
                'e': e.__str__()
            }), 500

    @app.route('/person/<token>', methods=['DELETE'])
    def delete_person(token):
        try:
            response = Person.delete(token)
            return jsonify(response)
        except Exception as e:
            return jsonify({
                'e': e.__str__()
            }), 500
