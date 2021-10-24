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
  @Input() currentDate: any;

  zoom: number;
  receiverCount: number;
  clientCount: number
  receiverAddresses: Address[];
  clientAddresses: Address[];

  constructor(private bottomSheet: MatBottomSheet, private db: AngularFireDatabase, private deliveriesService: DeliveriesService) {
  }

  ngOnInit(): void {
    this.zoom = 20;

    this.deliveriesService.getOrderAddresses(this.currentDate.value, 'open', 'receiver').subscribe(value => this.receiverAddresses = value);
    this.deliveriesService.getOrderAddresses(this.currentDate.value, 'open', 'client').subscribe(value => this.clientAddresses = value);
    console.log(this.receiverAddresses);
    console.log(this.clientAddresses);
  }

  onBack(feature: string) {
    this.featureSelected.emit(feature);
  }

  checkIsEmpty() {
    console.log('test');
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
