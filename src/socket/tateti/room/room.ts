import { generateRandomCode } from "../../../utils/generate-random-code";
import { Code, Player, RoomByCode, Room as IRoom, Mark, winnerPattern } from "../types";

export default class Room {
  private static rooms: RoomByCode = {};

  public static createRoom(player: Pick<Player, 'id' | 'name'>, socketId: string): string {
    const code = generateRandomCode();

    this.rooms[code] = {
      code,
      players: {
        [player.id]: {
          ...player,
          socketId,
          mark: Mark.X,
          movement: [],
        }
      },
    }

    return code;
  }

  public static joinRoom(code: string, player: Pick<Player, 'id' | 'name'>, socketId: string): boolean {
    const room = this.rooms[code];

    if(room && Object.keys(room.players).length === 1) {
      this.rooms[code].players[player.id] = {
        ...player,
        socketId,
        mark: Mark.O,
        movement: [],
      };

      return true;
    } else {
      console.log(`La sala code:${code} está llena o no existe`)
    }

    return false;
  }

  public static getRoom(code: Code): IRoom {
    return this.rooms[code];
  }

  public static deleteRoom(code: Code): void {
    delete this.rooms[code];
  }

  public static getRoomByPlayerSocketId(socketId: string): IRoom | undefined {
    return Object.values(this.rooms)
      .find(r => Object.values(r.players).some(p => p.socketId === socketId))
  }

  public static getCodeRoomByPlayerId(playerId: Player['id']): Code | undefined {
    const room = Object.values(this.rooms).find(room => !!room.players[playerId])

    if(!room) return;

    return room.code;
  }

  public static move(position: number, playerId: Player['id']): void {
    const code = this.getCodeRoomByPlayerId(playerId);

    if(!code) return;

    // room -> player -> movement (agregamos nuevo movimiento)
    this.rooms[code].players[playerId].movement.push(position);
  }

  public static checkWinner(playerId: Player['id']): boolean {
    const code = this.getCodeRoomByPlayerId(playerId);

    if(!code) return false;

    const movement = this.rooms[code].players[playerId].movement;
    
    for (let index = 0; index < winnerPattern.length; index++) {
      const winningSequence = winnerPattern[index];

      const isWinner = winningSequence.every(index => movement.includes(index));
      
      if(isWinner) return true;
    }
    return false;
  }
}
