import { generateRandomCode } from "../../../utils/generate-random-code";
import { Code, Player, RoomByCode, Room as IRoom } from "../types";

export default class Room {
  private static rooms: RoomByCode = {};

  public static createRoom(player: Pick<Player, 'id' | 'name'>, socketId: string): string {
    const code = generateRandomCode();

    this.rooms[code] = {
      code,
      players: [{...player, socketId}]
    }

    return code;
  }

  public static joinRoom(code: string, player: Player, socketId: string): boolean {
    const room = this.rooms[code];

    if(room && room.players.length === 1) {
      this.rooms[code].players.push({...player, socketId});
    } else {
      console.log(`La sala ${code} está llena o no existe`)
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
      .find(r => r.players.some(p => p.socketId === socketId))
  }
}
