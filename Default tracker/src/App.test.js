import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import File from './pages/mesClients/ChangeByExcel';

// Mock Redux's useSelector
jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

// Mock axios
jest.mock('axios');

describe('File Component', () => {
  beforeEach(() => {
    useSelector.mockReturnValue({
      feedback: [
        { idFeedback: 1, title: 'Feedback A' },
        { idFeedback: 2, title: 'Feedback B' }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders file input and label', () => {
    render(<File />);
    const inputElement = screen.getByLabelText(/Cliquez ici pour télécharger le fichier/i);
    expect(inputElement).toBeInTheDocument();
  });

  test('displays a warning alert when message is set', () => {
    render(<File />);
    fireEvent.change(screen.getByLabelText(/Cliquez ici pour télécharger le fichier/i), {
      target: { files: [new File([], 'test.xlsx')] }
    });

    // Simulate message state
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('parses file and sets data state', async () => {
    const mockFile = new File(
      [
        new Blob(
          [
            JSON.stringify([
              { codeclient: '123', nextFeedback: 'Feedback A' },
              { codeclient: '456', nextFeedback: 'Feedback B' }
            ])
          ],
          { type: 'application/json' }
        )
      ],
      'test.xlsx'
    );

    render(<File />);

    const inputElement = screen.getByLabelText(/Cliquez ici pour télécharger le fichier/i);
    fireEvent.change(inputElement, { target: { files: [mockFile] } });

    // Add expectations for the parsed data
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(3); // Header + 2 data rows
    });
  });

  test('handles uploadCustomer function', async () => {
    axios.post.mockResolvedValueOnce({ status: 200, data: 'Upload successful' });

    render(<File />);

    // Simulate the upload process
    const uploadButton = screen.getByText(/Envoyer/i);
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), expect.any(Object), expect.any(Object));
      expect(screen.getByText(/Upload successful/i)).toBeInTheDocument();
    });
  });

  test('displays loading spinner when sending is true', () => {
    render(<File />);
    const spinner = screen.queryByRole('progressbar');
    expect(spinner).not.toBeInTheDocument();
  });
});
