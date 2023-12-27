import React, { useRef, useEffect, useState, useMemo } from 'react';
import './App.css';
import Countdown from './components/Countdown';
import Rick from './source/Rick.mp3';
import Gravity from './source/Gravity.mp3';
import Notification from './source/Notification.mp3';
import { io } from 'socket.io-client';
import { UlMensajes, LiMensaje, LiMensajePropio } from './ui-components';
import styled from 'styled-components';

const socket = io('https://provando.fly.dev');

const ConnectionStatus = styled.h2`
  color: ${({ isConnected }) => (isConnected ? 'limegreen' : 'lightcoral')};
`;

const CountdownContainer = styled.div`
  margin-bottom: 50px;
`;
const InputMensaje = styled.input`
  width: calc(100% - 60px);
  padding: 10px;
  border: 2px solid lightgrey;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const ChatContainer = styled.div`
  width: 90%;
  max-width: 600px;
  margin: 0 auto 10px; /* Márgenes superior e inferior de 10px y centrado horizontal */
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  background-color: rgba(70, 67, 66, 0.8);
  word-wrap: break-word;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
`;

const AudioButton = styled.button`
  padding: 10px;
  background-color: dodgerblue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: royalblue;
  }
`;

function App() {
  const targetDate = '2024-01-01T00:00:00Z';
  const audioRef = useRef(null);
  const notificationAudioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const audioFiles = useMemo(() => [Rick, Gravity], []);

  const [isConnected, setIsConnected] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);

  const enviarMensaje = () => {
    if (nuevoMensaje.trim() !== '') {
      socket.emit('chat_mensaje', {
        usuario: socket.id,
        mensaje: nuevoMensaje,
      });
      // Reproducir el sonido de notificación
      if (notificationAudioRef.current) {
        notificationAudioRef.current.play().catch((error) => {
          console.error('Error al reproducir el sonido de notificación:', error);
        });
      }
      setNuevoMensaje(''); // Limpiar el input después de enviar el mensaje
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && nuevoMensaje.trim() !== '') {
      enviarMensaje();
    }
  };  

  const playAudio = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((error) => {
        console.error('Error al reproducir el audio:', error);
      });
      setIsPlaying(true);
    }
  };

  const changeSong = (direction) => {
    let newIndex = direction === 'next' ? currentSong + 1 : currentSong - 1;
    if (newIndex < 0) {
      newIndex = audioFiles.length - 1;
    } else if (newIndex >= audioFiles.length) {
      newIndex = 0;
    }
    setCurrentSong(newIndex);
  };

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('chat_mensaje', (data) => {
      setMensajes((mensajes) => {
        const existMessage = mensajes.some(
          (mensaje) =>
            mensaje.usuario === data.usuario && mensaje.mensaje === data.mensaje
        );
        if (!existMessage) {
          return [...mensajes, data];
        }
        return mensajes;
      });
    });
    const audio = audioRef.current;
    audio.src = audioFiles[currentSong];
    audio.load();
    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Error al reproducir el audio:', error);
      });
    }
    return () => {
      socket.off('connect');
      socket.off('chat_message');
    };
  }, [currentSong, audioFiles, isPlaying]);

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200vh' }}>
      <h1 className="titulo-fijo">CUENTA REGRESIVA PARA AÑO NUEVO</h1>
      <div className="countdown-container">
        <CountdownContainer>
          <Countdown targetDate={targetDate} />
        </CountdownContainer>
      </div>
      
      
      <div className="chat-container">
      <ConnectionStatus isConnected={isConnected}>
        {isConnected ? 'CONECTADO' : 'NO CONECTADO'}
      </ConnectionStatus>;
        <ChatContainer>
          <UlMensajes>
            {mensajes.map((mensaje) => (
              mensaje.usuario === socket.id ? (
                <LiMensajePropio key={mensaje.id}>
                  {mensaje.usuario}: {mensaje.mensaje}
                </LiMensajePropio>
              ) : (
                <LiMensaje key={mensaje.id}>
                  {mensaje.usuario}: {mensaje.mensaje}
                </LiMensaje>
              )
            ))}
          </UlMensajes>
        </ChatContainer>
        
        <InputMensaje
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Escribe tu mensaje..."
        />
        
        <ButtonContainer>
          <AudioButton onClick={() => changeSong('previous')}>
            Anterior
          </AudioButton>
          <AudioButton onClick={playAudio}>
            {isPlaying ? 'Pausar audio' : 'Reproducir audio'}
          </AudioButton>
          <AudioButton onClick={() => changeSong('next')}>
            Siguiente
          </AudioButton>
        </ButtonContainer>
      </div>
      <audio ref={notificationAudioRef} src={Notification} style={{ display: 'none' }} />
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;