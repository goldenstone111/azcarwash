import { Component, OnInit } from '@angular/core';
import { UtillService } from 'src/services/utill.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit {
  about:any = '';
  constructor(
    private utill: UtillService
  ) { 
    this.utill.startLoad();
    this.utill.afs.collection('mainAdminConfiguration')
      .valueChanges().subscribe((res: any) => {
        if(res.length != 0) {
          this.about = res[0].about;
        }
        this.utill.stopload();
      }, err => {
        this.utill.stopload();
      })
  }

  ngOnInit() {
  }

}
