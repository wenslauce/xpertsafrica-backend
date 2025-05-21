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

export interface ProductsResponse {
  products: Product[];
  currency: string;
}

export interface DomainSearchResult {
  domain: string;
  status: 'available' | 'registered' | 'error';
  price?: number;
  currency?: string;
}
