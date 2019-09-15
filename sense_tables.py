#!/var/www/sh_server/flask-venv/bin/python3

from pgdb import connect
import sense_hat
import time
import numpy as np
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


sense = sense_hat.SenseHat()
db = DBobject()
# db.createtable()
mybool = True

while mybool:
    db.insertData()
    time.sleep(30)
