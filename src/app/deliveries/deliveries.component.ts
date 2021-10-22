import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {Address} from "./deliveries";
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
  address: String;
  visibilityComponent = false;
  date = new FormControl(new Date());
  @Output() featureSelectedChild = new EventEmitter<any>();

  @ViewChild('sortBottomSheet') SortBottomSheet: TemplateRef<any>;
  @ViewChild('dateForm') dateForm: NgForm;

  constructor(private db: AngularFireDatabase, private bottomSheet: MatBottomSheet, private deliveriesService: DeliveriesService) {
  }

  ngOnInit(): void {
    this.deliveriesService.getDeliveryAddresses(this.date.value).subscribe(value => this.addresses = value);
  }

  openSortSheetMenu() {
    this.bottomSheet.open(this.SortBottomSheet);
  }

  closeSortSheetMenu() {
    this.bottomSheet.dismiss();
  }

  setSort(value: string) {
    this.sortedAddresses = [];
    const selectedDate = this.date.value.getFullYear() + '-' + (this.date.value.getMonth()+1) + '-' + this.date.value.getDate();
    this.db.database.ref('order/' + selectedDate).orderByChild('receiver/' + value)
      .on('child_added',
        snap => {
          const data = snap.val();
          this.sortedAddresses.push(data.receiver);
        });

    this.addresses = this.sortedAddresses;
  }

  onDeliveryComponent(index: number, feature: string) {
    //TODO @Samuel Nagbe: Übergabe vom Parameter address muss direkt an die Komponente DeliveryComponent gemacht werden
    this.featureSelectedChild.emit({index, feature});
  }

  onDateChanged() {
    this.deliveriesService.getDeliveryAddresses(this.date.value).subscribe(value => this.addresses = value);
  }
}
