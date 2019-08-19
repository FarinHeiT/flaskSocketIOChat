$('#clear_chat').on('click', function() {
	location.href=document.location + '/clearChat'
});

var socket = io.connect('http://' + document.domain + ':' + location.port);

// Global var for storing username
var user_name;

// Execute when page is loaded
$('document').ready(function() {
//  IF username is already in cookies - load it, else - enter username
if (document.cookie.split(';').length > 1) {
	user_name = document.cookie.split(';')[1].split('=')[1]
	$('.username').attr('disabled', 'disabled')
	$('input.username').val(user_name)
} else {
	document.cookie='username=' + $('.username').val() + ';'
	user_name = $('input.username').val();
}
});

socket.on('connect', function(){
	socket.emit('connection', {
		data: 'User connected'
	});

	var form = $('form').on('submit', function(e){
		e.preventDefault()
		let user_input = $('input.message').val()
		socket.emit('sendmsg', {
			user_name: user_name,
			message: user_input
		});
		$('input.message').val('').focus('')
		$('.username').attr('disabled', 'disabled')
	});
});

socket.on('display_msg', function(msg){
	console.log(msg);
	if (typeof msg.user_name != 'undefined') {
		$('h3').remove()
		$('#chat').append('<li class="list-group-item"><b>' + msg.user_name + '</b><br>' + msg.message + '</li>')	
		$('#chat').stop().animate ({
			scrollTop: $('#chat')[0].scrollHeight
		});
	}
});

socket.on('clearChat', function() {
	location.reload()
});
