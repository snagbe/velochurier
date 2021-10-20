import {Address} from "./deliveries/deliveries";
import {Subject} from "rxjs";

export class GlobalComponents {
  public static clientAddress: Address[];
  public geoAddressChange = new Subject<number>();
}
