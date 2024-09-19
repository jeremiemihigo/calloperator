import { useSelector } from 'react-redux';
import { returnName } from 'static/Lien';
import './structure.style.css';

function TextWithLineBreaks({ text }) {
  const user = useSelector((state) => state.user.user);
  const textWithBreaks = text.split('@p').map((index, key) => (
    <div className="title_content" key={key}>
      <p>{index.replace('@name', returnName(user?.nom))}</p>
    </div>
  ));
  return textWithBreaks;
}

export default TextWithLineBreaks;
