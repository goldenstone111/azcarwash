import { FCM } from "@ionic-native/fcm/ngx";
import { Component, ViewChildren, QueryList } from "@angular/core";
import { Platform, IonRouterOutlet, MenuController } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { UtillService } from "src/services/utill.service";
import { map } from "rxjs/internal/operators/map";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  public appPages = [
    {
      title: "My Bookings",
      url: "/myBookings",
      icon: "md-list-box",
    },
    {
      title: "My Cars",
      url: "/myCars",
      icon: "md-car",
    },
    {
      title: "My Addresses",
      url: "/pickupAddress",
      icon: "md-pin",
    },
    {
      title: "Favorites",
      url: "/favorite",
      icon: "md-heart",
    },
    {
      title: "FAQ's",
      url: "/faq",
      icon: "md-help",
    },
    {
      title: "About Us",
      url: "/aboutUs",
      icon: "md-contacts",
    },
    {
      title: "Contact Us",
      url: "/contactUs",
      icon: "md-list-box",
    },
    {
      title: "Terms & Conditions",
      url: "/terms",
      icon: "md-list-box",
    },
  ];
  user: any = {};
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private utill: UtillService,
    public router: Router,
    private menu: MenuController,
    private fcm: FCM
  ) {
    this.backButtonEvent();
    this.initializeApp();

    console.log = function () {};

    this.utill.afAuth.authState.subscribe((res) => {
      if (res) {
        this.menu.enable(true);
        this.utill.userId = res.uid;
        this.utill.afs
          .collection("users")
          .doc(res.uid)
          .valueChanges()
          .subscribe((res) => {
            this.user = res;
          });
        this.utill.afs
          .collection(`addressMaster`, (ref) =>
            ref.where("UserId", "==", res.uid)
          )
          .snapshotChanges()
          .pipe(
            map((actions: any) =>
              actions.map((a) => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          )
          .subscribe((address) => {
            if (address) {
              if (address.length == 0) {
                this.utill.navCtrl().navigateForward("addAddress");
              } else {
                address.map((element: any) => {
                  if (element.default) {
                    this.utill.defaultLocation.next(element);
                  }
                });
              }
            }
          });
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000);

      this.fcm.onNotification().subscribe(
        (data) => {
          if (data.wasTapped) {
          } else {
            //  Received in foreground
          }
        },
        (err) => {}
      );
    });
  }

  signOut() {
    this.utill.startLoad();
    this.utill.afAuth.auth.signOut().then(() => {
      localStorage.clear();
      this.utill.success("Logout Succesfully");
      this.utill.stopload();
      this.utill.navCtrl().navigateRoot("signIn");
    });
  }

  menuToggle(menuState: boolean) {
    this.utill.menuToggle.next(menuState);
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        } else if (
          this.router.url === "signIn" ||
          this.router.url === "home" ||
          this.router.url === "/signIn" ||
          this.router.url === "/home"
        ) {
          navigator["app"].exitApp();
        }
      });
    });
  }
}
