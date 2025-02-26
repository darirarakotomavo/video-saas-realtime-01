const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Route de test
app.get('/', (req, res) => {
  res.send('Serveur SAAS Vidéo en marche !');
});

// Gestion des connexions Socket.io
io.on('connection', (socket) => {
  console.log('Nouvel utilisateur connecté :', socket.id);

  // Écoute l'événement 'video-share'
  socket.on('video-share', (data) => {
    console.log('Vidéo partagée :', data.url);
    socket.broadcast.emit('video-share', data); // Diffuse à tous sauf l’émetteur
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté :', socket.id);
  });
});

// Démarre le serveur
server.listen(5000, () => {
  console.log('Serveur démarré sur http://localhost:5000');
});