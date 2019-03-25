import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
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
  dimension: number;
  deck: Card[];
  currentPlayer: Player;

  constructor(private fb: FormBuilder, private gameService: GameService) {
    this.gameService.currentPlayer.subscribe(currentPlayer => {
      this.currentPlayer = currentPlayer;
    });
    this.gameService.endGame.subscribe(end => {
      setTimeout(function() { alert('You win!') }, 1000);
    });
  }

  ngOnInit() {
    this.setupForm();
  }

  setupForm() {
    this.form = this.fb.group({
      dimension: [2, [this.formFalidator, Validators.required]]
    });
  }

  onSubmit() {
    const formValue = this.form.value;
    this.dimension = formValue.dimension;
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

    const sortCards = CARD_NAMES.sort(this.compareRandom);

    let tempDeck = _.range(Math.pow(this.dimension, 2));
    tempDeck = _.shuffle(
      tempDeck.map(card => Math.floor(card / 2))
    );

    // исправить костыль 
    this.deck = tempDeck.map(card => new Card(card, false));
    
    for (let i = 0; i < this.deck.length; i++) {
      this.deck[i] = new Card(this.deck[i].value, false, '../../assets/' + sortCards[this.deck[i].value]);
    }

  }

  compareRandom() {
    return Math.random() - 0.5;
  }

  onCardClicked(event) {
    const cardClicked = this.deck[event];
    if (!cardClicked.faceUp) {
      this.gameService.cardClick(cardClicked);
    }
  }

  private formFalidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    const range = value === 2 || value === 4 || value === 6;
    if (!range) {
      return { 'valid': true };
    }
    return null;
  }
}
