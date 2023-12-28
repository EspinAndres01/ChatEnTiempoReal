import React, { useRef, useState } from 'react';
import './memesSounds.css';

const MemesSounds = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRefUwU = useRef(null);
  const audioRefMeCorro = useRef(null);
  const audioRefYamete = useRef(null);

  const playMemeSound = (audioRef) => {
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((error) => {
        console.error('Error al reproducir el sonido:', error);
      });
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = (audioRef) => {
    setIsPlaying(false);
  };

  return (
    <div className="memes-sounds">
      <audio ref={audioRefUwU} src={require('../source/memesSounds/Hannah owo.mp3')} onEnded={() => handleAudioEnded(audioRefUwU)} />
      <button onClick={() => playMemeSound(audioRefUwU)}>
        UwU
      </button>
      
      <audio ref={audioRefMeCorro} src={require('../source/memesSounds/Me corro aaaaaaaaaah.mp3')} onEnded={() => handleAudioEnded(audioRefMeCorro)} />
      <button onClick={() => playMemeSound(audioRefMeCorro)}>
        Me Corro
      </button>
      
      <audio ref={audioRefYamete} src={require('../source/memesSounds/Anime Girl Yamete kudasai sound effec.mp3')} onEnded={() => handleAudioEnded(audioRefYamete)} />
      <button onClick={() => playMemeSound(audioRefYamete)}>
        Yamete kudasai
      </button>
    </div>
  );
};

export default MemesSounds;
