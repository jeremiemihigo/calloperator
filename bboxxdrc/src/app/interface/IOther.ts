export interface ICombo {
  value: string;
  label: string;
}
export interface IPayement {
  account_id: string;
  shop_name: string;
  transaction_time: string;
  amount: number;
  processed_date: string;
  payment_status: string;
  provider_transact_reference: string;
  provider: string;
}
export interface IUploadClient {
  customer_id: string;
  customer_name: string;
  shop: string;
  par: string;
  region: string;
  cashattendu: number;
  cashPayer: number;
}
export interface ShopRegion {
  shop: string;
  action: number;
  decision: number;
  region: string;
}
export interface IDonner {
  validationFraude: number;
  validationField: number;
  awaiting_fields: number;
  awaiting_fraudes: number;
  vmfield: number;
  vmpo: number;
  refresh: number;
  act_decisions: ShopRegion[];
  regions: string[];
}
