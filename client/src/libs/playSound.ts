const sounds = {
  success: "../../public/audio/success.mp3",
  error: "../../public/audio/error.mp3",
  denied: "../../public/audio/denied.mp3",
}


export function playSoundEffect(sound: keyof typeof sounds) {
  const audio = new Audio(sounds[sound])
  audio.play()
}
