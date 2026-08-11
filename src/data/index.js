import myWords from "./my-words.json";
import carolineWords from "./caroline-words.json";

// Static word sources bundled at build time (GitHub Pages has no backend).
const SOURCES = {
  my: myWords,
  caroline: carolineWords,
};

const storageKey = (source) => `vocab-added-${source}`;

function loadAdded(source) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(source))) || [];
  } catch {
    return [];
  }
}

// Returns the bundled words plus any words the user added locally.
export function getWords(source) {
  const base = SOURCES[source] || SOURCES.my;
  return [...base, ...loadAdded(source)];
}

// Persists a new word in localStorage and returns the created record.
export function addWord(source, { english, russian, armenian }) {
  const all = getWords(source);
  const newWord = {
    id: all.length ? Math.max(...all.map((w) => w.id)) + 1 : 1,
    english: english.trim(),
    russian: russian.trim(),
    armenian: armenian.trim(),
  };
  const added = [...loadAdded(source), newWord];
  localStorage.setItem(storageKey(source), JSON.stringify(added));
  return newWord;
}
