/* eslint-disable react/prop-types */
import Textarea from '@mui/joy/Textarea';
function TextArea({ setValue, value, placeholder }) {
  return (
    <Textarea
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      value={value}
      minRows={2}
      sx={{
        '&::before': {
          display: 'none'
        },
        '&:focus-within': {
          outline: '2px solid var(--Textarea-focusedHighlight)',
          outlineOffset: '2px'
        }
      }}
    />
  );
}

export default TextArea;
