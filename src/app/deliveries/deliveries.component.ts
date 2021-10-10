import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Address} from "./deliveries";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {map} from "rxjs/operators";
import {MatBottomSheet} from "@angular/material/bottom-sheet";

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

  constructor(private db: AngularFireDatabase, private bottomSheet: MatBottomSheet) {
  }

  ngOnInit(): void {
    this.getAdresses().subscribe(value => this.addresses = value);

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

public getAdresses()
{
  return this.db.list('address')
    .snapshotChanges()
    .pipe(map(items => {
      return items.map(a => {
        const data = a.payload.val();
        const key = a.payload.key;
        // @ts-ignore
        const address: Address = {id: key, city: data.city, street: data.street, zip: data.zip};
        return address;
      });
    }));
}


}
