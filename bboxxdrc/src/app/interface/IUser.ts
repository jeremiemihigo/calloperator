import { IPoste } from "./IPoste";

export interface IUser {
  nom: string;
  poste: IPoste[];
  valueFilter: string[];
}
