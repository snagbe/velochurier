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
  @Input() currentIndex: number;
  @Input() currentDate: any;

  lat: number
  lng: number
  zoom: number;
  clientCount: number
  receiverAddresses: Address[];
  clientAddresses: Address[];

  constructor(private bottomSheet: MatBottomSheet, private db: AngularFireDatabase, private deliveriesService: DeliveriesService) {
  }

  ngOnInit(): void {

    this.lat = 46.85785;
    this.lng = 9.53059;
    this.zoom = 20;
    console.log('currentIndex ', this.currentIndex)
    this.deliveriesService.getOrderAddresses(this.currentDate.value, 'open', 'receiver').subscribe(value => this.receiverAddresses = value);
    this.deliveriesService.getOrderAddresses(this.currentDate.value, 'open', 'client').subscribe(value => this.clientAddresses = value);
    /*console.log(this.receiverAddresses);
    console.log(this.clientAddresses);*/
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

  onMoveToDelivered(deliveryMethod, address) {
    /*const selectedDate = this.currentDate.value.getFullYear() + '-' + (this.currentDate.value.getMonth()+1) + '-' + this.currentDate.value.getDate();
    //this.db.object('/address/' + address.id).remove();
    this.db.list('address/open/' + selectedDate)
      .on('value',
        snap => {
          const data = snap.val();
          if (data) {
            const address = new Address(eventTarget.value, data.company, data.name, data.surname, data.city, data.street, data.zip, data.mail, data.phone, eventTarget.ariaLabel);
            this.globalComp.setAddress(address);
            this.globalComp.clientAddressChange.next();
          }
        });*/
  }
}
