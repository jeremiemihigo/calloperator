import ImageAttente from 'assets/images/icons/attente.svg';
function NoCustomer({ texte }) {
  return (
    <div
      style={{
        display: 'flex',
        height: '20rem',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src={ImageAttente} height={100} alt="attenteImage" />
        </div>
        <div>
          <p style={{ padding: '0px', textAlign: 'center', marginTop: '15px', fontSize: '15px', fontWeight: 'bolder' }}>{texte}</p>
        </div>
      </div>
    </div>
  );
}

export default NoCustomer;
