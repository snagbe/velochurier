import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

interface Order {
  id: string;
  date: Date;
}

@Injectable()
export class OrderResolver implements Resolve<Order>{
  constructor() {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order> | Promise<Order> | Order {
    const data: Order = {
      id: route.params['id'],
      date: route.params['date'],
    }
    return data;
  }
}
