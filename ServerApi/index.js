const express = require('express');
const fs = require('fs');
const cors = require('cors');
const http = require("http");
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const port = 8000;
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
// Register New User
app.post('/auth/register', (req, res) => {
  const {email, password, fullname} = req.body;

  // if(isAuthenticated({email, password}) === true) {
  //   const status = 401;
  //   const message = 'Email and Password already exist';
  //   res.status(status).json({status, message});
  //   return
  // }
  
  fs.readFile("./users.json", (err, data) => {  
      if (err) {
        const status = 401
        const message = err
        res.status(status).json({status, message})
        return
      };
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
  });

  const access_token = {access_token:"dgdfgdfgdfgdfg"};
  console.log("Access Token:" + access_token);
  res.status(200).json({access_token})
})

app.post('/auth/login', (req, res) => {
  console.log("login endpoint called; request body:");
  const {email, password} = req.body;
  // if (isAuthenticated({email, password}) === false) {
  //   const status = 401
  //   const message = 'Incorrect email or password'
  //   res.status(status).json({status, message})
  //   return
  // }
  const access_token = {access_token:"dgdfgdfgdfgdfg"};
  console.log("Access Token:" + access_token);
  fs.readFile('./users.json', (err,data) => {
    if(err) throw err;
    let customers = JSON.parse(data);
    let getUser = JSON.parse(data).users.find(el => el.email === email);
    res.status(200).json({access_token, name:getUser.fullname})
  });
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});