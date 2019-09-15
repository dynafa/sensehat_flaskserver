#!/usr/bin/env python3
import RPi.GPIO as GPIO
import socket

GPIO.setmode(GPIO.BOARD)
GPIO.setup(36, GPIO.OUT)

sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# Bind the socket to the port
server_address = ('192.168.88.38', 6464)
print('starting up on %s port %s' % server_address)
sock.bind(server_address)
# Listen for incoming connections
sock.listen(1)
while True:
    # Wait for a connection
    print('waiting for a connection')
    connection, client_address = sock.accept()
    try:
        print('connection from', client_address)
        # Receive the data in small chunks and retransmit it
        while True:
            data = connection.recv(16)
            print('received "%s"' % data)
            if data:
                print('sending data back to the client')
                connection.sendall(data)
                datastring = data.decode("utf-8")
                print("DS: ", datastring)
                if datastring.__contains__('FANON'):
                    GPIO.output(36, 1)
                if datastring.__contains__('FANOFF'):
                    GPIO.output(36, 0)
            else:
                print('no more data from', client_address)
                break

    finally:
        # Clean up the connection
        connection.close()
