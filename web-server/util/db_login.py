DB_USER='postgres'
DB_PW='password'
DB_HOST='127.0.0.1'
DB_PORT='5432'
DB_NAME='taskmngr'

SQLALCHEMY_DATABASE_URI = 'postgres+psycopg2://{}:{}@{}:{}/{}'.format(
        DB_USER, DB_PW, DB_HOST, DB_PORT, DB_NAME)

def db_uri():
    return SQLALCHEMY_DATABASE_URI
