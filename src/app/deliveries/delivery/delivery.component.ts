import {AfterViewInit, Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {Address} from "../../address/addresses";
import {DeliveriesService} from "../deliveries.service";
import {AuthService} from "../../auth/auth.service";
import {ActivatedRoute, Router, Data} from "@angular/router";

import {EmailService} from "../../email.service";
import {ConfirmationDialog} from "../../confirmation-dialog/confirmation.dialog";
import {DialogData, OverlayComponent} from "../../overlay/overlay.component";


@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css']
})
export class DeliveryComponent implements OnInit, AfterViewInit  {
  @ViewChild('deliverBottomSheet') DeliverBottomSheet: TemplateRef<any>;
  @ViewChild('editBottomSheet') EditBottomSheet: TemplateRef<any>;

  currentID: any;
  currentReceiverLat: number;
  currentReceiverLng: number;
  currentDate: Date;

  zoom: number;
  clientCount: number
  receiverAddresses: Address[];
  clientAddresses: Address[];
  currentRecord: any[] = [];


  dialogRef: MatDialogRef<ConfirmationDialog>;

  constructor(private bottomSheet: MatBottomSheet,
              private db: AngularFireDatabase,
              private deliveriesService: DeliveriesService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog,
              private overlay: OverlayComponent,
              private emailService: EmailService) {
  }

  ngOnInit(): void {
    this.authService.doAuthCheck();
    this.zoom = 18.5;
    this.route.data.subscribe(
      (data: Data) => {
        this.currentID = data['delivery'].id;
        this.currentReceiverLat = +data['delivery'].lat;
        this.currentReceiverLng = +data['delivery'].lng;
        this.currentDate = new Date(data['delivery'].date);
      }
    );
    this.deliveriesService.getOrderAddresses(this.currentDate, 'open', 'receiver').subscribe(value => this.receiverAddresses = value);
    this.deliveriesService.getOrderAddresses(this.currentDate, 'open', 'client').subscribe(value => this.clientAddresses = value);
  }

  onBack() {
    this.router.navigate(['/deliveries']);
  }

  openDeliverSheetMenu() {
    this.bottomSheet.open(this.DeliverBottomSheet);
  }

  closeDeliverSheetMenu() {
    this.bottomSheet.dismiss();
  }

  onEditOrder() {
        this.router.navigate(['order', 'edit', {orderId: this.currentID}]).then(() => {
          window.location.reload();
        });
  }

  /**
   * Move the selected order in the firebase from open to delivered.
   * @param deliveryMethod The selected delivery method.
   */
  onMoveToDelivered(deliveryMethod) {
    // get the selected Object from 'open' and push the object to the list 'currentRecord'
    const selectedDate = this.currentDate.getFullYear() + '-' + (this.currentDate.getMonth() + 1) + '-' + this.currentDate.getDate();
    this.db.list('order/open/' + selectedDate).query
      .on('child_added',
        snap => {
          const key = snap.key;
          const data = snap.val();
          if (this.currentID === key) {
            this.currentRecord.push(data);
          }
        });

    //send email
/*    const html = '<p>Diese Lieferung wurde nach folgendermassen zugestellt' + deliveryMethod + '</p>';
    this.emailService.transport('smtp.host.com', 587);
    this.emailService.sendEmail('support@yourdomain.com', 'nagbe.samuel@gmail.com', 'Test Email Subject', html);*/

    if (this.currentRecord) {
      this.db.object('order/open/' + selectedDate + '/' + this.currentID).remove();
    }

      // move the list 'currentRecord' to the 'delivered' record
      let data: DialogData;
      this.db.list('order/delivered/' + selectedDate + '/')
        .set(this.currentID, {
          "article": this.currentRecord[0].article,
          "client": this.currentRecord[0].client,
          "receiver": this.currentRecord[0].receiver,
          "deliveryMethod": deliveryMethod
        }).then(() => {
        data = {
          title: 'Zustellung',
          message: 'Der Auftrag wurde auf folgende Art: "' + deliveryMethod + '" abgeschlossen.',
          type: 'success',
          primaryButton: {name: 'Ok'}
        }
        this.overlay.openDialog(data);
      }).catch((error) => {
        data = {
          title: 'Fehler',
          message: 'Der Auftrag konnte nicht zugestellt werden.',
          type: 'error',
          primaryButton: {name: 'Ok'}
        }
        this.overlay.openDialog(data);
      });
    this.closeDeliverSheetMenu();
    this.onBack();
  }

  openEditSheetMenu() {
    this.bottomSheet.open(this.EditBottomSheet);
  }

  closeEditSheetMenu() {
    this.bottomSheet.dismiss();
  }

  /**
   * Remove the selected order in the firebase.
   */
  onDeleteOrder() {
    let data: DialogData = {
      title: 'Auftrag löschen',
      message: 'Möchtest du den Auftrag wirklich löschen?',
      type: 'confirmation',
      primaryButton: {
        name: 'Löschen', 'function': function() {
          this.deleteOrder();
        }.bind(this)
      },
      secondaryButton: {
        name: 'Abbrechen'
      }
    }
    this.overlay.openDialog(data);

    /*this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        const selectedDate = this.currentDate.getFullYear() + '-' + (this.currentDate.getMonth() + 1) + '-' + this.currentDate.getDate();
        this.db.object('order/open/' + selectedDate + '/' + this.currentID).remove();

        this.onBack();
      }
      this.dialogRef = null;
    });*/
  }

  deleteOrder() {
    const selectedDate = this.currentDate.getFullYear() + '-' + (this.currentDate.getMonth() + 1) + '-' + this.currentDate.getDate();
    this.db.object('order/open/' + selectedDate + '/' + this.currentID).remove();

    this.onBack();
    this.closeEditSheetMenu();
    let data: DialogData = {
      title: 'Auftrag gelöscht',
      message: 'Der Auftrag wurde erfolgreich gelöscht.',
      type: 'success',
      primaryButton: {name: 'Ok'}
    }
    this.overlay.openDialog(data);
  }

  ngAfterViewInit(): void {
  }

}
