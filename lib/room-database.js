// Room Database - stockage local JSON
import fs from 'fs';
const DB_PATH = 'room-database.json';

export function getRooms() {
  if (!fs.existsSync(DB_PATH)) return [];
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

export function addRoom(room) {
  const rooms = getRooms();
  rooms.push(room);
  fs.writeFileSync(DB_PATH, JSON.stringify(rooms, null, 2));
}

export function findRoomByName(name) {
  return getRooms().find(r => r.name === name);
}

export function updateRoom(name, updates) {
  const rooms = getRooms().map(r => r.name === name ? { ...r, ...updates } : r);
  fs.writeFileSync(DB_PATH, JSON.stringify(rooms, null, 2));
}

export function deleteRoom(name) {
  const rooms = getRooms().filter(r => r.name !== name);
  fs.writeFileSync(DB_PATH, JSON.stringify(rooms, null, 2));
}
