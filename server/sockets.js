module.exports = (server) =>{
	const
		io = require('socket.io')(server),
		moment = require('moment')
	
	let users = []

	const messages = []
	
	//When the page is loaded in the browser the `connection` event is fired
	io.on('connection', socket =>{
	
		//On making a `connection`, load in the content already present on the server
		socket.emit('refresh-messages', messages)
		socket.emit('refresh-users', users)
		socket.emit('refresh-err-message')
		
		socket.on('join-user', userName =>{
			io.emit('failed-join', false)

			const user ={
				id: socket.id,
				name: userName,
				avatar: "http://robohash.org/" + socket.id,
				welcome: true
			}

			if(users.length < 1){
				users.push(user)
				io.emit('successful-join', user)
			}else{
				let exists = false

				users.forEach(user =>{
					if(user.name.toUpperCase() === userName.toUpperCase()){
						exists = true
						return
					}
				})

				if(exists){
					io.emit('failed-join', true)
				}else{
					users.push(user)
					io.emit('successful-join', user)
				}
			}
		})
		
		socket.on('send-message', data =>{
			const content ={
				user: data.user,
				message: data.message,
				date: moment(new Date()).format('MM/DD/YY h:mm a'),
				avatar: "http://robohash.org/" + data.user.id
			}
			messages.push(content)
			
			io.emit('successful-message', content)
		})
		
		socket.on('disconnect', () =>{
			users = users.filter(user =>{
			    return user.id != socket.id
			})
			
			io.emit('refresh-users', users)
		})
	})
}
