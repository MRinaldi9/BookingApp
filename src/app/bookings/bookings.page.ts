import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
	selector: 'app-bookings',
	templateUrl: './bookings.page.html',
	styleUrls: ['./bookings.page.scss']
})
export class BookingsPage implements OnInit {
	constructor(private menuCtrl: MenuController) {}

	ngOnInit() {}

	openMenu() {
		this.menuCtrl.open('m1');
	}
}
