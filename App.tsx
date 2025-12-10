import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Scene } from './components/Scene';
import { AppState } from './types';

// royalty free christmas music URL
const MUSIC_URL = "https://cdn.pixabay.com/audio/2022/12/20/audio_5174092b74.mp3"; 

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.TREE);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Interaction State Machine
  const handleInteraction = () => {
    // Start Audio on first interaction
    if (!hasInteracted && audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play()
        .then(() => setIsAudioPlaying(true))
        .catch(e => console.log("Audio autoplay blocked, waiting for interaction", e));
      setHasInteracted(true);
    }

    // Cycle States: Tree -> Explode -> Text -> Tree
    setAppState(prev => {
      if (prev === AppState.TREE) return AppState.EXPLODE;
      if (prev === AppState.EXPLODE) return AppState.TEXT;
      return AppState.TREE;
    });
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Audio Element */}
      <audio ref={audioRef} src={MUSIC_URL} loop />

      {/* Header UI */}
      <div className="absolute top-0 left-0 w-full z-10 pointer-events-none p-8 text-center flex flex-col items-center">
        <h1 className="serif-font text-4xl md:text-6xl text-[#ffd700] tracking-widest font-bold drop-shadow-[0_2px_10px_rgba(255,215,0,0.5)] animate-pulse">
          MERRY CHRISTMAS
        </h1>
        <p className="text-white/60 mt-4 text-sm md:text-base font-light font-sans max-w-md">
          Tap the tree to interact • Drag to rotate
        </p>
      </div>

      {/* Audio Control */}
      <button 
        onClick={toggleAudio}
        className="absolute bottom-6 right-6 z-20 text-white/50 hover:text-[#ffd700] transition-colors bg-black/30 p-2 rounded-full backdrop-blur-sm border border-white/10"
      >
        {isAudioPlaying ? (
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
             <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
           </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 21 12l-3.75 2.25m-6-2.25 6-3.75 6 3.75" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m-3.75 2.25 3.75-2.25M3 3l18 18" />
          </svg>
        )}
      </button>

      {/* 3D Canvas */}
      <Canvas 
        shadows
        dpr={[1, 2]} 
        camera={{ position: [0, 0, 30], fov: 50 }}
        gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}
      >
        <Scene appState={appState} onSceneClick={handleInteraction} />
      </Canvas>
    </div>
  );
}