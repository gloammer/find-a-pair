import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Card } from '../shared/card';
import * as _ from 'lodash';
import { Player } from '../shared/player';
import { GameService } from '../game-service/game.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  form: FormGroup;
  rows: number;
  columns: number;
  deck: Card[];
  currentPlayer: Player;

  constructor(private fb: FormBuilder, private gameService: GameService) {
    this.gameService.currentPlayer.subscribe(currentPlayer => {
      this.currentPlayer = currentPlayer;
    });
    this.gameService.endGame.subscribe(end => {
      console.log('Game Over');
    });
  }

  ngOnInit() {
    this.setupForm();
  }

  setupForm() {
    this.form = this.fb.group({
      rows: [3, [Validators.min(2), Validators.required]],
      columns: [3, [Validators.min(2), Validators.required]],
    });
  }

  onSubmit() {
    const formValue = this.form.value;
    this.rows = formValue.rows;
    this.columns = formValue.columns;
    this.generateCards();
    this.gameService.totalCards = this.deck.length;
    this.gameService.resetGame();
  }

  generateCards = () => {

    const CARD_NAMES = [
      '8-ball.png',
      'baked-potato.png',
      'dinosaur.png',
      'kronos.png',
      'rocket.png',
      'skinny-unicorn.png',
      'that-guy.png',
      'zeppelin.png',
      'laptop.png',
      '404.png',
      'angular.png',
      'cat.png',
      'js.png',
      'laptop.png',
      'nike.png',
      'paint.png',
      'react-js.png',
      'vue-js.png',
      'bong.png'
    ];

    let tempDeck = _.range(this.rows * this.columns);
    tempDeck = _.shuffle(
      tempDeck.map(card => Math.floor(card / 2))
    );

    // исправить костыль
    this.deck = tempDeck.map(card => new Card(card, false));

    for (let i = 0; i < this.deck.length; i++) {
      this.deck[i] = new Card(this.deck[i].value, false, '../../assets/' + CARD_NAMES[this.deck[i].value]);
    }

  }


  onCardClicked(event) {
    const cardClicked = this.deck[event];
    if (!cardClicked.faceUp) {
      this.gameService.cardClick(cardClicked);
    }
  }
}
