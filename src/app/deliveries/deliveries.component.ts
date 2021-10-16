import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Address} from "./deliveries";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {DeliveriesService} from "./deliveries.service";

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit {

  addresses: Address[];
  sortedAddresses:any[] = [];
  address: String;

  @ViewChild('templateBottomSheet') TemplateBottomSheet: TemplateRef<any>;

  constructor(private db: AngularFireDatabase, private bottomSheet: MatBottomSheet, private deliveriesService: DeliveriesService) {
  }

  ngOnInit(): void {
    this.deliveriesService.getAdresses().subscribe(value => this.addresses = value);
  }

  openTemplateSheetMenu() {
    this.bottomSheet.open(this.TemplateBottomSheet);
  }

  closeTemplateSheetMenu() {
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



}
