// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('App', () => {
  const mockPosts = [
    { id: 1, title: 'Post 1', body: 'Body 1' },
    { id: 2, title: 'Post 2', body: 'Body 2' },
    { id: 3, title: 'Post 3', body: 'Body 3' },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValueOnce({ data: mockPosts });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the list of posts', async () => {
    render(<App />);

    await act(async () => {
      const postElements = await screen.findAllByTestId('post-item');
      expect(postElements.length).toBe(mockPosts.length);

      for (let i = 0; i < mockPosts.length; i++) {
        expect(postElements[i]).toHaveTextContent(mockPosts[i].title);
        expect(postElements[i]).toHaveTextContent(mockPosts[i].body);
      }
    });
  });

  test('filters posts by title', async () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText('Search posts');
    act(() => {
      searchInput.value = 'Post 1';
      searchInput.dispatchEvent(new InputEvent('input'));
    });

    await act(async () => {
      const postElements = await screen.findAllByTestId('post-item');
      expect(postElements.length).toBe(1);
      expect(postElements[0]).toHaveTextContent('Post 1');
      expect(postElements[0]).toHaveTextContent('Body 1');
    });
  });

  test('handles API request error', async () => {
    axios.get.mockRejectedValueOnce(new Error('API request error'));

    render(<App />);

    await act(async () => {
      const errorElement = await screen.findByTestId('error-message');
      expect(errorElement).toHaveTextContent('Error fetching posts');
    });
  });
});
