import { config } from "./../environments/environment";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AngularFireModule } from "@angular/fire";
import { HttpClientModule } from "@angular/common/http";

// firebase stuff
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireFunctionsModule } from "@angular/fire/functions";

// native stuff
import { FCM } from "@ionic-native/fcm/ngx";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { PayPal } from "@ionic-native/paypal/ngx";
import { Camera } from "@ionic-native/camera/ngx";
import { AuthGuardService } from "./authGuard/auth-guard-service.service";
import { UtillService } from "src/services/utill.service";
import { CustomPipeModule } from "./custom-pipe/custom-pipe.module";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CustomPipeModule,
    IonicModule.forRoot(),
    // firebase stuff
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    BrowserAnimationsModule
  ],
  providers: [
    AuthGuardService,
    UtillService,
    StatusBar,
    SplashScreen,
    Geolocation,
    PayPal,
    Camera,
    FCM,
    InAppBrowser,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LocationAccuracy,
  ],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
