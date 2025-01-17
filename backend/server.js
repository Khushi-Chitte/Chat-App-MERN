const express = require('express');
const path = require('path')
const {chats} = require('./data/data');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes')
const {notFound,errorHandler} = require('./middlewares/errorMiddleware');
const messageRoutes = require('./routes/messageRoutes');


dotenv.config();
connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.get('/',(req,res)=>{
//     res.send("FIRST API CREATED SUCCESSFULLY")
// })

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);


//--------------DEPLOYMENT---------------//
const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname1,'/frontend/build')));
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname1,'frontend','build','index.html'));
    })
}else{
    app.get('/',(req,res)=>{
        res.send('API running succesfully')
    })
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000
const server = app.listen(PORT,()=>{
    console.log(`Server started at PORT: ${PORT}`.yellow.bold);
})

const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors:{
        origin: 'http://localhost:3000'
    }
})

io.on('connection',(socket)=>{
    console.log('connected to socket.io');

    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        socket.emit('connected');
    })

    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log('User Joined Room: '+room);
    })

    socket.on('typing',(room)=>socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))


    socket.on('new message',(newMessageReceived)=>{
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach((user) => {
            if(user.id == newMessageReceived.sender._id) return ;

            socket.in(user._id).emit('message recieved', newMessageReceived)
        });
    })
    socket.off('setup',()=>{
        console.log('User Disconnected');
        socket.leave(userData._id);
    })
})