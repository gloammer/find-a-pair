import { Injectable } from '@angular/core';
import { GameProcess } from '../shared/game-process';
import { Player } from '../shared/player';
import { Card } from '../shared/card';
import * as _ from 'lodash';
import { from } from 'rxjs';
import { PlayerState } from '../shared/player-state';

const _SAME = 0;
const SECOND = 1000;

@Injectable({
  providedIn: 'root'
})
export class GameService extends GameProcess {
  _cardsPerTurn = 2;
  _memorizeDurationInSeconds = 1 * SECOND;

  previousCards: Card[] = [];
  waitingForTurnToEnd;

  totalCards: number;
  constructor() {
      super();

      /* update player states */
      this.players.forEach(player => {
          player.state = this.defaultPlayerState();
          this.updatePlayer(player);
      });
  }

  cardClick(card: Card) {
      if (!this.waitingForTurnToEnd) {
          card.flip();
          if (this.isLastMoveOfTurn()) {
              this.turn++;
              if (this.isMatch(card)) {
                  this.onSuccessfulMatch();
              } else {
                  this.waitingForTurnToEnd = true;
                  setTimeout(() => {
                      this.previousCards.forEach(c => c.flip());
                      card.flip();
                      this.endTurn(this.getNextPlayer());
                  }, this._memorizeDurationInSeconds);
              }
          } else {
              this.previousCards.push(card);
          }
      }
  }

  onSuccessfulMatch() {
      const currentPlayer = this.currentPlayer.value;
      currentPlayer.state.score++;
      this.updatePlayer(currentPlayer);
      if (this.isGameOver()) {
          this.endGame.next();
      } else {
          this.endTurn();
      }
  }

  endTurn(nextPlayer: Player = this.currentPlayer.value) {
      this.previousCards = [];
      this.waitingForTurnToEnd = false;
      this.currentPlayer.next(nextPlayer);
  }

  resetGame() {
      /* reset player state */
      this.players.forEach(player => {
          player.state = { score: 0 };
          this.updatePlayer(player);
      });
      this.previousCards = [];
      this.waitingForTurnToEnd = false;
      this.turn = 0;
  }

  isGameOver(): boolean {
      return this.players.reduce(
          (accumulator, currentVal) => accumulator + currentVal.state.score, 0) === Math.floor(this.totalCards / 2);
  }
  private isLastMoveOfTurn() {
      return this.previousCards.length === this._cardsPerTurn - 1;
  }

  private isMatch(card) {
      return _.every(
          this.previousCards,
          previousCard => previousCard.compare(card) === _SAME
      );
  }

  private defaultPlayerState(): PlayerState {
      return {
          score: 0,
          tries: 0,
          history: []
      };
  }
}
