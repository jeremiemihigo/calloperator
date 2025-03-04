// eslint-disable-next-line no-undef

const serverhost = 'https://visitetestapp.bboxxvm.com';
//const serverhost = 'http://localhost:5000';
export const puls_img = 'https://pulse.bboxx.com/v2/assets/animations/loader.gif';
export const lien_socket = serverhost;
export const lien_post = `${serverhost}/bboxx/support`;
export const lien_dt = `${serverhost}/dt`;
export const lien_read = `${serverhost}/bboxx/support`;
export const lien_readclient = `${serverhost}/bboxx/support`;
export const lien_update = `${serverhost}/bboxx/support`;
export const lien_dash = `${serverhost}/bboxx/dashboard`;
export const lien_image = `https://visitetestapp.bboxxvm.com/bboxx/image`;
export const config = {
  headers: {
    'Content-Type': 'Application/json',
    Authorization: 'Bearer ' + localStorage.getItem('auth')
  }
};
function getDates(dates) {
  const date = new Date(dates);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
export const differenceDays = (date1, date2) => {
  const dateDifferenceInDays = (dateInitial, dateFinal) => (dateFinal - dateInitial) / 86400000;
  const diff = dateDifferenceInDays(new Date(getDates(date1)), new Date(getDates(date2)));
  return diff;
};
function getFormattedDate(dates) {
  const date = new Date(dates);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
export const sla = (index) => {
  const dateDifferenceInHours = (dateInitial, dateFinal) => (dateFinal - dateInitial) / 3600000;
  const diff = dateDifferenceInHours(new Date(getFormattedDate(index.dateDebut)), new Date(getFormattedDate(index.dateFin)));
  let delai = index.delaiPrevu * 24;
  return diff > delai ? 'OUTSLA' : 'INSLA';
};
export const par = [
  { id: 1, title: 'PAR 30', value: 'PAR 30' },
  { id: 2, title: 'PAR 60', value: 'PAR 60' },
  { id: 3, title: 'PAR 90', value: 'PAR 90' },
  { id: 4, title: 'PAR 120', value: 'PAR 120' },
  { id: 5, title: 'Overall', value: 'overall' }
];
export const les_actions = ['Repossession', 'Reactivation', 'Opt-Out'];
export const les_decisions = ['Write_off', 'Opt-Out', 'Tracking_Ongoing'];
