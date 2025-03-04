function Rappeler() {
  return (
    <div>
      <div>
        <label htmlFor="raison">Raison</label>
        <input htmlFor="raison" placeholder="Raison" type="text" />
      </div>
      <div>
        <label htmlFor="date">Date</label>
        <input htmlFor="date" placeholder="Date" type="date" />
      </div>
      <div>
        <input type="submit" value="Enregistrer" />
      </div>
    </div>
  );
}

export default Rappeler;
