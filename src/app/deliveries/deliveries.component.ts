import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {Address} from "../address/addresses";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {DeliveriesService} from "./deliveries.service";
import {FormControl, NgForm} from "@angular/forms";

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
  @Output() featureSelectedChild = new EventEmitter<any>();

  @ViewChild('sortBottomSheet') SortBottomSheet: TemplateRef<any>;
  @ViewChild('dateForm') dateForm: NgForm;

  constructor(private db: AngularFireDatabase, private bottomSheet: MatBottomSheet, private deliveriesService: DeliveriesService) {
  }

  ngOnInit(): void {
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
    const selectedDate = this.date.value.getFullYear() + '-' + (this.date.value.getMonth()+1) + '-' + this.date.value.getDate();
    this.db.database.ref('order/open/' + selectedDate).orderByChild('receiver/' + value)
      .on('child_added',
        snap => {
          const data = snap.val();
          this.sortedAddresses.push(data.receiver);
        });

    this.addresses = this.sortedAddresses;

    this.closeSortSheetMenu();
  }

  onDeliveryComponent(id: any, index: number, feature: string) {
    let date = this.date;
    this.featureSelectedChild.emit({id, index, feature, date});
  }

  onDateChanged() {
    this.deliveriesService.getOrderAddresses(this.date.value, 'open', 'receiver').subscribe(value => this.addresses = value);
  }
}
