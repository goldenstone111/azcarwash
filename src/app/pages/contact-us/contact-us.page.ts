import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UtillService } from 'src/services/utill.service';
declare var google;

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  about: any = {};
  map: any;
  constructor(
    private utill: UtillService
  ) {
    this.utill.startLoad();
    this.utill.afs.collection('mainAdminConfiguration')
      .valueChanges().subscribe((res: any) => {
        if(res.length != 0) {
          this.about = res[0];
        }
        setTimeout(() => {
          this.initMap();
        }, 300);
        this.utill.stopload();
      }, err => {
        this.utill.stopload();
      })
  }

  ngOnInit() {

  }

  initMap() {
    let latLng = new google.maps.LatLng(this.about.lat, this.about.lng);
    // var styledMapType = new google.maps.StyledMapType(mapStyle, { name: 'Styled Map' });
    let mapoption = {
      panControl: true,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      overviewMapControl: true,
      rotateControl: true,
      center: latLng,
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
      position: google.maps.ControlPosition.TOP_CENTER,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      icon: {
        url: "assets/imgs/dp1.png",
        size: {
          width: 50,
          height: 50
        }
      }, mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
          'styled_map']
      }
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapoption);
    // this.map.mapTypes.set('styled_map', styledMapType);
    // this.map.setMapTypeId('styled_map');
    new google.maps.Marker({
      position: new google.maps.LatLng(this.about.lat, this.about.lng),
      map: this.map
    });
  }

}
