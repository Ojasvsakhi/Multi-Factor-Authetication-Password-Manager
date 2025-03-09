import { useCallback } from 'react';
import { Howl } from 'howler';

const sounds = {
  click: new Howl({
    src: ['https://assets.codepen.io/154874/click.mp3'],
    volume: 0.5,
  }),
  success: new Howl({
    src: ['https://assets.codepen.io/154874/success.mp3'],
    volume: 0.5,
  }),
  alert: new Howl({
    src: ['https://assets.codepen.io/154874/alert.mp3'],
    volume: 0.5,
  }),
};

export const useSound = () => {
  const playSound = useCallback((type: keyof typeof sounds) => {
    sounds[type].play();
  }, []);

  return { playSound };
};