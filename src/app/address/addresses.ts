export class Address {
  constructor(public id: string,
              public displayName: string,
              public company: string,
              public name: string,
              public surname: string,
              public city: string,
              public street: string,
              public zip: number,
              public email: string,
              public phone: string,
              public description: string,
              public type?: string,
              public lat?: number,
              public lng?: number) {
  }
}
