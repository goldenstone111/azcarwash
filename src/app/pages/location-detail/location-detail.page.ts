import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { UtillService } from "src/services/utill.service";
import { mapStyle } from "./../../../environments/environment.prod";
import * as _ from "underscore";
import { map } from "rxjs/internal/operators/map";
import { ModalController } from "@ionic/angular";
import { BundleModelPage } from "../bundle-model/bundle-model.page";
import { Observable } from "rxjs";
import { CetegoryInfoPage } from "src/app/cetegory-info/cetegory-info.page";
import * as moment from "moment";
declare var google;

@Component({
  selector: "app-location-detail",
  templateUrl: "./location-detail.page.html",
  styleUrls: ["./location-detail.page.scss"],
})
export class LocationDetailPage implements OnInit {
  @ViewChild("map", { static: true }) mapElement: ElementRef;
  map: any;
  customAlertOptions: any = {
    header: "Sorting Type",
  };
  activeSegment: any = "Services";
  serviceList: any = [];
  aboutData: any = {};
  total: number = 0;
  data: any = {};
  faqList: any = [];
  selectedServices: any = [];
  user: any = {};
  isLiked: any = true;
  package: Observable<any>;
  userAddress: any = {};
  isEmpAvailable: any = true;
  selectedCatId = "";
  constructor(
    private utill: UtillService,
    private geolocation: Geolocation,
    private modalController: ModalController
  ) {
    this.serviceList = this.utill.bookingData.servicesWithcet;
    this.data = this.utill.bookingData;
    this.aboutData = this.utill.dataTrasfer;

    this.utill.defaultLocation.subscribe(
      (res: any) => (this.userAddress = res)
    );

    this.utill.afs
      .collection("condo")
      .doc(this.userAddress.condo)
      .valueChanges()
      .subscribe((res: any) => {
        this.data.image = res.image;
      });

    this.utill.afs
      .collection("ratingMaster", (ref) =>
        ref.where("condoId", "==", this.userAddress.condo)
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
      .subscribe((res) => {
        if (res) {
          this.data.reviewData = res;
          let sumOfStar = res.reduce((s, f) => {
            return s + f.star;
          }, 0);
          this.aboutData.avgRating = sumOfStar / res.length;
          this.aboutData.avgRating =
            isNaN(this.aboutData.avgRating) == true
              ? 0
              : this.aboutData.avgRating;
        }
      });

    // Get available Emp
    this.getServiceCapableEmployee();

    _.map(this.aboutData.reviewData, (review) => {
      review.userData = this.utill.afs
        .collection("users")
        .doc(review.userId)
        .valueChanges();
    });

    this.utill.afs
      .collection("faq")
      .valueChanges()
      .subscribe((res) => {
        this.faqList = res;
      });

    this.utill.afs
      .collection("users")
      .doc(this.utill.userId)
      .valueChanges()
      .subscribe((res) => {
        this.user = res;
        this.user.id = this.utill.userId;
        this.isLiked = _.contains(this.user.fevCondo, this.userAddress.condo);
      });

    setTimeout(() => this.totalCount(), 800);
    this.getPackage();
  }

  // getter methods

  getPackage() {
    this.package = this.utill.afs
      .collection("package", (ref) => ref.where("status", "==", "Active"))
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        ),
        map((res) =>
          res.map((r: any) => {
            r.service.map((service) => {
              r.servicesData = [];
              let unsub = this.utill.afs
                .collection("service")
                .doc(service)
                .valueChanges()
                .subscribe((res: any) => {
                  r.servicesData.push({
                    name: res.name,
                    image: res.image,
                    duration: res.duration,
                    description: res.description,
                    seqNumber: res.seqNumber,
                    id: service,
                  });
                  unsub.unsubscribe();
                });
              return service;
            });
            return r;
          })
        )
      );
  }

  initMap() {
    setTimeout(() => {
      if (this.activeSegment == "About") {
        this.geolocation
          .getCurrentPosition()
          .then((resp) => {
            var styledMapType = new google.maps.StyledMapType(mapStyle, {
              name: "Styled Map",
            });
            let latLng = new google.maps.LatLng(
              resp.coords.latitude,
              resp.coords.longitude
            );
            let mapoption = {
              center: latLng,
              zoom: 50,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              icon: {
                url: "assets/imgs/dp1.png",
                size: {
                  width: 50,
                  height: 50,
                },
              },
              mapTypeControlOptions: {
                mapTypeIds: [
                  "roadmap",
                  "satellite",
                  "hybrid",
                  "terrain",
                  "styled_map",
                ],
              },
            };
            this.map = new google.maps.Map(
              this.mapElement.nativeElement,
              mapoption
            );
            this.map.mapTypes.set("styled_map", styledMapType);
            this.map.setMapTypeId("styled_map");
          })
          .catch((error) => {});
      }
    }, 800);
  }

  async openModal(bundle: any) {
    this.utill.packageBook = bundle;
    const modal = await this.modalController.create({
      component: BundleModelPage,
      componentProps: {
        data: this.aboutData,
      },
      cssClass: "bundle-modal",
    });
    return await modal.present();
  }

  totalCount() {
    this.total = 0;
    this.serviceList.forEach((element) => {
      element.services.forEach((service) => {
        if (service.select) {
          this.selectedCatId = service.categoryId;
          this.selectedServices.push(service);
          if (this.utill.bookingData.selectedCar.Type == "small") {
            this.total += service.priceSmall;
          } else if (this.utill.bookingData.selectedCar.Type == "medium") {
            this.total += service.priceMedium;
          } else if (this.utill.bookingData.selectedCar.Type == "large") {
            this.total += service.priceLarge;
          }
        }
      });
    });
  }

  continue() {
    this.utill.bookingData.for = "SERVICES";
    this.utill.navCtrl().navigateForward("confirmBooking");
  }

  async onServiceSelect(selectedService: any) {
    if (
      this.selectedCatId &&
      this.selectedCatId !== selectedService.categoryId
    ) {
      this.utill.stopload();
      this.utill.error("Please Select 1 service only");
      return;
    }
    if (this.getServiceCapableEmployee) {
      let IsSame: any = false;
      await _.map(this.serviceList, (cet) => {
        _.map(cet.services, (service) => {
          if (service.categoryId == selectedService.categoryId) {
            if (selectedService.id == service.id && service.select == true) {
              IsSame = true;
            } else {
              service.select = false;
            }
          }
        });
      });

      selectedService.select = await !IsSame;
      if (selectedService.select) {
        // categoryId
        this.selectedCatId = selectedService.categoryId;
      } else {
        this.selectedCatId = "";
      }
      await this.getServiceCapableEmployee();
      this.totalCount();
    }
  }

  async getServiceCapableEmployee() {
    let services: any = [];
    await _.map(this.serviceList, (cet) => {
      _.map(cet.services, (service) => {
        if (service.select) {
          services.push(service.id);
        }
      });
    });

    this.utill.afs
      .collection("users", (ref) =>
        ref.where("role", "==", 2).where("status", "==", "Active")
      )
      .snapshotChanges()
      .pipe(
        map((actions: any) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        ),
        map((res) =>
          res.filter((r: any) => {
            r.available = true;
            if (this.utill.isAllObjContained(r.service, services)) {
              return true;
            } else {
              return false;
            }
          })
        )
      )
      .subscribe((res) => {
        this.utill.toastController.getTop().then((res) => {
          if (res) {
            this.utill.toastController.dismiss();
          }
        });
        if (res && res.length != 0) {
          const availableEmp = [];
          res.forEach((element) => {
            if (element.condo.indexOf(this.userAddress.condo) > -1) {
              availableEmp.push(element);
            }
          });
          this.utill.employee = availableEmp;
          this.isEmpAvailable = true;
        } else {
          this.isEmpAvailable = false;

          this.utill.error(
            "Non of the Detailer is available for selected service"
          );
        }
        this.utill.stopload();
      });
  }

  viewInGoogleMap() {
    // let options: LaunchNavigatorOptions = {
    //   app: this.LaunchNavigator.APP.USER_SELECT
    // };
    // this.launchNavigator.navigate(this.aboutData.address, options);
    if (
      /* if we're on iOS, open in Apple Maps */
      navigator.platform.indexOf("iPhone") != -1 ||
      navigator.platform.indexOf("iPad") != -1 ||
      navigator.platform.indexOf("iPod") != -1
    )
      window.open("maps://maps.google.com/maps?dadr=" + this.aboutData.address);
    /* else use Google */ else
      window.open(
        "https://maps.google.com/maps?dadr=" + this.aboutData.address
      );
  }

  likedToggle() {
    this.utill.startLoad();

    if (!this.isLiked) {
      this.user.fevCondo.push(this.userAddress.condo);
    } else {
      this.user.fevCondo = _.without(
        this.user.fevCondo,
        this.userAddress.condo
      );
    }

    this.utill.afs
      .collection("users")
      .doc(this.utill.userId)
      .update({
        fevCondo: this.user.fevCondo,
      })
      .then(() => {
        this.utill.stopload();
        this.utill.success("Feblist Has Been Updated..");
        this.isLiked = _.contains(this.user.fevCondo, this.userAddress.condo);
      })
      .catch(() => this.utill.stopload());
  }

  ngOnInit() {}

  async viewInfo(data: any) {
    const modal = await this.modalController.create({
      component: CetegoryInfoPage,
      cssClass: "service-modal",
      componentProps: { data: data, selected: this.data },
    });
    return await modal.present();
  }
}
