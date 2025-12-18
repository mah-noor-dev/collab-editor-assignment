const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: "*" }
});

let document = {
  content: "// Start coding collaboratively!\n// Open in multiple browsers to test.\n",
  users: {}
};

io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);
  
  // Assign user name
  const userName = `User${Object.keys(document.users).length + 1}`;
  document.users[socket.id] = { 
    name: userName, 
    cursor: 0,
    color: getRandomColor()
  };
  
  // Send initial data
  socket.emit('init', {
    content: document.content,
    userName: userName
  });
  
  // Send user list to all
  io.emit('users', document.users);
  
  // Handle text changes
  socket.on('change', (change) => {
    console.log('Change from', socket.id, change);
    
    // Simple conflict resolution
    let finalChange = { ...change };
    
    // Apply to document
    document.content = applyChange(document.content, finalChange);
    
    // Broadcast to others
    socket.broadcast.emit('remote-change', {
      ...finalChange,
      userId: socket.id
    });
  });
  
  // Handle cursor movement
  socket.on('cursor', (position) => {
    document.users[socket.id].cursor = position;
    socket.broadcast.emit('user-cursor', {
      id: socket.id,
      position: position,
      color: document.users[socket.id].color
    });
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
    delete document.users[socket.id];
    io.emit('users', document.users);
  });
});

function applyChange(content, change) {
  const { position, text } = change;
  return content.slice(0, position) + text + content.slice(position);
}

function getRandomColor() {
  const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#EF476F'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Serve static files
app.use(express.static(__dirname + '/client'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    users: Object.keys(document.users).length,
    documentLength: document.content.length
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Open: http://localhost:${PORT}`);
  console.log(`👥 Test: Open in multiple browsers/windows`);
});