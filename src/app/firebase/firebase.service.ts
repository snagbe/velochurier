import {Address} from "../address/addresses";
import {Injectable, ViewChild} from "@angular/core";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {GlobalComponents} from "../global-components";
import {AddressComponent} from "../address/address.component";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  @ViewChild('client') client: AddressComponent;
  @ViewChild('receiver') receiver: AddressComponent;

  orderType: string;

  clientCompany: string;
  clientName: string;

  constructor(private db: AngularFireDatabase, private globalComp: GlobalComponents) {
  }

  ngOnInit(): void {
  }

  public getAddressById(id) {
    this.db.database.ref('address')
      .on('child_added',
        snap => {
          const key = snap.key;
          const data = snap.val();
          this.orderType = 'Empfänger';
          if (key === id) {
            // @ts-ignore
            const address: Address = {
              type: this.orderType,
              city: data.city,
              company: data.company,
              name: data.name,
              surname: data.surname,
              street: data.street,
              zip: data.zip,
              email: data.email,
              phone: data.phone,
              description: data.description
            };
            this.globalComp.setAddress(address);
            this.globalComp.addressChange.next();
          }
        });
  }

  public saveAddress(node) {

    let nodeTitle = node.company;
    if (!nodeTitle) {
      nodeTitle = node.name + ' ' + node.surname;

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
    }
    return rootRef;
  }

  removeAddress(id) {
    this.db.object('address/' + id).remove();
  }

}
