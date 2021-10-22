import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {Address} from "./deliveries";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {DeliveriesService} from "./deliveries.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})

export class DeliveriesComponent implements OnInit {
  addresses: Address[];
  currentIndex: number;
  sortedAddresses: any[] = [];
  address: String;
  visibilityComponent = false;
  @Output() featureSelectedChild = new EventEmitter<any>();

  @ViewChild('sortBottomSheet') SortBottomSheet: TemplateRef<any>;
  @ViewChild('dateForm') dateForm: NgForm;

  constructor(private db: AngularFireDatabase, private bottomSheet: MatBottomSheet, private deliveriesService: DeliveriesService) {
  }

  ngOnInit(): void {
    this.deliveriesService.getAdresses().subscribe(value => this.addresses = value);
    this.dateForm.value.date = '2020-10-22';//new Date('2020-10-22');
  }

  openSortSheetMenu() {
    this.bottomSheet.open(this.SortBottomSheet);
  }

  closeSortSheetMenu() {
    this.bottomSheet.dismiss();
  }

  setSort(city: string) {
    this.sortedAddresses = [];
    this.db.database.ref('address').orderByChild(city)
      .on('child_added',
        snap => {
          const data = snap.val();
          this.sortedAddresses.push(data);
        });

    this.addresses = this.sortedAddresses;
  }

  onDeliveryComponent(index: number, feature: string) {
    //TODO @Samuel Nagbe: Übergabe vom Parameter address muss direkt an die Komponente DeliveryComponent gemacht werden
    this.featureSelectedChild.emit({index, feature});
  }
}
