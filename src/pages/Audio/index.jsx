import { useRef, useState } from 'react';
import axios from '../../../node_modules/axios/index';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    console.log('record start');
    try {
      // Demande l'accès au microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = []; // Réinitialise les chunks

      // Configure le MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Collecte les données au fur et à mesure
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // Démarre l'enregistrement
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Erreur d'accès au microphone:", err);
      setError("Impossible d'accéder au microphone.");
    }
  };
  const [audiobl, setAudioB] = useState();
  const stopRecording = () => {
    // Arrête l'enregistrement
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Crée un fichier audio à partir des chunks
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioUrl(URL.createObjectURL(audioBlob));

        // Envoie le fichier audio à l'API
        setAudioB(audioBlob);
        sendAudioToAPI(audioBlob);
      };
    }
  };
  const [filename, setFilename] = useState('');
  const sendAudioToAPI = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');
      const response = await axios.post('http://localhost:60000/audio/upload', formData);
      setFilename(response.data);
    } catch (err) {
      console.error('Erreur:', err);
      setError("Impossible d'envoyer l'audio.");
    }
  };
  console.log(filename);
  return (
    <div>
      <h1>Enregistrement Audio</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!isRecording ? (
        <button onClick={startRecording}>Démarrer l&apos;enregistrement</button>
      ) : (
        <button onClick={stopRecording}>Arrêter l&apos;enregistrement</button>
      )}

      {audioUrl && (
        <div>
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
            <track src="transcript-en.vtt" kind="captions" srcLang="en" label="English" />
            <p>
              Your browser does not support HTML audio. Here is a <a href="example-audio.mp3">link to the audio</a>.
            </p>
          </audio>
          {audiobl && (
            <audio controls>
              <source src={audiobl} type="audio/mpeg" />
              <track src="transcript-en.vtt" kind="captions" srcLang="en" label="English" />
              <p>
                Your browser does not support HTML audio. Here is a <a href="example-audio.mp3">link to the audio</a>.
              </p>
            </audio>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
