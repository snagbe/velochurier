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

  /**
   * opens the form that displays the sorting options
   */
  openSortSheetMenu() {
    this.bottomSheet.open(this.SortBottomSheet);
  }

  /**
   * closes the form that displays the sorting options
   */
  closeSortSheetMenu() {
    this.bottomSheet.dismiss();
  }

  /**
   * sets the sorting like the selected option
   * @param value the database entry
   * @param valueName the display name
   */
  setSort(value: string, valueName: string) {
    this.sortedAddresses = [];
    this.selectedSort = valueName;
    let date = new Date(this.date.value);
    const selectedDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    this.db.database.ref('order/open/' + selectedDate).orderByChild('receiver/' + value)
      .on('child_added',
        snap => {
          const data = snap.val();
          this.sortedAddresses.push(data.receiver);
        });
    this.addresses = this.sortedAddresses;
    this.closeSortSheetMenu();
  }

  /**
   * checks if there are deliveries for the selected date
   * @param addresses the list of deliveries
   */
  isValid(addresses) {
    return addresses === undefined || !addresses.length;
  }

  /**
   * calls up the outstanding deliveries based on the selected date
   */
  onDateChanged() {
    this.deliveriesService.getOrderAddresses(this.date.value, 'open', 'receiver').subscribe(value => this.addresses = value);
  }

  /**
   * Navigates to the delivery component
   * @param id delivery id
   * @param lat delivery Latitude
   * @param lng delivery longitude
   */
  onDeliveryComponent(id: any, lat: number, lng: number) {
    this.router.navigate(['/delivery', {id: id, lat: lat, lng: lng, date: this.date.value}]);
  }
}
