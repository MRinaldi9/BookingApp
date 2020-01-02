import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-sidedrawer',
	templateUrl: './sidedrawer.component.html',
	styleUrls: ['./sidedrawer.component.scss']
})
export class SidedrawerComponent implements OnInit {
	constructor() {}

	ngOnInit() {
		console.log('ci sono');
	}
}
