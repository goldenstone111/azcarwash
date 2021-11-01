import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from "@angular/core";
import { ModalController, MenuController } from "@ionic/angular";
import { LocationModalPage } from "../location-modal/location-modal.page";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { UtillService } from "src/services/utill.service";
import { CetegoryInfoPage } from "src/app/cetegory-info/cetegory-info.page";
import { DrawerState } from "ion-bottom-drawer";
import { map } from "rxjs/internal/operators/map";
import * as _ from "underscore";
import * as moment from "moment";
import { Platform } from '@ionic/angular';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { SlideInOutAnimation } from './animations';
declare let google;

@Component({
    selector: "app-home",
    templateUrl: "./home.page.html",
    styleUrls: ["./home.page.scss"],
    animations: [SlideInOutAnimation],
})
export class HomePage implements OnInit {
    @ViewChild("map", { static: true }) mapElement: ElementRef;
    map: any;
    state: any = 0;
    public menuToggle: boolean = false;
    // drawers
    public shouldBounce = false;
    public dockedHeight = 300;
    public distanceTop = 100;
    public drawerState = DrawerState.Bottom;
    public minimumHeight = 0;
    public animationState = 'out';

    public selectedData: any = {
        selectedCar: {},
        selectedService: "",
        dateTime: {},
        address: "",
    };
    location: any = {};
    condo: any = [];
    bookingData: any = {};
    // all array
    carCollection: any = [];
    cetegoryWithServices: any[];
    days: any = [];
    time: any = [];
    selected: any = { date: undefined, time: undefined };
    data: any = {};
    isSelected: any = {};
    employees: any = [];
    selectedService: any = "";
    selectedCatId: any = "";

    constructor(
        private geolocation: Geolocation,
        private utill: UtillService,
        private modalController: ModalController,
        private menu: MenuController,
        private platform: Platform,
        private locationAccuracy: LocationAccuracy
    ) {
        this.menu.enable(true);
        // this.distanceTop = this.platform.height() - (this.platform.height() * .45 + 194);
        this.utill.bookingDetail.subscribe((res) => (this.bookingData = res));
        this.utill.defaultLocation.subscribe((res: any) => {
            this.location = res;
            this.selected = { date: undefined, time: undefined };
            this.utill.bookingDataState.next({
                isCarSelected: true,
                isServiceSelected: true,
                isDateSelected: false,
            });
        });
        this.utill.bookingDataState.subscribe(
            (res: any) => (this.isSelected = res)
        );

        this.utill.menuToggle.subscribe((res) => (this.menuToggle = res));

        this.getCarCollection();
        this.getServices();
        this.getDateTime();
    }

    ngOnInit() {
        this.askToTurnOnGPS();
        this.checkIfAddress();
    }

    ionViewWillEnter() {
        this.initMap();
    }

    toggleShowDiv(divName: string) {
        if (divName === 'divA') {
            console.log(this.animationState);
            this.animationState = this.animationState === 'out' ? 'in' : 'out';
            console.log(this.animationState);
        }
    }

