#!/usr/bin/python3
import socket
import sys


def sendPacket(message, port):
    # Create a TCP/IP socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    # Connect the socket to the port where the server is listening
    server_address = ('192.168.88.38', port)
    print('connecting to %s port %s' % server_address)
    sock.connect(server_address)
    try:
        # Send data
        print('sending "%s"' % message)
        sock.sendall(bytearray(message.encode()))

        data = sock.recv(16)
        print('received "%s"' % data)

    finally:
        print('closing socket')
        sock.close()


if __name__ == "__main__":
    if sys.argv.__contains__("on"):
        sendPacket('FANON', 6464)
    if sys.argv.__contains__("off"):
        sendPacket('FANOFF', 6464)
