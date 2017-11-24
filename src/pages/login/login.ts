import { Component } from '@angular/core';
import { ContactPage } from '../promo/contact/contact';
import { HomePage } from '../promo/home/home';

@Component({
  templateUrl: 'login.html'
})
export class LoginPage {

  tab1Root = HomePage;
  tab3Root = ContactPage;

  constructor() {

  }
}
