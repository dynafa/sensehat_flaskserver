#!/var/www/sh_server/flask-venv/bin/python3

import subprocess
import io
import base64
import os
from flask import Flask, abort, request, jsonify, g, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth
from passlib.apps import custom_app_context as pwd_context
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
from sense_hat import SenseHat
from flask import Flask
from flask import request
from flask import render_template
from flask import jsonify
from flask import make_response
import numpy as np
from pgdb import connect

# initialization
app = Flask(__name__)
app.config['SECRET_KEY'] = 'Taiyanggongchangpingqu'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# extensions
db = SQLAlchemy(app)
auth = HTTPBasicAuth()
sense = SenseHat()

from pgdb import connect
import sense_hat
import time
# Create new user
# curl -i -X POST -H "Content-Type: application/json" -d '{"username":"python","password":"python"}' https://192.168.88.12/api/users -k


# Dew point calculation
a = 17.271
b = 237.7  # degC


def dewpoint_approximation(T, RH):
    Td = (b * gamma(T, RH)) / (a - gamma(T, RH))
    return Td


def gamma(T, RH):
    g = (a * T / (b + T)) + np.log(RH / 100.0)
    return g


class DBobject:
    def __init__(self):
        self.con = connect(database='sensordata',
                      host='127.0.0.1:5432',
                      user='postgres',
                      password='sensehat1234')
        self.cursor = self.con.cursor()

    def closeconnection(self):
        self.cursor.close()
        self.con.close()

    def get_data(self, ID):
        query = "select * from sensorvalues where id=%d" % ID
        try:
            value = tuple(self.cursor.execute(query).fetchone())
            self.con.commit()
            return value
        except TypeError:
            return "Error"

    def get_count(self):
        query = "select count(*) from sensorvalues"
        value = tuple(self.cursor.execute(query).fetchone())
        self.con.commit()
        return value

    def insertData(self):
        temp = sense.get_temperature()
        humidity = sense.get_humidity()
        data = "insert into sensorvalues values(nextval('sensorvalues_id_seq'),'%s','%s','%s','%s','%s','%s','%s')" \
               % (str(temp),
                  str(sense.get_pressure()),
                  str(sense.get_temperature_from_pressure()),
                  str(sense.get_temperature_from_humidity()),
                  str(humidity),
                  str(sense.get_compass()),
                  str(dewpoint_approximation(temp, humidity)))
        self.cursor.execute(data)
        self.con.commit()

    def createtable(self):
        erasetable = "DROP TABLE IF EXISTS sensorvalues"
        self.cursor.execute(erasetable)
        self.con.commit()
        external_temp = "CREATE TABLE sensorvalues(id serial PRIMARY KEY," \
                        "temp numeric(8, 6)," \
                        "pressure numeric(10, 6)," \
                        "temp_p numeric(8, 6)," \
                        "temp_h numeric(8, 6)," \
                        "humidity numeric(8, 6)," \
                        "compass numeric(10, 6)," \
                        "dew_point numeric(10, 6)" \
                        ");"
        self.cursor.execute(external_temp)
        self.con.commit()


class Fan:
    def __init__(self, state):
        self.state = state


dbObj = DBobject()
fan = Fan('off')


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), index=True)
    password_hash = db.Column(db.String(64))

    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)

    def generate_auth_token(self, expiration=600):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.id})

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None    # valid token, but expired
        except BadSignature:
            return None    # invalid token
        user = User.query.get(data['id'])
        return user


@auth.error_handler
def unauthorized():
    return make_response(jsonify({'error': 'Unauthorized access'}), 401)


