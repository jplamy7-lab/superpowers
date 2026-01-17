// Sécurité renforcée pour les hooks/scripts
import fs from 'fs';

export function validateInput(input) {
  if (typeof input !== 'string' || input.length > 1000 || /[<>]/.test(input)) {
    throw new Error('Entrée non sécurisée');
  }
  return input;
}

export function checkAccess(user, action) {
  // Exemple simple, à adapter selon le système d’authentification
  if (user !== 'admin' && action === 'run-hook') {
    throw new Error('Accès refusé');
  }
  return true;
}
