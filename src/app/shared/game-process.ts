import { BehaviorSubject, Subject } from 'rxjs';
import * as _ from 'lodash';
import { Player } from './player';

export abstract class GameProcess {
  constructor(public players: Player[] = defaultPlayers()) { }
  currentPlayer: BehaviorSubject<Player> = new BehaviorSubject(this.players[0]);
  turnDuration: number;
  history;
  turn = 0;
  endGame: Subject<any> = new Subject();
    
  updatePlayer(player: Player) {
    const playerIndex = this.players.findIndex(_player => {
       return player.name === player.name;
    });
    this.players[playerIndex] = player;
  }

  getNextPlayer() {
    const playerIndex = this.players.findIndex(_player => {
      return _player.name === this.currentPlayer.value.name;
    });
    return this.players[(playerIndex + 1) % this.players.length];
  }

  abstract endTurn();
  abstract resetGame();
  abstract isGameOver();
}

const defaultPlayers = (): Player[] => {
  return [
    { name: 'player1' }
  ];
};
