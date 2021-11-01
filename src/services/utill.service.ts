import { HttpClient } from "@angular/common/http";
import {
  LoadingController,
  NavController,
  ToastController,
  AlertController,
} from "@ionic/angular";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "angularfire2/auth";
import * as moment from "moment";
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFireFunctions } from "@angular/fire/functions";

declare var google;

@Injectable({
  providedIn: "root",
})
export class UtillService {
  userSelectedData: any = {
    isCarSelected: null,
    isServiceSelected: null,
    isDateSelected: null,
    isLocationSelected: null,
  };
  isLoading: any;
  employee: any = {};
  dataTrasfer: any = {};
  bookingSelectStatus: any = 0;
  bookingData: any = {};
  userId: any = localStorage.getItem("userKey");
  packageBook: any = {};
  // Behaviour Subject
  public language = new BehaviorSubject({});
  public user = new BehaviorSubject({});
  public bookingDataState = new BehaviorSubject({
    isCarSelected: false,
    isServiceSelected: false,
    isDateSelected: false,
  });
  public defaultLocation = new BehaviorSubject({});
  public bookingDetail = new BehaviorSubject({});
  public menuToggle = new BehaviorSubject(false);
  public locator: any = "";
  constructor(
    private loadingController: LoadingController,
    private nav: NavController,
    private http: HttpClient,
    public toastController: ToastController,
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    private afFunction: AngularFireFunctions
  ) {}

  async startLoad() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 9000,
        cssClass: "custom-loader",
        message: `<div class="sk-chase">
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
      <div class="sk-chase-dot"></div>
    </div>`,
        spinner: null,
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => {});
          }
        });
      });
  }

  async stopload() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then(() => {});
  }

  resetPassword(email) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth
        .sendPasswordResetEmail(email)
        .then((res) => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  googleMapAddScript() {}

  uploadImageToFirebase(file) {
    const randomId =
      new Date().getTime() + Math.random().toString(36).substring(2);
    const ref = this.afStorage.ref(randomId + ".jpg");
    const task = ref.putString(file, "base64");
    return {
      task: task.snapshotChanges(),
      ref,
      path: randomId,
    };
  }

  getGoogleMap(centerPoint, nativeElement) {
    let mapoption = {
      center: new google.maps.LatLng(centerPoint.lat, centerPoint.lng),
      zoom: 15,
      streetViewControl: false,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    return new google.maps.Map(nativeElement, mapoption);
  }

  async addMarkerToMap(centerPoint, map) {
    return await new google.maps.Marker({
      position: new google.maps.LatLng(centerPoint.lat, centerPoint.lng),
      map: map,
    });
  }

  google(lat, lng) {
    return this.http.get(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        lat +
        "," +
        lng +
        "&key=" +
        "AIzaSyCb9lhLYxUnRjSp1oIGl6aAsXLODc3o-f4" +
        ""
    );
  }

  navCtrl() {
    return this.nav;
  }

  distance(lat1, lon1, lat2, lon2, unit) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      let radlat1 = (Math.PI * lat1) / 180;
      let radlat2 = (Math.PI * lat2) / 180;
      let theta = lon1 - lon2;
      let radtheta = (Math.PI * theta) / 180;
      let dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == "K") {
        dist = dist * 1.609344;
      }
      if (unit == "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }

  formatDate = (date: Date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  async success(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      mode: "ios",
      cssClass: "toastStyle",
    });
    toast.present();
  }

  async error(msg, desc?) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      mode: "ios",
      cssClass: "toastStyleError",
    });
    toast.present();
  }

  convertJSDateToTimestamp(date) {
    let myDate: any = date;
    myDate = myDate.split("-");
    let newDate = myDate[1] + "/" + myDate[2] + "/" + myDate[0];
    return new Date(newDate).getTime();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      mode: "ios",
    });
    toast.present();
  }

  convertDate(date) {
    return moment(date).format("YYYY-MM-DD");
  }

  convertTime(time) {
    return moment(time).format("H:mm");
  }

  convertDateTime(date) {
   
    return moment(date).format("YYYY-MM-DD H:mm");
  }

  isAllObjContained(arr, target) {
    return target.every((v) => arr.includes(v));
  }

  getTimeStops(start, end) {
    var startTime = moment(start, "HH:mm");
    var endTime = moment(end, "HH:mm");

    if (endTime.isBefore(startTime)) {
      endTime.add(1, "day");
    }

    var timeStops = [];

    while (startTime <= endTime) {
      timeStops.push({
        in24: moment(startTime).format("HH:mm"),
        in12: moment(startTime).format("hh:mm"),
        prefix: moment(startTime).format("a"),
        selected: false,
        disabled: false,
      });
      startTime.add(15, "minutes");
    }
    return timeStops;
  }

  getOtp(number) {
   
    const verifyCode = this.afFunction.functions.httpsCallable("verifyCode");
    return verifyCode({ number: number });
  }

  checkMail(email) {
    const verifyCode = this.afFunction.functions.httpsCallable("sendMail");
    return verifyCode({ email: email });
  }
}
