import { IFeedback } from "./IFeedbacks";
import { IPoste } from "./IPoste";
import { IRole } from "./IRoles";
import { IVisite } from "./IVisites";

export interface ITclient {
  codeclient: string;
  nomclient: string;
  month: string;
  shop: string;
  par: "PAR 30" | "PAR 60" | "PAR 90" | "PAR 120";
  region: string;
  actif: boolean;
  currentFeedback: string;
  fullDate: string;
  feedback: "APPROVED" | "REJECTED" | "PENDING" | "SUCCESS";
  submitedBy: string;
  action: "NO_ACTION" | "PENDING" | "REJECTED" | "APPROVED";
  statut_decision:
    | "WRITE_OFF"
    | "OPT_OUT"
    | "A_RECONDUIRE"
    | "TRACKING_ONGOING";
  tfeedback: IFeedback;
  derniereappel?: {
    sioui_texte: string;
  };
  incharge?: [IRole]; //a revoir
  postes?: [IPoste];
  visite_concerne?: [IVisite];
  visites: IVisite[];
  cashattendu?: number;
  cashPayer?: number;
  inprocess?: string;
}
export interface IVerificationField {
  _id: string;
  codeclient: string;
  nomclient: string;
  shop: string;
  region: string;
  par: string;
  submitedBy: string;
  visite_categori?: IVisite;
  departement: IRole[];
  postes: IPoste[];
  currentFeedback: string;
  last_call?: {
    sioui_texte: string;
  };
  vm_fonction?: IVisite;
}
export interface IVerificationField_Front {
  _id: string;
  customer_id: string;
  customer_name: string;
  shop: string;
  region: string;
  par: string;
  submitedBy: string;
  //Ancienne visite par fonction
  feedback_last_vm: string;
  date_last_vm: string;
  agent_last_vm: string;
  //visite categorisation
  last_vm_categorie_date: string;
  last_vm_categorie_agent: string;
  last_vm_for_categorie_id: string;
  feedback_call: string;
  currentFeedback: string;
  submitedby: string;
  incharge: string;
}
export interface IComment {
  commentaire: string;
  sendby: string;
  createdAt: string;
  _id: string;
}
export interface IDecision {
  decision: "WRITE_OFF" | "OPT_OUT" | "TRACKING_ONGOING";
  createdBy: string;
  codeclient: string;
  region: string;
  shop: string;
  commentaire: IComment[];
  idDepartement: string;
  month: string;
  statut: "APPROVED" | "PENDING" | "REJECTED";
  createdAt: string;
  _id: string;
}
export interface ICasValider {
  customer_id: string;
  customer_name: string;
  shop: string;
  par: string;
  region: string;
  lastfeedback: string;
  nextfeedback: string;
  submitedBy: string;
  sla: "IN SLA" | "OUT SLA";
  createdAt: string;
  idHistorique: string;
  decision: IDecision[];
  typeDecision: string;
  statutDecision: string;
}
export interface IArbitration {
  last_call?: {
    sioui_texte: string;
  };
  visites: IVisite[];
  customer_name: string;
  shop: string;
  region: string;
  par: string;
  submitedBy: string;
  //use
  id: string;
  customer_id: string;
  idFeedback: string;
  currentFeedback: string;
  nextFeedback: string;

  last_vm_agent?: string;
  last_vm_rs?: string;
  last_vm_po?: string;
}
