import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cetegory-info',
  templateUrl: './cetegory-info.page.html',
  styleUrls: ['./cetegory-info.page.scss'],
})
export class CetegoryInfoPage implements OnInit {
  data:any = {};
  constructor(
    private navParam: NavParams,
    private modal: ModalController
  ) { 
    
    this.data = navParam.get('data');
    
  }
 
  closeModal() {
    this.modal.dismiss();
  }

  ngOnInit() { 
  }

}
