const express = require("express");
const fs = require('fs');
const http = require("http");
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const users = {};

io.on('connection', socket => {
  if (!users[socket.id]) {
      users[socket.id] = socket.id;
  }
  socket.emit("yourID", socket.id);
  io.sockets.emit("allUsers", users);
  socket.on('disconnect', () => {
      delete users[socket.id];
  })
  socket.on("callUser", (data) => {
      io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
  })
  socket.on("acceptCall", (data) => {
      io.to(data.to).emit('callAccepted', data.signal);
  })
  
});

app.post('/auth/register', (req, res) => {
  const {email, password, fullname} = req.body;
  fs.readFile("./users.json", (err, data) => {  
      if (err) {
        const status = 401
        const message = err
        res.status(status).json({status, message})
        return
      };
      let getUser = JSON.parse(data).users.find(el => el.email === email);    
      if (getUser === undefined) {
        var data = JSON.parse(data.toString());
        var last_item_id = data.users[data.users.length-1].id;
        data.users.push({id: last_item_id + 1, email: email, password: password, fullname:fullname}); //add some data
        var writeData = fs.writeFile("./users.json", JSON.stringify(data), (err, result) => {  // WRITE
            if (err) {
              const status = 401
              const message = err
              res.status(status).json({status, message})
              return
            }
        });
        const access_token = {access_token:Math.random().toString(36).substr(2)};
        res.status(200).json({access_token})
      }else{
        const status = 401;
        const message = 'Email and Password already exist';
        res.status(status).json({status, message});
        return
      }
  });
})
  
app.post('/auth/login', (req, res) => {
  const {email, password} = req.body;
  const access_token = {access_token:Math.random().toString(36).substr(2)};
  fs.readFile('./users.json', (err,data) => {
    if(err) throw err;
    let customers = JSON.parse(data);
    let getUser = JSON.parse(data).users.find(el => el.email === email);    
      if (getUser !== undefined) {
        if(getUser.password !== password){
          const status = 401
          const message = 'Incorrect email or password'
          res.status(status).json({status, message})
          return
        }else{
        res.status(200).json({access_token, name:getUser.fullname})
        }
      }else{
      const status = 401
      const message = 'Incorrect email or password'
      res.status(status).json({status, message})
      return
      }
  });
})

app.post('/new_message', (req, res) => {
  const {name, message,date} = req.body;
  fs.readFile('./chat.json', (err,data) => {
    if(err) throw err;
    let customers = JSON.parse(data);
    const agent = {
      id:Math.floor(Math.random() * 1000),
      name:name,
      message:message,
      date:date,
    };
    customers.push(agent);
    const jsonString = JSON.stringify(customers)
    fs.writeFile('./chat.json', jsonString, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
    res.send(customers);
  });
})
app.get('/all_chat_messages', (req, res) => {
  fs.readFile('./chat.json', (err,data) => {
      if(err) throw err;
      let messages = JSON.parse(data);
      res.send(messages);
  });
});
  
app.get('/acces_users', (req, res) => {
  fs.readFile('./users.json', (err,data) => {
      if(err) throw err;
      let users = JSON.parse(data);
      res.send(users);
  });
});

server.listen(8000, () => console.log('server is running on port 8000'));


