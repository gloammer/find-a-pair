import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../shared/card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('model') model: Card;
  card: Card;
  constructor() { }

  ngOnInit() {
  }
}
