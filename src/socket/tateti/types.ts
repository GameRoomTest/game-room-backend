export { Socket } from "socket.io";

export enum Event {
  CREATE_GAME = 'createGame',
  GAME_CREATED = 'gameCreated',
  JOIN_GAME = 'joinGame',
  JOINED_IN_GAME = 'joinedInGame',
  ERROR_JOINING = 'errorJoining',
}

export interface Player {
  id: string;
  name: string;
  socketId: string;
}

export type Code = string;

export interface Room {
  code: Code;
  players: Player[];
}

export type RoomByCode = Record<Code, Room>;
