import { Typography } from '@mui/material';
import Agents from './Agents';
import './liste.style.css';

function ListeProjet({ projet }) {
  const { agents, formulaire } = projet;
  return (
    <div className="listeprojet">
      <Typography noWrap component="p" className="titre_projet">
        {projet.title}
      </Typography>

      <Agents liste={agents} />
      <p className="item">A rappeler : 40</p>
      <p className="item">On going : 105</p>
      <p className="item">Formulaire : {formulaire[0]?.titre}</p>
    </div>
  );
}

export default ListeProjet;
