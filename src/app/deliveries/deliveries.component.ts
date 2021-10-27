import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Address} from "../address/addresses";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {DeliveriesService} from "./deliveries.service";
import {FormControl, NgForm} from "@angular/forms";
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})

export class DeliveriesComponent implements OnInit {
  addresses: Address[];
  sortedAddresses: any[] = [];
  selectedSort: String;
  address: String;
  visibilityComponent = false;
  date = new FormControl(new Date());

  @ViewChild('sortBottomSheet') SortBottomSheet: TemplateRef<any>;
  @ViewChild('dateForm') dateForm: NgForm;

  constructor(private db: AngularFireDatabase,
              private bottomSheet: MatBottomSheet,
              private deliveriesService: DeliveriesService,
              private authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
    this.deliveriesService.getOrderAddresses(this.date.value, 'open', 'receiver').subscribe(value => this.addresses = value);
  }

  openSortSheetMenu() {
    this.bottomSheet.open(this.SortBottomSheet);
  }

  closeSortSheetMenu() {
    this.bottomSheet.dismiss();
  }

  setSort(value: string, valueName: string) {
    this.sortedAddresses = [];
    this.selectedSort = valueName;
    const selectedDate = this.date.value.getFullYear() + '-' + (this.date.value.getMonth() + 1) + '-' + this.date.value.getDate();
    this.db.database.ref('order/open/' + selectedDate).orderByChild('receiver/' + value)
      .on('child_added',
        snap => {
          const data = snap.val();
          this.sortedAddresses.push(data.receiver);
        });

    this.addresses = this.sortedAddresses;

    this.closeSortSheetMenu();
  }

  onDateChanged() {
    this.deliveriesService.getOrderAddresses(this.date.value, 'open', 'receiver').subscribe(value => this.addresses = value);
  }

  onDeliveryComponent(id: any, lat: number, lng: number) {
    this.router.navigate(['/delivery', {id: id, lat: lat, lng: lng, date: this.date.value}]);
  }
}
