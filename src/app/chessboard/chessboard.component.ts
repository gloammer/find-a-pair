import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { Card } from '../shared/card';
import { GameService } from '../game-service/game.service';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.css']
})
export class ChessboardComponent implements OnInit {

  @Input() deck: Card[];
  @Input() set dimension(value) {
    this._dimension = _.range(value);
  }
  
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onCardClicked = new EventEmitter<number>();

  _dimension;
  _deck;

  // GameService
  constructor(private gameService: GameService) { }

  ngOnInit() { }

  getCard(rowIndex: number, columnIndex: number) {
    const cardIndex = this.getCardIndex(rowIndex, columnIndex);
    return this.deck[cardIndex];
  }

  onClick(rowIndex: number, columnIndex: number) {
    this.onCardClicked.emit(this.getCardIndex(rowIndex, columnIndex));
  }

  private getCardIndex = (rowIndex: number, columnIndex: number) =>
    rowIndex * this._dimension.length + columnIndex
}
