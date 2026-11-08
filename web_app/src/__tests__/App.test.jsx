import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('页面渲染成功', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /董小姐/i })).toBeInTheDocument();
});