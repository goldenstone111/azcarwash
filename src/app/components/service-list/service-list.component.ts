import { Component, OnInit } from '@angular/core';
import { UtillService } from 'src/services/utill.service';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss'],
})
export class ServiceListComponent implements OnInit {
  data: any = {};
  cetegoryWithServices: any = [];
  constructor(
    private utill: UtillService
  ) { }

  getServices() {
    this.utill.startLoad();
    this.utill.afs.collection("category").snapshotChanges().pipe(
      map((actions: any) =>
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }))).subscribe((category) => {
          this.cetegoryWithServices = [];
          this.cetegoryWithServices = category;
          this.utill.stopload();
          this.utill.afs.collection("service").snapshotChanges().pipe(
            map((actions: any) =>
              actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { id, ...data };
              }))).subscribe((services) => {
                this.cetegoryWithServices.forEach(cet => {
                  cet.services = [];
                  services.forEach(subSer => {
                    if (cet.id == subSer.categoryId) {
                      cet.services.push(subSer)
                    }
                  });
                });
                this.utill.stopload();
              });
        });
  }

  ngOnInit() {
    this.utill.bookingDetail.subscribe((res: any) => {
      if (Object.entries(res).length != 0 && res.selectedService) {
        this.cetegoryWithServices = res.selectedService;
      } else {
        this.getServices();
      }
    });
  }

  ngAfterViewInit() {
    this.utill.bookingDetail.subscribe((res: any) => {
      if (Object.entries(res).length != 0) {
        this.data = res;
        this.cetegoryWithServices = res.selectedService;
      } else {
        this.getServices();
      }
    });
  }

  onServiceSelect(service: any) {
    if (service.select) {
      service.select = false;
    } else {
      service.select = true;
    }
  }

  ngOnDestroy() {
    this.data.selectedService = this.cetegoryWithServices;
    this.utill.bookingDetail.next(this.data)
  }
}
