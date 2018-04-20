//Welcome Login Component
const welcomeLogIn ={
	props: ['user'],
	template: `<div>
			<p v-show="user.welcome">
				<img :src="user.avatar" class="circle" width="45px">
				<span><strong>Welcome, {{user.name}}!</strong></span>
			</p>
		</div>`
}

//Chat Component
const chatComponent ={
	props: ['content'],
	template: `<div class="chat-box">
			<p v-for="data in content">
				<img :src="data.avatar" class="circle" width="30px">
				<span><strong>{{data.user.name}}</strong> <small>{{data.date}}</small><span>
				<br />
				{{data.message}}
			</p>
		</div>`
}

//Users Component
const usersComponent ={
	props: ['users'],
	template: `<div class="user-list">
		<h6>Active Users ({{users.length}})</h6>
		<ul v-for="user in users">
			<li>
				<span>{{user.name}}</span>
			</li>
			<hr>
		</ul>
		</div>`
}

//Welcome Component
const socket = io()
const app = new Vue({
	el: '#chat-app',
	data:{
		loggedIn: false,
		//Username exists
		logInErr: false,
		//Welcome message
		welcome: false,
		userName: '',
		user: {},
		users: [],
		message: '',
		messages: []
	},
	methods:{
		joinUser: function(){
			if (!this.userName)
				return
			
			socket.emit('join-user', this.userName)
		},
		sendMessage: function(){
			if (!this.message)
				return
			
			socket.emit('send-message', {message: this.message, user: this.user})
		}
	},
	components:{
		'users-component': usersComponent,
		'chat-component': chatComponent,
		'welcome-login': welcomeLogIn
	}
})


//Client Side Socket Event
socket.on('refresh-messages', messages =>{
	app.messages = messages
})
socket.on('refresh-users', users =>{
	app.users = users
})

socket.on('successful-join', user =>{
	//The `successful-join` event is emitted on all connections (open browser windows),
	// so we need to ensure the loggedIn is set to true and user is set for matching user only
	if (user.name === app.userName){
		app.user = user
		app.loggedIn = true
		app.welcome = true
	}
	
	app.users.push(user)
})

socket.on('successful-message', content =>{
	//Clear the message after success send
	app.message = ''
	app.messages.push(content)
})

socket.on('failed-join', failed =>{
	app.logInErr = failed
})
