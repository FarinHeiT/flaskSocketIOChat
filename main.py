from flask import Flask, render_template, redirect, url_for
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'topsecret'
socketio = SocketIO(app)


@app.route('/')
def sessions():
	chat_history = list(map(lambda x: x.split(), open('history.txt').read().split('\n')))[:-1]
	print(chat_history)
	return render_template('session.html', chat_history=chat_history)


def messageRecieved(methods=('GET', 'POST')):
	print('msg was recieved!')

def saveMessage(json):
	with open('history.txt', 'a') as f:
		f.write(json['user_name'] + ' ' + json['message'] + '\n')


@socketio.on('connection')
def connection(json):
	print('New user connected!' + str(json))


@socketio.on('sendmsg')
def recieve_msg(json, methods=('GET', 'POST')):
	print('recieved new MESSAGE: ' + str(json))
	saveMessage(json)
	socketio.emit('display_msg', json, callback=messageRecieved)


@app.route('/clearChat')
def clear_chat():
	open('history.txt', 'w').close()
	socketio.emit('clearChat')
	return redirect(url_for('sessions'))


if __name__ == '__main__':
	socketio.run(app, debug=True)


