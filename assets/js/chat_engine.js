
class ChatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        
        // io is globally available when we included the cdn for socket
        this.socket = io('http://localhost:5000', { transports: ['websocket', 'polling', 'flashsocket'] });
        // console.log(this.userEmail);
        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;
        this.socket.on('connect',function(){
            console.log('Connection established using Socket!');

            self.socket.emit('join_room',{
                user_email: self.userEmail,
                chatroom: 'common_room'
            })
            self.socket.on('user_joined',function(user){
                console.log('A new user Joined',user);
            })
        });

        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();
            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: 'common_room'
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);


            let newMessage = $('<li>');

            let messageType = 'other-message';

            if (data.user_email == self.userEmail){
                messageType = 'self-message';
            }

            newMessage.append($('<span>', {
                'html': data.message
            }));

            newMessage.append($('<sub>', {
                'html': data.user_email
            }));

            newMessage.addClass(messageType);

            $('#chat-messages-list').append(newMessage);
        });
    };
};