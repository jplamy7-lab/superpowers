// Résilience réseau et tolérance aux pannes
import fs from 'fs';

function retry(fn, retries = 3, delay = 500) {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return fn();
    } catch (e) {
      lastError = e;
      if (i < retries - 1) {
        setTimeout(() => {}, delay);
      }
    }
  }
  throw lastError;
}

export function safeReadFile(filePath) {
  return retry(() => fs.readFileSync(filePath, 'utf8'));
}
