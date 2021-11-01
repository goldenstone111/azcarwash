import { Component, OnInit } from '@angular/core';
import { UtillService } from 'src/services/utill.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
})
export class TermsPage implements OnInit {
  policy:any = '';
  constructor(
    private utill: UtillService
  ) { 
    this.utill.startLoad();
    this.utill.afs.collection('mainAdminConfiguration')
    .valueChanges().subscribe((res:any) => {
      if(res.length != 0) {
        this.policy = res[0].policy;
      }
      this.utill.stopload();
    }, err => {
      this.utill.stopload();
    })
  }
 
  ngOnInit() {
  }

}
