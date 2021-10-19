import {Address} from "./deliveries/adresses";
import {Subject} from "rxjs";

export class GlobalComponents {
  public clientAddressChange = new Subject<number>();
  private clientAddress: Address[]

  setAddress(address: Address) {
    this.clientAddress = [];
    this.clientAddress.push(address);
  }

  getAddress() {
    return this.clientAddress;
  }
}
