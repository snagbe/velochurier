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
  @Input() currentID: any;
  @Input() currentReceiverLat: number;
  @Input() currentReceiverLng: number;
  @Input() currentDate: any;

  zoom: number;
  clientCount: number
  receiverAddresses: Address[];
  clientAddresses: Address[];
  currentRecord: any[] = [];

  constructor(private bottomSheet: MatBottomSheet, private db: AngularFireDatabase, private deliveriesService: DeliveriesService) {
  }

  ngOnInit(): void {
    this.zoom = 20;
    /*console.log('currentReceiverLat ', this.currentReceiverLat);
    console.log('currentReceiverLng ', this.currentReceiverLng);
    console.log('currentID ', this.currentID);
    console.log('currentDate ', this.currentDate);*/
    this.deliveriesService.getOrderAddresses(this.currentDate.value, 'open', 'receiver').subscribe(value => this.receiverAddresses = value);
    this.deliveriesService.getOrderAddresses(this.currentDate.value, 'open', 'client').subscribe(value => this.clientAddresses = value);
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

  /**
   * move the selected order in the firebase from open to delivered
   * @param deliveryMethod method to send the email
   */
  onMoveToDelivered(deliveryMethod) {
    this.currentRecord = [];
    // get the selected Object from 'open' and push the object to the list 'currentRecord'
    const selectedDate = this.currentDate.value.getFullYear() + '-' + (this.currentDate.value.getMonth() + 1) + '-' + this.currentDate.value.getDate();
    this.db.list('order/open/' + selectedDate).query
      .on('child_added',
        snap => {
          const key = snap.key;
          const data = snap.val();
          if (this.currentID === key) {
            this.currentRecord.push(data);
          }
        });

    // remove the selected Object
    if (this.currentRecord) {
      this.db.object('order/open/' + selectedDate + '/' + this.currentID).remove();

    }

    let article = this.currentRecord[0].article;
    let client = this.currentRecord[0].client;
    let receiver = this.currentRecord[0].receiver;

    // move the list 'currentRecord' to the 'delivered' record
    this.db.list('order/delivered/' + selectedDate + '/')
      .set(this.currentID, {
        "article": article,
        "client": client,
        "receiver": receiver
      })
    this.closeDeliverSheetMenu();
    this.onBack('deliveries');
  }
}
