import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AddressComponent} from "../../address/address.component";
import {AutocompleteComponent} from "../../autocomplete/autocomplete.component";
import {ActivatedRoute, Data, Router} from "@angular/router";
import {Address} from "../../address/addresses";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {GlobalComponents} from "../../global-components";
import {Subscription} from "rxjs";
import {FirebaseService} from "../../firebase/firebase.service";
import {ConfirmationDialog} from "../../confirmation-dialog/confirmation.dialog";
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit, AfterViewInit {
  @ViewChild('orderForm', {static: false}) orderForm: NgForm;
  @ViewChild('autoClient') autoClient: AutocompleteComponent;
  @ViewChild('address') address: AddressComponent;

  pageTitle: string;
  company: string;
  surname: string;
  name: string;
  street: string;
  zip: number;
  city: string;
  mail: string;
  phone: string;
  clientDescription: string;

  //cache Fields
  cacheClientCompany: string;
  cacheClientSurname: string;
  cacheClientName: string;

  subscription: Subscription;
  selectedAddress: Address[];

  currentId: any;
  currentDate: Date;

  rootRef: any;

  dialogRef: MatDialogRef<ConfirmationDialog>;

  constructor(private db: AngularFireDatabase,
              private globalComp: GlobalComponents,
              private router: Router,
              private route: ActivatedRoute,
              private firebaseService: FirebaseService,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {

    this.pageTitle = "Kunde bearbeiten";
    this.route.data.subscribe(
      (data: Data) => {
        this.currentId = data['customer'].orderId;
      }
    );
    this.firebaseService.getAddressById(this.currentId);

    this.subscription = this.globalComp.addressChange
      .subscribe(() => {
        this.selectedAddress = this.globalComp.getAddress();
        if ('Empfänger' === this.selectedAddress[0].type) {
          this.company = this.selectedAddress[0].company;
          this.cacheClientCompany = this.selectedAddress[0].company;
          this.surname = this.selectedAddress[0].surname;
          this.cacheClientSurname = this.selectedAddress[0].surname;
          this.name = this.selectedAddress[0].name;
          this.cacheClientName = this.selectedAddress[0].name;
          this.zip = this.selectedAddress[0].zip;
          this.city = this.selectedAddress[0].city;
          this.street = this.selectedAddress[0].street;
          this.mail = this.selectedAddress[0].email;
          this.phone = this.selectedAddress[0].phone;
          this.clientDescription = this.selectedAddress[0].description;
        }
      })
  }

  public onSaveAddress() {

    this.firebaseService.removeAddress(this.currentId);
    this.firebaseService.saveAddress(this.address);

    this.onBack();
  }

  public onBack() {
    this.router.navigate(['/customers']);
  }

  /**
   * Remove the selected order in the firebase.
   */
  onDeleteAddress() {
    this.dialogRef = this.dialog.open(ConfirmationDialog, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = "Sind Sie sich sicher, dass Sie den Kunden löschen möchten?"

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.firebaseService.removeAddress(this.currentId);
        this.onBack();
      }
      this.dialogRef = null;
    });
  }

  ngAfterViewInit(): void {
  }
}
