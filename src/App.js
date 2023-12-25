import React, { useRef, useEffect, useState, useMemo } from 'react';
import './App.css';
import Countdown from './components/Countdown';
import Rick from './source/Rick.mp3';
import Gravity from './source/Gravity.mp3';
import { io } from 'socket.io-client';
import { LiMensaje, UlMensajes } from './ui-components';

const socket = io('http://localhost:3000');

function App() {
  const targetDate = '2024-01-01T00:00:00Z';
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const audioFiles = useMemo(() => [Rick, Gravity], []);

  const [isConnected, setIsConnected] = useState(false);
  const [nuevoMensaje,setNuevoMensaje]=useState('');
  const [mensajes,setMensajes]=useState([]);
  const enviarMensaje = () => {
    socket.emit('chat_mensaje', {
      usuario: socket.id,
      mensaje: nuevoMensaje
    });
  }
  

  const playAudio = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(error => {
        console.error('Error al reproducir el audio:', error);
      });
      setIsPlaying(true);
    }
  };

  const changeSong = direction => {
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
      setMensajes(mensajes => [...mensajes, data]);
    });

    
    const audio = audioRef.current;
    audio.src = audioFiles[currentSong];
    audio.load();
    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Error al reproducir el audio:', error);
      });
    }
    return () => {
      socket.off('connect');
      socket.off('chat_message');
    }
  }, [currentSong, audioFiles, isPlaying,mensajes]);

  return (
    <div className="App">
      <h1 className="titulo-fijo">CUENTA REGRESIVA PARA AÑO NUEVO</h1>
      <h2>{isConnected ? 'CONECTADO' : 'NO CONECTADO'}</h2>
      <UlMensajes>
        {mensajes.map(mensaje => (
          <LiMensaje>{mensaje.usuario}: {mensaje.mensaje}</LiMensaje>
        ))}
      </UlMensajes>
      <input
        type="text"
        onChange={e => setNuevoMensaje(e.target.value)}
      />
      <button onClick={enviarMensaje}>Enviar</button>
      <Countdown targetDate={targetDate} />
      <audio ref={audioRef} style={{ display: 'none' }} />

      <div className="button-container">
        <button onClick={() => changeSong('previous')} className="button-style-previous">
          Anterior
        </button>
        <button onClick={playAudio} className="button-style">
          {isPlaying ? 'Pausar audio' : 'Reproducir audio'}
        </button>
        <button onClick={() => changeSong('next')} className="button-style-next">
          Siguiente
        </button>
      </div>
    </div>
  );

}

export default App;
