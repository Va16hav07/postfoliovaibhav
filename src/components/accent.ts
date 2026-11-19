export const ACCENTS = [
  { id: 'blue', label: 'Blue', swatch: '#0a84ff' },
  { id: 'green', label: 'Green', swatch: '#30d158' },
  { id: 'purple', label: 'Purple', swatch: '#bf5af2' },
  { id: 'orange', label: 'Orange', swatch: '#ff9f0a' },
  { id: 'pink', label: 'Pink', swatch: '#ff375f' },
] as const;

export type AccentId = (typeof ACCENTS)[number]['id'];

export function getAccent(): AccentId {
  return (document.documentElement.dataset.accent as AccentId) || 'blue';
}

export function setAccent(id: AccentId) {
  if (id === 'blue') delete document.documentElement.dataset.accent;
  else document.documentElement.dataset.accent = id;
  localStorage.setItem('accent', id);
  window.dispatchEvent(new Event('accentchange'));
}
