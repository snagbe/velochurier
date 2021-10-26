import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

interface Delivery {
  id: string;
  lat: number;
  lng: number;
  date: Date;
}

@Injectable()
export class DeliveryResolver implements Resolve<Delivery>{
  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Delivery> | Promise<Delivery> | Delivery {
    const data: Delivery = {
      id: route.params['id'],
      lat: route.params['lat'],
      lng: route.params['lng'],
      date: route.params['date'],
    }
    return data;
  }
}
