import { Component, OnInit } from '@angular/core';
import { UtillService } from 'src/services/utill.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
})
export class FaqPage implements OnInit {
  faqList: any = [];
  constructor(
    private utill: UtillService
  ) { 
    this.utill.afs
    .collection("faq")
    .valueChanges()
    .subscribe(res => {
      this.faqList = res;
    });
  }

  ngOnInit() {
  }

}
