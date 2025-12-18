# Real-Time Collaborative Code Editor

## Assignment #1 - Complex Web Technologies
**COMSATS University Islamabad, Sahiwal Campus**

### Features
1. **Real-time Collaboration**: Multiple users can edit simultaneously
2. **Conflict Resolution**: Operational Transformation (OT) algorithm
3. **WebSocket Communication**: Real-time synchronization
4. **Cursor Tracking**: Live cursor positions of all users
5. **Collaborative Undo/Redo**: Basic undo functionality

### Architecture
Client (Browser) ↔ WebSocket ↔ Server (Node.js)
↑ ↑
CodeMirror Operational Transformation
Editor ↓
Conflict Resolution

text

### Conflict Resolution Strategy
**Operational Transformation (OT)**:
- When users edit same position, operations are transformed
- Transformation rules:
  1. If operations are at same position, second operation is shifted
  2. Deletion operations adjust positions accordingly
  3. Server maintains operation history for consistency

### How to Run
1. **Install dependencies**:
   ```bash
   cd server
   npm install
Start server:

node server.js
Open client:

Open client/index.html in browser

Open same URL in another browser/window for testing

Technologies Used
Frontend: HTML, CSS, JavaScript, CodeMirror

Backend: Node.js, Express

Real-time: Socket.io

OT Algorithm: ShareDB implementation


## **Git Commands:**

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Complete Collaborative Code Editor Assignment"

# Create GitHub repo and push
git remote add origin https://github.com/mah-noor-dev/collab-editor-assignment.git
git branch -M main
git push -u origin main