    checkIfAddress() {
        this.utill.afAuth.authState.subscribe((res) => {
            if (res) {
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
                            }
                        }
                    });
            }
        });

    }

    askToTurnOnGPS() {
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
                // the accuracy option will be ignored by iOS
                this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                    () => console.log('Request successful'),
                    error => console.log('Error requesting location permissions', error)
                );
            }
        });
    }
    //  all getter method **************************************************************************************************************

    getCarCollection(): void {
        this.utill.startLoad();
        this.utill.afs
            .collection("carMaster", (ref) =>
                ref.where("UserId", "==", this.utill.userId)
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
            .subscribe(
                (res) => {
                    this.carCollection = res;

                    this.utill.stopload();
                },
                () => this.utill.stopload()
            );
    }

    getServices(): void {
        this.utill.startLoad();
        this.utill.afs
            .collection("category")
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
            .subscribe((category) => {
                this.cetegoryWithServices = [];
                this.cetegoryWithServices = category;

                this.utill.stopload();
                this.utill.afs
                    .collection("service")
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
                    .subscribe((services) => {
                        this.cetegoryWithServices.forEach((cet) => {
                            cet.services = [];
                            services.forEach((subSer) => {
                                if (cet.id == subSer.categoryId) {
                                    cet.services.push(subSer);
                                }
                            });
                        });
                        this.utill.stopload();
                    });
            });
    }

    getDateTime(): void {
        this.time = this.utill.getTimeStops("10:00", "23:59");
        let remain = moment().daysInMonth() - parseInt(moment().format("DD"));

        for (let i = 0; i <= remain; i++) {
            let date: string = moment().add(i, "days").format("YYYY/M/D");
            this.days.push({ date: date });
        }
        for (let i = 1; i < 3; i++) {
            const addmonthdate: any = moment().startOf("month").add(i, "month");
            let innerLoop = addmonthdate.daysInMonth();
            for (let j = 0; j < innerLoop; j++) {
                let date: string = moment(addmonthdate)
                    .add(j, "days")
                    .format("YYYY/M/D");
                this.days.push({ date: date });
            }
        }
    }

    // state 0 = with marker 1 = direct book
    async _getAvailableCondos(state) {
        this.utill.startLoad();

        if (this.location) {
            let duration: number = 0;
            await this.cetegoryWithServices.forEach((services) => {
                services.services.forEach((ser) => {
                    if (ser.select) {
                        duration += parseFloat(ser.duration);
                    }
                });
            });

            let startTime = moment(
                this.selected.date.date + " " + this.selected.time.in24
            ).format("YYYY-MM-DD HH:mm:ss");
            let date = moment(startTime).format("YYYY-MM-DD");
            let endTime = moment(startTime, "YYYY-MM-DD HH:mm")
                .add(duration, "m")
                .format("LTS");
            endTime = moment(date + " " + endTime).format("YYYY-MM-DD HH:mm");
            var extra = moment().format("YYYY-MM-DD") + " ";

            let isBlock: boolean = false;
            let blockEmpId = [];
            let condoEmp = [];
            this.employees.forEach((element) => {
                if (element.condo.indexOf(this.location.condo) > -1) {
                    condoEmp.push(element);
                    if (element.blockTime.length < 0) {
                        isBlock = false;
                    }
                    if (element.blockTime.length > 0) {
                        element.blockTime.forEach((btime) => {
                            let blockStartDate = moment(
                                btime.startDate,
                                "YYYY-MM-DD"
                            ).subtract(1, "d");
                            let blockEndDate = moment(btime.endDate, "YYYY-MM-DD").add(
                                1,
                                "d"
                            );
                            let timeslotDate = moment(this.selected.date.date, "YYYY-MM-DD");
                            if (
                                timeslotDate.isBetween(blockStartDate, blockEndDate) &&
                                moment(this.selected.time.in24, "HH:mm").isBetween(
                                    moment(btime.startTime, "HH:mm:ss"),
                                    moment(btime.endTime, "HH:mm:ss")
                                )
                            ) {
                                blockEmpId.push(element);
                            }
                        });
                    }
                }
            });

            if (blockEmpId.length != condoEmp.length) {
                if (this.location && this.location.condo != undefined) {
                    this.utill.afs
                        .collection("condo")
                        .doc(this.location.condo)
                        .valueChanges()
                        .subscribe(async (res: any) => {
                            let check = false;
                            if (res && res.length != 0) {
                                this.condo = await res;
                                let userStartTime = moment(
                                    extra + this.utill.convertTime(startTime)
                                );
                                let userEndTime = moment(
                                    extra + this.utill.convertTime(endTime)
                                );
                                let startCondoAt = moment(extra + res.startTime);
                                let closeCondoAt = moment(extra + res.endTime);

                                if (
                                    userStartTime.isBetween(startCondoAt, closeCondoAt) ||
                                    userEndTime.isBetween(startCondoAt, closeCondoAt)
                                ) {
                                    if (res.blockTime && res.blockTime.length != 0) {
                                        _.map(res.blockTime, (time: any) => {
                                            if (
                                                moment(date).isBetween(
                                                    time.startDate,
                                                    time.endDate,
                                                    null,
                                                    "[]"
                                                )
                                            ) {
                                                let blockStartAt = moment(extra + time.startTime);
                                                let blockEndAt = moment(extra + time.endTime);
                                                if (
                                                    userStartTime.isBetween(blockStartAt, blockEndAt) ||
                                                    userEndTime.isBetween(blockStartAt, blockEndAt)
                                                ) {
                                                    // Condo is on holiday
                                                    check = false;
                                                } else {
                                                    check = true;
                                                }
                                            } else {
                                                check = true;
                                            }
                                        });
                                    } else {
                                        check = true;
                                    }
                                } else {
                                    // not in between start and end time
                                    check = false;
                                }

                                if (check) {
                                    if (state == 0) {
                                        let marker = new google.maps.Marker({
                                            position: new google.maps.LatLng(
                                                this.condo.lat,
                                                this.condo.lng
                                            ),
                                            map: this.map,
                                            data: this.condo,
                                        });
                                        google.maps.event.addListener(marker, "click", () => {
                                            this.utill.dataTrasfer = this.condo;
                                            this.locationModal();
                                        });
                                        this.map.setCenter(
                                            new google.maps.LatLng(this.condo.lat, this.condo.lng)
                                        );
                                        this.drawerState = await DrawerState.Bottom;
                                        this.state = 4;
                                        this.utill.stopload();
                                    } else {
                                        this.utill.dataTrasfer = this.condo;
                                        this._onBookNow();
                                        this.utill.stopload();
                                    }
                                } else {
                                    this.utill.error("Condo is not available on this time", "");
                                    this.utill.stopload();
                                }
                            } else {
                                this.utill.error("Condo has been closed");
                                this.utill.stopload();
                            }
                        });
                } else {
                    this.utill.stopload();
                    this.utill.error("No Location is Selected", "");
                }
            } else {
                this.utill.stopload();
                this.utill.error("Detailer Not Available At This Time", "");
            }
        }
    }

    // all setter method *******************************************************

    onSegmentSelect(state) {
        setTimeout(() => {
            this.state = state;
        }, 500)
        this.animationState = 'in';
        // if (state == this.state) {
        //     this.drawerState = DrawerState.Bottom;
        //     this.state = 0;
        // } else {
        //     this.drawerState = DrawerState.Top;
        //     this.state = state;
        // }
    }

    async onServiceSelect(selectedService: any) {
        this.utill.startLoad();
        let IsSame: any = false;
        if (
            this.selectedCatId &&
            this.selectedCatId !== selectedService.categoryId
        ) {
            this.utill.stopload();
            this.utill.error("Please Select 1 service only");
            return;
        }
        await _.map(this.cetegoryWithServices, (cet) => {
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
            this.selectedService = selectedService.name;
            // categoryId
            this.selectedCatId = selectedService.categoryId;
        } else {
            this.selectedService = "";
            this.selectedCatId = "";
        }

        this.utill.bookingDataState.next({
            isCarSelected: true,
            isServiceSelected: selectedService.select,
            isDateSelected: false,
        });

        this.getServiceCapableEmployee();
    }

    async onDateSelect(date) {
        this.selected.data = undefined;
        this.selected.time = undefined;
        this.utill.startLoad();
        await _.map(this.days, (r) => (r.selected = false));
        date.selected = await true;
        this.selected.date = date;
        this.utill.bookingDataState.next({
            isCarSelected: true,
            isServiceSelected: true,
            isDateSelected:
                this.selected.time != undefined && this.selected.date != undefined,
        });
        await this.disabledSlot();
    }

    async onTimeSelect(time) {
        await this.time.map((r) => {
            r.selected = false;
        });
        time.selected = await true;
        this.selected.time = time;

        this.utill.bookingDataState.next({
            isCarSelected: true,
            isServiceSelected: true,
            isDateSelected:
                this.selected.time != undefined && this.selected.date != undefined,
        });
        this.checkTimeAvailability();
    }

    onCarSelect(car: any) {
        this.selectedData.selectedCar = car;
        this.utill.bookingDataState.next({
            isCarSelected: true,
            isServiceSelected: false,
            isDateSelected: false,
        });
    }

    // Other  ***************************************************************************************

    closeDrawer() {
        // this.drawerState = DrawerState.Bottom;
        setTimeout(() => {
            this.state = 0;
        }, 500)
        this.animationState = 'out';
    }

    initMap() {
        console.warn('initMap')
        this.geolocation
            .getCurrentPosition()
            .then((resp) => {
                let latLng = new google.maps.LatLng(
                    resp.coords.latitude,
                    resp.coords.longitude
                );
                let mapoption = {
                    center: latLng,
                    zoom: 15,
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
                // this.map.mapTypes.set("styled_map", styledMapType);
                // this.map.setMapTypeId("styled_map");
            })
            .catch((err) => { console.error(err) });
    }

    _navigateToAddCarPage() {
        this.utill.navCtrl().navigateForward("addCar");
    }

    _navigateToSelectAddressPage() {
        this.utill.navCtrl().navigateForward("pickupAddress");
    }

    async locationModal() {
        this.utill.startLoad();
        this.utill.bookingData.selectedCar = this.selectedData.selectedCar;
        this.utill.bookingData.servicesWithcet = this.cetegoryWithServices;
        this.utill.bookingData.dateTime = {
            date: this.selected.date,
            time: this.selected.time,
        };
        const modal = await this.modalController.create({
            component: LocationModalPage,
            cssClass: "location-modal",
        });
        this.utill.stopload();
        return await modal.present();
    }

    async viewInfo(data: any) {
        const modal = await this.modalController.create({
            component: CetegoryInfoPage,
            cssClass: "service-modal",
            componentProps: { data: data, selected: this.selectedData },
        });
        return await modal.present();
    }

    _onBookNow() {
        this.utill.bookingData.selectedCar = this.selectedData.selectedCar;
        this.utill.bookingData.servicesWithcet = this.cetegoryWithServices;
        this.utill.bookingData.dateTime = {
            date: this.selected.date,
            time: this.selected.time,
        };

        this.utill.navCtrl().navigateForward("locationDetail");
    }

    async getServiceCapableEmployee() {
        let services: any = [];
        await _.map(this.cetegoryWithServices, (cet) => {
            _.map(cet.services, (service) => {
                if (service.select) {
                    services.push(service.id);
                }
            });
        });

        this.utill.afs
            .collection("users", (ref) => ref.where("role", "==", 2))
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
                    this.employees = res;
                } else {
                    this.utill.bookingDataState.next({
                        isCarSelected: true,
                        isServiceSelected: false,
                        isDateSelected: false,
                    });
                    this.utill.error(
                        "Non of the Detailer is available for selected service"
                    );
                }
                this.utill.stopload();
            });
    }

    async disabledSlot() {
        this.time.map((timeslot) => {
            timeslot.notNow = false;
            timeslot.availabelEmp = [];
            timeslot.NavailabelEmp = [];
            timeslot.totalEmp = 0;
        });

        let current_date: any = moment().format("YYYY/M/D");

        let current_time: any = moment().format("HH:mm");

        this.employees.forEach((element) => {
            if (element.condo.indexOf(this.location.condo) >= 0) {
                element.emppush = false;

                this.time.map((timeslot) => {
                    if (!timeslot.availabelEmp) {
                        timeslot.availabelEmp = [];
                    }
                    if (!timeslot.NavailabelEmp) {
                        timeslot.NavailabelEmp = [];
                    }
                    timeslot.totalEmp++;
                    if (timeslot.NavailabelEmp.indexOf(element.id) < 0) {
                        if (timeslot.availabelEmp.indexOf(element.id) < 0) {
                            timeslot.availabelEmp.push(element.id);
                        }
                    }
                });

                this.utill.afs
                    .collection("bookingMaster", (ref) =>
                        ref
                            .where("AvailableEmpId", "==", element.id)
                            .where("status", "==", 1)
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
                                if (
                                    moment(r.startTime, "YYYY-MM-DD HH:mm").format(
                                        "YYYY-MM-DD"
                                    ) ==
                                    moment(this.selected.date.date, "YYYY/MM/DD").format(
                                        "YYYY-MM-DD"
                                    ) &&
                                    moment(r.endTime, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD") ==
                                    moment(this.selected.date.date, "YYYY/MM/DD").format(
                                        "YYYY-MM-DD"
                                    )
                                ) {
                                    this.time.map((timeslot) => {
                                        // if (!timeslot.availabelEmp) {
                                        //   timeslot.availabelEmp = [];
                                        // }
                                        // if (!timeslot.NavailabelEmp) {
                                        //   timeslot.NavailabelEmp = [];
                                        // }

                                        if (timeslot.NavailabelEmp.indexOf(element.id) < 0) {
                                            if (timeslot.availabelEmp.indexOf(element.id) < 0) {
                                                timeslot.availabelEmp.push(element.id);
                                            }
                                        }

                                        let time = timeslot.in24;

                                        var extra = moment().format("YYYY-MM-DD") + " ";

                                        let employeeWorkStartAt = moment(
                                            extra + this.utill.convertTime(r.startTime)
                                        );

                                        let employeeWorkEndAt = moment(
                                            extra + this.utill.convertTime(r.endTime)
                                        );

                                        let timeslotTime = moment(extra + time);
                                        if (
                                            timeslotTime.isBetween(
                                                employeeWorkStartAt,
                                                employeeWorkEndAt,
                                                null,
                                                "[]"
                                            )
                                        ) {
                                            if (time >= this.utill.convertTime(r.startTime)) {
                                                timeslot.disabled = true;
                                                if (timeslot.NavailabelEmp.indexOf(element.id) < 0) {
                                                    timeslot.NavailabelEmp.push(element.id);
                                                }
                                                timeslot.availabelEmp.splice(
                                                    timeslot.availabelEmp.indexOf(element.id),
                                                    1
                                                );

                                                if (time > this.utill.convertTime(r.endTime)) {
                                                    timeslot.disabled = false;

                                                    if (
                                                        timeslot.availabelEmp.indexOf(element.id) < 0 ||
                                                        timeslot.availabelEmp.length <= 0
                                                    ) {
                                                        timeslot.availabelEmp.push(element.id);
                                                        timeslot.NavailabelEmp.splice(
                                                            timeslot.NavailabelEmp.indexOf(element.id),
                                                            1
                                                        );
                                                    }
                                                }
                                            }
                                        }
                                        element.emppush = false;
                                    });
                                } else if (
                                    moment(r.startTime, "YYYY-MM-DD HH:mm").format(
                                        "YYYY-MM-DD"
                                    ) ==
                                    moment(this.selected.date.date, "YYYY/MM/DD").format(
                                        "YYYY-MM-DD"
                                    )
                                ) {
                                    this.time.map((timeslot) => {
                                        let time = timeslot.in24;
                                        if (
                                            time >=
                                            moment(r.startTime, "YYYY-MM-DD HH:mm").format("HH:mm")
                                        ) {
                                            timeslot.disabled = true;
                                            if (timeslot.NavailabelEmp.indexOf(element.id) < 0) {
                                                timeslot.NavailabelEmp.push(element.id);
                                            }
                                            timeslot.availabelEmp.splice(
                                                timeslot.availabelEmp.indexOf(element.id),
                                                1
                                            );
                                        }
                                    });
                                }
                                return r;
                            })
                        )
                    )
                    .subscribe((res) => this.utill.stopload());
            }
        });

        if (this.selected.date.date == current_date) {
            this.time.map((timeslot) => {
                if (timeslot.in24 <= current_time) {
                    timeslot.notNow = true;
                }
            });
        }

        setTimeout(() => {
            this.time.map((timeslot, ind) => {
                let index = ind < this.time.length - 1 ? 1 : 0;
                if (
                    !timeslot.notNow &&
                    this.time[ind + index].availabelEmp.length != timeslot.totalEmp
                ) {
                    timeslot.NavailabelEmp.forEach((element, i) => {
                        if (this.time[ind + 1].availabelEmp.indexOf(element) > -1) {
                            timeslot.availabelEmp.push(element);
                            timeslot.NavailabelEmp.splice(i, 1);
                        }
                    });
                } else if (
                    timeslot.NavailabelEmp.length == 1 &&
                    this.time[ind + 1].NavailabelEmp.length == 0
                ) {
                    timeslot.availabelEmp.push(timeslot.NavailabelEmp[0]);
                    timeslot.NavailabelEmp.splice(0, 1);
                }
            });
        }, 1000);
    }

    async checkTimeAvailability() {
        let duration: number = 0;
        await this.cetegoryWithServices.forEach((services) => {
            services.services.forEach((ser) => {
                if (ser.select) {
                    duration += parseFloat(ser.duration);
                }
            });
        });
        let startm = moment(
            this.selected.date.date + " " + this.selected.time.in24,
            "YYYY/MM/DD HH:mm"
        ).format("YYYY-MM-DD HH:mm");

        let endm = moment(startm, "YYYY-MM-DD HH:mm")
            .add(duration, "m")
            .format("YYYY-MM-DD");

        let startTime = moment(
            this.selected.date.date + " " + this.selected.time.in24,
            "YYYY/MM/DD HH:mm"
        ).format("YYYY-MM-DD HH:mm");

        let date = moment(startTime, "YYYY-MM-DD HH:mm").format("YYYY-MM-DD");

        let endTime = moment(startTime, "YYYY-MM-DD HH:mm")
            .add(duration, "m")
            .format("LTS");

        endTime = moment(date + " " + endTime, "YYYY-MM-DD hh:mm:ss a").format(
            "HH:mm"
        );

        let check = false;

        for (let i = 0; i < this.time.length; i++) {
            const element = this.time[i];

            if (this.selected.time.in24 == element.in24) {
                check = true;
            }

            if (check) {
                if (endTime! > element.in24) {
                    if (element.availabelEmp.length <= 0) {
                        this.utill.bookingDataState.next({
                            isCarSelected: true,
                            isServiceSelected: false,
                            isDateSelected: false,
                        });
                        this.utill.error(
                            "Non of the Detailer is available for selected service"
                        );
                        break;
                    }
                } else {
                    if (
                        endm >
                        moment(this.selected.date.date, "YYYY/MM/DD").format("YYYY-MM-DD")
                    ) {
                        if (element.availabelEmp.length <= 0) {
                            this.utill.bookingDataState.next({
                                isCarSelected: true,
                                isServiceSelected: false,
                                isDateSelected: false,
                            });
                            this.utill.error(
                                "Non of the Detailer is available for selected service"
                            );
                            break;
                        }
                    }
                }
            }
        }
    }
}
