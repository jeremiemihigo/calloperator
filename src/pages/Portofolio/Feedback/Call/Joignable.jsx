import { Autocomplete, Checkbox, FormControl, FormControlLabel, Paper, TextField } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { ContextFeedback } from '../Context';
import SaveComponent from './SaveComponent';

function Joignable() {
  const { projetSelect, client } = React.useContext(ContextFeedback);
  const projet = useSelector((state) => state.projet.projet);
  const [phoneNumber, setPhoneNumber] = React.useState([]);
  const [numberSelect, setNumberSelect] = React.useState([]);

  const [formulaire, setFormulaire] = React.useState();
  React.useEffect(() => {
    let pro = _.filter(projet, { id: projetSelect });
    if (pro.length > 0) {
      setFormulaire(pro[0].questions);
    } else {
      setFormulaire();
    }
  }, [projetSelect]);
  const [values, setValue] = React.useState([]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValue((prev) => {
      const existingIndex = prev.findIndex((item) => item.idQuestion === name);
      if (existingIndex !== -1) {
        // Si l'entrée existe, on met à jour sa valeur
        const updatedValues = [...prev];
        updatedValues[existingIndex].reponse = value;
        return updatedValues;
      } else {
        // Sinon, on ajoute une nouvelle entrée
        return [...prev, { idQuestion: name, reponse: value }];
      }
    });
  };

  const handleChangeBoxMany = (event) => {
    const { name, value } = event.target;
    setValue((prev) => {
      const existingIndex = prev.findIndex((item) => item.idQuestion === name);
      if (existingIndex !== -1) {
        const updatedValues = [...prev];
        if (updatedValues[existingIndex].reponse.includes(value)) {
          updatedValues[existingIndex].reponse = updatedValues[existingIndex].reponse.filter((x) => x !== value);
        } else {
          updatedValues[existingIndex].reponse.push(value);
        }
        // Si l'entrée existe, on met à jour sa valeur
        return updatedValues;
      } else {
        return [...prev, { idQuestion: name, reponse: [value] }];
      }
    });
    // Sinon, on ajoute une nouvelle entrée
  };
  const valueSelect = (question, value) => {
    let q = values.filter((x) => x.idQuestion === question);
    if (q.length > 0) {
      if (q[0].reponse === value) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  React.useEffect(() => {
    if (client) {
      const { first_number, second_number, payment_number } = client;
      setPhoneNumber(_.uniq([first_number, second_number, payment_number]).filter((x) => x !== ''));
    }
  }, [client]);

  return (
    <div>
      {formulaire && client && numberSelect && (
        <Paper sx={{ padding: '10px' }}>
          <div className="question">
            <p>Contact du client</p>
            <div style={{ marginTop: '10px' }}>
              <Autocomplete
                multiple
                value={numberSelect}
                disabled={phoneNumber.length === 0 ? true : false}
                id="tags-outlined"
                onChange={(event, newValue) => {
                  if (typeof newValue === 'string') {
                    setNumberSelect({
                      title: newValue
                    });
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    setNumberSelect({
                      title: newValue.inputValue
                    });
                  } else {
                    setNumberSelect(newValue);
                  }
                }}
                options={phoneNumber}
                getOptionLabel={(option) => option}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Phone number"
                    placeholder={phoneNumber.length === 0 ? 'No Phone number upload for this customer' : 'Select a number'}
                  />
                )}
              />
            </div>
          </div>
          {formulaire.map((index, key) => {
            return (
              <div key={index._id} className="question">
                <p>
                  {key + 1}.{index.question}
                  {index.required === true ? <span style={{ color: 'red', fontWeight: 'bolder' }}>*</span> : ''}
                </p>
                {['date', 'text'].includes(index.type) && (
                  <div style={{ marginTop: '10px' }}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="Feedback about this question"
                      name={index.id}
                      onChange={(event) => handleChange(event)}
                      type={index.type}
                    />
                  </div>
                )}
                {index.type === 'select_one' &&
                  index.valueSelect.map((item) => {
                    return (
                      <React.Fragment key={item._id}>
                        <FormControl component="fieldset" variant="standard">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={valueSelect(index.id, item.title)}
                                onChange={(event) => handleChange(event)}
                                value={item.title}
                              />
                            }
                            label={item.title}
                            name={index.id}
                          />
                        </FormControl>
                      </React.Fragment>
                    );
                  })}
                {index.type === 'select_many' &&
                  index.valueSelect.map((item) => {
                    return (
                      <React.Fragment key={item._id}>
                        <FormControl component="fieldset" variant="standard">
                          <FormControlLabel
                            control={<Checkbox onChange={handleChangeBoxMany} value={item.title} />}
                            label={item.title}
                            name={index.id}
                          />
                        </FormControl>
                        {values.filter((x) => x.idQuestion === item.id).length > 0 && item.next_question !== '' && (
                          <p>{item.next_question}</p>
                        )}
                      </React.Fragment>
                    );
                  })}
                {index.valueSelect.map((item, key) => {
                  return (
                    <React.Fragment key={key}>
                      {values.filter((x) => x.idQuestion === index.id).length > 0 &&
                        item.next_question !== '' &&
                        values.filter((x) => x.idQuestion === index.id)[0].reponse === item.title && (
                          <>
                            <p>
                              {item.next_question}
                              {item.required ? <span style={{ fontWeight: 'bolder', color: 'red' }}>*</span> : ''}
                            </p>
                            <TextField
                              variant="outlined"
                              fullWidth
                              label="Feedback about this question"
                              name={item.id}
                              onChange={(event) => handleChange(event)}
                              type="text"
                            />
                          </>
                        )}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })}
          {numberSelect.length > 0 && values.length > 0 && (
            <SaveComponent
              donner={{
                feedback: values,
                type: 'Reachable',
                date_to_recall: 0,
                contact: numberSelect.join(';')
              }}
              formulaire={formulaire}
            />
          )}
        </Paper>
      )}
    </div>
  );
}

export default Joignable;
