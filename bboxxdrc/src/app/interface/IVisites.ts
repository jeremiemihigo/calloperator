export interface IVisite {
  codeclient: string;
  clientStatut: string;
  PayementStatut: string;
  consExpDays: number;
  idDemande: string;
  dateSave: Date;
  nomClient: string;
  demandeur: {
    nom: string;
    codeAgent: string;
    fonction: string;
  };
  demande: {
    updatedAt: Date;
    raison: string;
  };
}
export interface IVisitsField {
  agent_name: string;
  agent_fonction: string;
  customer_id: string;
  PayementStatut: string;
  clientStatut: string;
  demandeur: string;
  customer_name: string;
  consExpDays: number;
  shop: string;
  region: string;
  dateSave: string;
  raison: string;
  indt: IVisite[];
}
