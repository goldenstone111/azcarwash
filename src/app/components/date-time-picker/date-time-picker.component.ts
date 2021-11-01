import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { UtillService } from 'src/services/utill.service';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
})
export class DateTimePickerComponent implements OnInit {
  days: any = [];
  time: any = [];
  selected: any = {
    date: '',
    time: ''
  }
  data: any = {};

  constructor(
    private utill: UtillService
  ) {
    var x = 60; //minutes interval
    var times = []; // time array
    var tt = 60; // start time
    var ap = ['Am', 'Pm']; // AM-PM

    //loop to increment the time and push results in array
    for (var i = 0; tt < 24 * 60; i++) {
      var hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
      var mm = (tt % 60); // getting minutes of the hour in 0-55 format
      tt = tt + x;
      this.time.push({
        value: ("0" + (hh % 12)).slice(-2) + ':' + ("0" + mm).slice(-2),
        prefix: ap[Math.floor(hh / 12)]
      })
    }

    var current_date: any = moment(new Date(), 'YYYY/MM/DD');
    let month: any = moment(new Date()).add(6, 'month').format('M');
    for (let i = 0; i < month; i++) {
      current_date = moment(new Date()).add(i, 'month');
      let innerLoop = current_date.daysInMonth();
      for (let j = 0; j < innerLoop; j++) {
        current_date = moment(new Date()).add(j, 'days');
        let date: string = current_date.format('YYYY') + '/' + current_date.format('M') + '/' + current_date.format('D');
        this.days.push({ date: date });
      }
    }
  }

  selectDate(date) {
    this.days.map((r) => { r.selected = false });
    date.selected = true;
    this.selected.date = date;
  }

  selectTime(time) {
    this.time.map((r) => { r.selected = false });
    time.selected = true;
    this.selected.time = time;
  }

  ngOnInit() {
    this.getSelectedDate();
  }

  ngAfterViewInit() {
    this.getSelectedDate();
  }

  getSelectedDate() {
    this.utill.bookingDetail.subscribe((res: any) => {
      this.data = res;
      if (Object.entries(res).length != 0) {
        this.selected.date = res.date;
        this.selected.time = res.time;
      }
    });
  }

}
