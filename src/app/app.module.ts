import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ContactPage } from '../pages/promo/contact/contact';
import { HomePage } from '../pages/promo/home/home';
import { GruposPage } from '../pages/grupos/grupos';
//import { RedicPage } from '../pages/redic/redic';

import { SQLite } from '@ionic-native/sqlite';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { TasksServiceProvider } from '../providers/tasks-service/tasks-service';

@NgModule({
  declarations: [
    MyApp,
    ContactPage,
    HomePage,
    GruposPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    //AngularFireDatabaseModule
    AngularFirestoreModule.enablePersistence()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ContactPage,
    HomePage,
    GruposPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TasksServiceProvider
  ]
})
export class AppModule {}
