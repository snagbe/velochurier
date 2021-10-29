import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AddressComponent} from "../../address/address.component";
import {AutocompleteComponent} from "../../autocomplete/autocomplete.component";
import {ActivatedRoute, Data, Router} from "@angular/router";
import {Address} from "../../address/addresses";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {GlobalComponents} from "../../global-components";
import {Subscription} from "rxjs";
import {FirebaseService} from "../../firebase/firebase.service";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  @ViewChild('orderForm', {static: false}) orderForm: NgForm;
  @ViewChild('autoClient') autoClient: AutocompleteComponent;
  @ViewChild('client') client: AddressComponent;
  @ViewChild('receiver') receiver: AddressComponent;

  pageTitle: string;
  clientCompany: string;
  clientSurname: string;
  clientName: string;
  clientStreet: string;
  clientZip: number;
  clientCity: string;
  clientMail: string;
  clientPhone: string;
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

  constructor(private db: AngularFireDatabase,
              private globalComp: GlobalComponents,
              private router: Router,
              private route: ActivatedRoute,
              private firebaseService: FirebaseService)
  { }

  ngOnInit(): void {

    this.pageTitle = "Kunde bearbeiten";
    this.route.data.subscribe(
      (data: Data) => {
        this.currentId = data['customer'].id;
      }
    );
    this.firebaseService.getAddressById(this.currentId);

    this.subscription = this.globalComp.addressChange
      .subscribe(() => {
        this.selectedAddress = this.globalComp.getAddress();
        if ('Empfänger' === this.selectedAddress[0].type) {
          this.clientCompany = this.selectedAddress[0].company;
          this.cacheClientCompany = this.selectedAddress[0].company;
          this.clientSurname = this.selectedAddress[0].surname;
          this.cacheClientSurname = this.selectedAddress[0].surname;
          this.clientName = this.selectedAddress[0].name;
          this.cacheClientName = this.selectedAddress[0].name;
          this.clientZip = this.selectedAddress[0].zip;
          this.clientCity = this.selectedAddress[0].city;
          this.clientStreet = this.selectedAddress[0].street;
          this.clientMail = this.selectedAddress[0].email;
          this.clientPhone = this.selectedAddress[0].phone;
          this.clientDescription = this.selectedAddress[0].description;
        }
      })
  }

  public onSaveAddress(resource: string) {
    let node = this.receiver;
    let nodeTitle;
    if (resource === 'client') {
      node = this.client;
      nodeTitle = this.cacheClientCompany;
      if (!nodeTitle) {
        nodeTitle = this.cacheClientName + ' ' + this.cacheClientSurname;
      }
    }

    this.firebaseService.removeAddress(nodeTitle);
    this.firebaseService.saveAddress(node);

    this.onBack();
  }

  public onBack() {
    this.router.navigate(['/customers']);
  }
}
