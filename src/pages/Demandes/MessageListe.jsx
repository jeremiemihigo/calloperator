/* eslint-disable jsx-a11y/no-static-element-interactions */
import axios from 'axios';
import { lien, config, lien_image } from '../static/Lien';
import { useEffect, useState, useContext, Fragment } from 'react';
import { Card } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Add, Clear, Remove } from '@mui/icons-material';
import { CreateContexte } from '../Context';

function MessageListe() {
  const { setDemande, setElement } = useContext(CreateContexte);

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const loading = async () => {
    setIsLoading(true);
    const messages = await axios.get(lien + '/message', config);
    setData(messages.data);
    setIsLoading(false);
  };
  useEffect(() => {
    loading();
  }, []);
  const [messageSelect, setDemandeSelect] = useState({
    demande: '',
    reponse: '',
    message: ''
  });
  const { demande, reponse, message } = messageSelect;

  const makeFalse = async () => {
    if (message !== '') {
      const response = await axios.put(`${lien}/makeFalse/${message._id}`, config);
      console.log(response);
    }
  };
  useEffect(() => {
    makeFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);
  const [filterFn, setFilterFn] = useState({
    fn: (items) => {
      return items;
    }
  });
  const handleChange = (e) => {
    let target = e.target.value.toLowerCase();

    setFilterFn({
      fn: (items) => {
        if (target === '') {
          return items;
        } else {
          return items.filter((x) => x.message.includes(target));
        }
      }
    });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-3">
          <div className="relative mt-2 mb-2">
            <input
              type="text"
              onChange={(e) => handleChange(e)}
              className="pl-8 h-9 bg-transparent border border-gray-300 dark:border-gray-700 dark:text-white w-full rounded-md text-sm"
              placeholder="Search"
            />
            <svg
              viewBox="0 0 24 24"
              className="w-4 absolute text-gray-400 top-1/2 transform translate-x-0.5 -translate-y-1/2 left-2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          {isLoading ? (
            <p>Loading</p>
          ) : (
            data &&
            filterFn.fn(data).map((index) => {
              return (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <div
                  className="cardMessage"
                  key={index._id}
                  onClick={(e) => {
                    e.preventDefault();
                    setDemandeSelect({
                      message: index,
                      demande: index.demandeId,
                      reponse: index.reponseId
                    });
                  }}
                >
                  <p>{index.message}</p>
                  <p className="createdAt">
                    {`${new Date(index.createdAt).getDate()}/${new Date(index.createdAt).getMonth() + 1} à ${new Date(
                      index.createdAt
                    ).getHours()}:${new Date(index.createdAt).getMinutes()}`}{' '}
                    <span>{index.valide ? <DoneAllIcon fontSize="small" color="success" /> : <DoneIcon fontSize="small" />}</span>
                  </p>
                </div>
              );
            })
          )}
        </div>
        <div className="col-lg-9">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                {demande !== '' && (
                  <Card variant="elevation">
                    <div>
                      <TransformWrapper initialScale={1}>
                        {({ zoomIn, zoomOut, resetTransform }) => (
                          <Fragment>
                            <div className="tools mb-1">
                              <Add onClick={() => zoomIn()} style={{ cursor: 'pointer' }} />
                              <Remove onClick={() => zoomOut()} style={{ cursor: 'pointer' }} />
                              <Clear onClick={() => resetTransform()} style={{ cursor: 'pointer' }} />
                            </div>
                            <TransformComponent>
                              <img src={`${lien_image}/${demande[0].file}`} alt="materiel" className="imageMateriel" />
                            </TransformComponent>
                          </Fragment>
                        )}
                      </TransformWrapper>
                    </div>
                    {}
                    <div className="reclamationP">
                      <p>Code client : {demande[0].codeClient && demande[0].codeClient}</p>
                      <p>adresse : {demande[0].adresse}</p>
                      <p>
                        Statut/Raison : {demande[0].statut}/ {demande[0].raison}
                      </p>
                      <div>
                        {reponse.length === 0 && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setElement(1);
                              setDemande(demande[0]);
                            }}
                            className="btnReponse"
                          >
                            Repondre à la demande
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                )}
              </div>
              <div className="col-lg-4 justifyCenter">
                {reponse.length !== 0 ? (
                  <Card>
                    <div className="m-2">
                      <p>{reponse[0].codeClient}</p>
                      <p>{reponse[0].nomClient}</p>
                      <p>Statut du compte:</p>
                      <p>{reponse[0].PayementStatut}</p>
                      <p>Type de crédit:</p>
                      <p>Day</p>
                      <p>Temps restant avant expiration:</p>
                      <p>
                        {reponse[0].consExpDays}
                        {reponse[0].consExpDays > 1 ? ' Jours' : ' Jour'}
                      </p>
                      <p>{reponse[0].codeCu}</p>
                    </div>
                  </Card>
                ) : (
                  <p style={{ color: 'red' }}>Aucune reponse à cette demande</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageListe;
