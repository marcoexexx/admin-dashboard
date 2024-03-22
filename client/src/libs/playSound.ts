const sounds = {
  success: "/audio/success.mp3",
  error: "/audio/error.mp3",
  denied: "/audio/denied.mp3",
};

export function playSoundEffect(sound: keyof typeof sounds) {
  const audio = new Audio(sounds[sound]);
  audio.play();
}
