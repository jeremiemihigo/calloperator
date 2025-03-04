import React from 'react';

function Injoignable() {
  const [number, setNumber] = React.useState('');

  const [allNumber, setAllNumber] = React.useState([]);
  const addAnOther = (event) => {
    event.preventDefault();
    if (number !== '' && !allNumber.includes(number.trim())) {
      setAllNumber([...allNumber, number.trim()]);
      setNumber('');
    }
  };
  const deleteOne = (number) => {
    setAllNumber(allNumber.filter((x) => x !== number));
  };
  return (
    <div>
      {allNumber.map((index, key) => {
        return (
          <div key={key}>
            <input type="text" value={index} />
            <input type="submit" value="Delete" onClick={() => deleteOne(index)} />
          </div>
        );
      })}
      <input
        value={number}
        onChange={(event) => setNumber(event.target.value)}
        placeholder={allNumber.length > 0 ? 'Ajoutez un autre numero de telephone injoignable' : 'Numero de telephone'}
      />
      <input onClick={(event) => addAnOther(event)} type="submit" value="Add an other" />
    </div>
  );
}

export default Injoignable;
