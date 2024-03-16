export { Socket } from "socket.io";

export enum Event {
  CREATE_GAME = 'createGame',
  GAME_CREATED = 'gameCreated',
  JOIN_GAME = 'joinGame',
  JOINED_IN_GAME = 'joinedInGame',
  ERROR_JOINING = 'errorJoining',
  MOVE = 'move',
  ON_MOVE = 'onMove',
  WINNER = 'winner',
}

export interface Player {
  id: string;
  name: string;
  socketId: string;
  mark: Mark;
  movement: number[];
}

export type Code = string;

export type PlayerById = Record<Player['id'], Player>;

export interface Room {
  code: Code;
  players: PlayerById;
}


export type RoomByCode = Record<Code, Room>;

export enum Mark {
  X='X',
  O='O',
}

// const players: PlayerById = {
//   'id-1': {
//     id: 'id-1',
//     mark: Mark.X,
//     movement: [],
//     name: 'Dani',
//     socketId: '21232aeqweq',
//   },
//   'id-2': {
//     id: 'id-2',
//     mark: Mark.O,
//     movement: [],
//     name: 'Karen',
//     socketId: 'qweqwczxcsa',
//   },
// }


export const winnerPattern = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [6,4,2],
]
