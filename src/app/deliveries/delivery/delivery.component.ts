import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Address} from "../../address/addresses";
import {DeliveriesService} from "../deliveries.service";

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit {
  @ViewChild('deliverBottomSheet') DeliverBottomSheet: TemplateRef<any>;
  @Output() featureSelected = new EventEmitter<string>();
  @Input() currentIndex: number;
  addresses :Address[];

  constructor(private bottomSheet: MatBottomSheet, private db: AngularFireDatabase, private deliveriesService: DeliveriesService){ }

  ngOnInit(): void {
    //console.log(this.currentIndex);
    this.deliveriesService.getAddresses().subscribe(value => this.addresses = value);
  }

  onBack(feature: string){
    this.featureSelected.emit(feature);
  }

  openDeliverSheetMenu() {
    this.bottomSheet.open(this.DeliverBottomSheet);
  }
  closeDeliverSheetMenu() {
    this.bottomSheet.dismiss();
  }

  deleteDeliver(deliveryMethod, address) {
    //this.db.object('/address/' + address.id).remove();
  }
}
