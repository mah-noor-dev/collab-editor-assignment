// Socket connection - localhost pe connect karo
const socket = io('http://localhost:3000');

let currentUsers = {};

// Initialize editor
function initEditor() {
    const textarea = document.getElementById('code-editor');
    const editor = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true,
        mode: 'javascript',
        theme: 'default',
        lineWrapping: true,
        autofocus: true,
        value: "// Loading...\n"
    });
    
    // Listen for changes
    editor.on('change', (instance, change) => {
        const position = editor.indexFromPos(change.from);
        const text = change.text.join('\n');
        
        const operation = {
            position: position,
            text: text,
            type: 'insert',
            userId: socket.id
        };
        
        // Send to server
        socket.emit('change', operation);
    });
    
    // Track cursor
    editor.on('cursorActivity', () => {
        const cursor = editor.getCursor();
        const position = editor.indexFromPos(cursor);
        socket.emit('cursor', position);
    });
    
    // Handle incoming changes
    socket.on('remote-change', (change) => {
        if (change.userId !== socket.id) {
            const pos = editor.posFromIndex(change.position);
            editor.replaceRange(change.text, pos, pos);
        }
    });
    
    // Handle init
    socket.on('init', (data) => {
        editor.setValue(data.content);
        document.getElementById('my-name').textContent = data.userName;
    });
    
    // Handle users list
    socket.on('users', (users) => {
        currentUsers = users;
        updateUserList();
    });
    
    // Handle cursor updates
    socket.on('user-cursor', (data) => {
        updateCursor(data.id, data.position, data.color);
    });
    
    // Connection status
    socket.on('connect', () => {
        document.getElementById('status').textContent = 'Connected';
        document.getElementById('status').className = 'connected';
    });
    
    socket.on('disconnect', () => {
        document.getElementById('status').textContent = 'Disconnected';
        document.getElementById('status').className = 'disconnected';
    });
}

function updateUserList() {
    const list = document.getElementById('user-list');
    list.innerHTML = '';
    
    Object.entries(currentUsers).forEach(([id, user]) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="user-color" style="background:${user.color}"></span>
            ${user.name} ${id === socket.id ? '<em>(You)</em>' : ''}
        `;
        list.appendChild(li);
    });
}

function updateCursor(userId, position, color) {
    // For simplicity, show in console
    console.log(`User ${userId} at position ${position}`);
}

// Initialize when page loads
window.onload = initEditor;