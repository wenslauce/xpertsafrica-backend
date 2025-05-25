/**
 * Common WHMCS API types and interfaces
 */

export interface WhmcsApiResponse<T = any> {
  result: 'success' | 'error';
  message?: string;
  data?: T;
  totalresults?: number;
  startnumber?: number;
  numreturned?: number;
}

export interface DomainWhoisResponse {
  result: string;
  status: 'available' | 'registered';
  domain: string;
  pricing?: {
    register: string;
    transfer: string;
    renew: string;
  };
  currency?: string;
}

export interface TldPricingResponse {
  tlds: Array<{
    tld: string;
    register: string;
    transfer: string;
    renew: string;
    currency: string;
  }>;
}

export interface Product {
  pid: number;
  name: string;
  description: string;
  pricing: {
    monthly?: number;
    quarterly?: number;
    semiannually?: number;
    annually?: number;
    biennially?: number;
    triennially?: number;
  };
  features: string[];
  currency: string;
  currencyCode?: string;
  currencySymbol?: string;
  suffix?: string;
  group: string;
  storage?: string;
  recommended?: boolean;
}

export interface ProductsResponse extends WhmcsApiResponse {
  products?: {
    product: Record<string, Product>;
  };
  currency?: string;
}

export interface Currency {
  id: string;
  code: string;
  prefix: string;
  suffix: string;
  default: string;
  rate: string;
}

export interface CurrenciesResponse extends WhmcsApiResponse {
  currencies?: {
    currency: Record<string, Currency>;
  };
}

export interface DomainSearchResult {
  domain: string;
  status: 'available' | 'registered' | 'error';
  price?: number;
  currency?: string;
}

export interface Invoice {
  id: number;
  userid: number;
  status: string;
  total: string;
  balance: string;
  date: string;
  duedate: string;
  datepaid?: string;
  subtotal: string;
  tax: string;
  tax2: string;
  credit: string;
  items: {
    item: Array<{
      id: string;
      type: string;
      description: string;
      amount: string;
    }>;
  };
  transactions: {
    transaction: Array<{
      id: string;
      date: string;
      gateway: string;
      transid: string;
      amount: string;
    }>;
  };
}

export interface Order {
  orderid: string;
  ordernum: string;
  userid: string;
  date: string;
  status: string;
  amount: string;
  paymentstatus: string;
  paymentmethod: string;
  invoiceid: string;
  items: Array<{
    id: string;
    type: string;
    description: string;
    amount: string;
    status: string;
  }>;
}

export interface Client {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  phonenumber: string;
  currency_id: number;
  credit: string;
  status: string;
  language: string;
  notes: string;
  groupid: number;
  lastlogin: string;
  customfields: Array<{
    id: string;
    value: string;
  }>;
}

export interface InvoiceResponse extends WhmcsApiResponse {
  invoice: Invoice;
}

export interface OrderResponse extends WhmcsApiResponse {
  order: Order;
}

export interface OrdersResponse extends WhmcsApiResponse {
  orders: {
    order: Array<Order>;
  };
}

export interface ClientResponse extends WhmcsApiResponse {
  client: Client;
}
