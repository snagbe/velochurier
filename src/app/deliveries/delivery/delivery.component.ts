import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Address} from "../deliveries";
import {DeliveriesService} from "../deliveries.service";

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  @ViewChild('deliverBottomSheet') DeliverBottomSheet: TemplateRef<any>;
  @Input() currentIndex: number;
  addresses :Address[];

  constructor(private bottomSheet: MatBottomSheet, private db: AngularFireDatabase, private deliveriesService: DeliveriesService){ }

  ngOnInit(): void {
    console.log(this.currentIndex);
    this.deliveriesService.getAdresses().subscribe(value => this.addresses = value);
  }

  openDeliverSheetMenu() {
    this.bottomSheet.open(this.DeliverBottomSheet);
  }
  closeDeliverSheetMenu() {
    this.bottomSheet.dismiss();
  }

  deleteDeliver(deliveryMethod, address) {
    this.db.object('/address/' + address.id).remove();
  }
}