@auth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token
    user = User.verify_auth_token(username_or_token)
    if not user:
        # try to authenticate with username/password
        user = User.query.filter_by(username=username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True


@app.route('/api/users', methods=['POST'])
def new_user():
    username = request.json.get('username')
    password = request.json.get('password')
    if username is None or password is None:
        abort(400)    # missing arguments
    if User.query.filter_by(username=username).first() is not None:
        abort(400)    # existing user
    user = User(username=username)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    return (jsonify({'username': user.username}), 201,
            {'Location': url_for('get_user', id=user.id, _external=True)})


@app.route('/api/users/<int:id>')
@auth.login_required
def get_user(id):
    user = User.query.get(id)
    if not user:
        abort(400)
    return jsonify({'username': user.username})


@app.route('/api/token')
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token(600)
    return jsonify({'token': token.decode('ascii'), 'duration': 600})


def setpix(x, y, r, g, b):
    sense.set_pixel(x, y, r, g, b)


@app.route('/api/confirmlogin')
@auth.login_required
def confirmLogin():
    return jsonify({'user': g.user.username})


@app.route("/", methods=['GET', 'POST'])
@auth.login_required
def viewdataconsole():
    if request.method == 'GET':
        return render_template('data_console.html')


@app.route("/api/41293487123049/setpixel", methods=['POST'])
def setPixel():
    if request.method == 'POST':
        a = request.json
        setpix(a['x'], a['y'], int(a['r']), int(a['g']), int(a['b']))
        return "done"


@app.route('/api/get/sensedata/<int:id>')
def get_sensedata(id):
    if request.method == 'GET':
        data = dbObj.get_data(id)
        try:
            sense_data = {'temp': str(data[1]),
                          'pressure': str(data[2]),
                          'temp_p': str(data[3]),
                          'temp_h': str(data[4]),
                          'humidity': str(data[5]),
                          'compass': str(data[6]),
                          'dew_point': str(data[7]),
                          }
            return jsonify(sense_data)
        except IndexError:
            return make_response(jsonify({"error": "Value doesn't exist"})), 403


@app.route('/api/count/sensedata/')
def get_count():
    if request.method == 'GET':
        count_data = {'count': dbObj.get_count()[0]}
        return jsonify(count_data)


@app.route("/api/current/sensedata", methods=['GET'])
def sendData():
    temp = sense.get_temperature()
    pressure = sense.get_pressure()
    temp_p = sense.get_temperature_from_pressure()
    temp_h = sense.get_temperature_from_humidity()
    humidity = sense.get_humidity()
    north = sense.get_compass()
    raw = sense.get_compass_raw()
    dew_point = dewpoint_approximation(temp, humidity)
    # gyro_only = sense.get_gyroscope()
    # accel_only = sense.get_accelerometer()
    # orientation = sense.get_orientation_degrees()
    if request.method == 'GET':
        sense_data = {'temp': temp,
                      'pressure': pressure,
                      'temp_p': temp_p,
                      'temp_h': temp_h,
                      'humidity': humidity,
                      'compass_raw': raw,
                      'compass': north,
                      'dew_point': dew_point,
                      # 'orientation': orientation,
                      # 'gyro': gyro_only,
                      # 'accel': accel_only,
                      }
        return jsonify(sense_data)


@app.route("/api/fanstate", methods=['GET'])
def sendFanstate():
    if request.method == 'GET':
        fanstate = {'state': fan.state}
        return jsonify(fanstate)


@app.route("/api/switchon", methods=['GET'])
@auth.login_required
def testSwitchon():
    if request.method == 'GET':
        for x in range(0, 8):
            for y in range(0, 8):
                sense.set_pixel(y, x, (y * 24), 0, (x * 32))
                time.sleep(0.01)
        subprocess.run('./socket_client.py on', shell=True)
        fan.state = 'on'
        return str("ON")


@app.route("/api/switchoff", methods=['GET'])
@auth.login_required
def testSwitchoff():
    if request.method == 'GET':
        for y in range(0, 8):
            for x in range(0, 8):
                sense.set_pixel(x, y, 0, 0, 0)
                time.sleep(0.01)
        subprocess.run('./socket_client.py off', shell=True)
        fan.state = 'off'
        return str("OFF")


if __name__ == "__main__":
    if not os.path.exists('db.sqlite'):
        db.create_all()
    # port = 5000
    # if port == 5000:
    #     app.debug = True
    # app.run(host='0.0.0.0', port=port)
    app.run()
