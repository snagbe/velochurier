import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AddressComponent} from "../../address/address.component";
import {AutocompleteComponent} from "../../autocomplete/autocomplete.component";
import {ActivatedRoute, Data, Router} from "@angular/router";
import {Address} from "../../address/addresses";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {GlobalComponents} from "../../global-components";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  @ViewChild('orderForm', {static: false}) orderForm: NgForm;
  @ViewChild('client') client: AddressComponent;
  @ViewChild('autoClient') autoClient: AutocompleteComponent;
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

  subscription: Subscription;
  selectedAddress: Address[];

  currentId: any;
  currentDate: any;
  orderType: string;

  constructor(private db: AngularFireDatabase,
              private globalComp: GlobalComponents,
              private router: Router,
              private route: ActivatedRoute)
  { }

  ngOnInit(): void {

    this.pageTitle = "Auftraggeber bearbeiten";
    this.route.data.subscribe(
      (data: Data) => {
        this.currentId = data['customer'].id;
      }
    );
    this.getAddress(this.currentId);


    this.subscription = this.globalComp.addressChange
      .subscribe(() => {
        this.selectedAddress = this.globalComp.getAddress();
        if ('Empfänger' === this.selectedAddress[0].type) {
          this.clientCompany = this.selectedAddress[0].company;
          this.clientSurname = this.selectedAddress[0].surname;
          this.clientName = this.selectedAddress[0].name;
          this.clientZip = this.selectedAddress[0].zip;
          this.clientCity = this.selectedAddress[0].city;
          this.clientStreet = this.selectedAddress[0].street;
          this.clientMail = this.selectedAddress[0].email;
          this.clientPhone = this.selectedAddress[0].phone;
          this.clientDescription = this.selectedAddress[0].description;
        }
      })
  }

  public getAddress(id) {
    this.db.database.ref('address')
      .on('child_added',
        snap => {
          const key = snap.key;
          const data = snap.val();
          this.orderType = 'Empfänger';
          if (key === id) {
            // @ts-ignore
            const address: Address = {type: this.orderType, city: data.city, company: data.company, name: data.name, surname: data.surname, street: data.street, zip: data.zip, email: data.email, phone: data.phone, description: data.description};
            this.globalComp.setAddress(address);
            this.globalComp.addressChange.next();
          }
        });
  }

  onSaveAddress(resource: string) {
    let node = this.receiver;
    if (resource === 'client') {
      node = this.client;
    }
    let nodeTitle = node.company;
    if (!nodeTitle) {
      nodeTitle = node.name + ' ' + node.surname;
    }


    var rootRef = this.db.list('address');
    rootRef.set(nodeTitle, {
      "company": node.company,
      "surname": node.surname,
      "name": node.name,
      "street": node.street,
      "zip": node.zip,
      "city": node.city,
      "email": node.mail,
      "phone": node.phone,
      "description": node.description
    })

    this.onBack();
  }

  onBack() {
    this.router.navigate(['/customers']);
  }
}
