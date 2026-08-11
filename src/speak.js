// Keep a reference so the utterance isn't garbage-collected mid-speech (Chrome bug).
let currentUtterance = null;

export function speakWord(text) {
  const synth = window.speechSynthesis;
  if (!synth || !text) return;

  // Chrome sometimes leaves the synth paused after the tab is idle/backgrounded.
  synth.cancel();
  if (synth.paused) synth.resume();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  currentUtterance = utterance;

  // Voices load asynchronously; if none are ready yet, wait for them once.
  if (synth.getVoices().length === 0) {
    synth.addEventListener("voiceschanged", () => synth.speak(utterance), {
      once: true,
    });
  } else {
    synth.speak(utterance);
  }
}
