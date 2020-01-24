import React from 'react';
import {render} from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const {getByText} = render(<App/>);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('clicking updates count', () => {
  const {getByText} = render(<App/>);

  const buttonElement = getByText(/click me/i);
  expect(buttonElement).toBeInTheDocument();

  const counterElement = getByText(/you clicked [0-9]* times/i);
  expect(counterElement).toBeInTheDocument();
  expect(counterElement.textContent).toMatch(/you clicked 0 times/i);

  buttonElement.click();

  expect(counterElement.textContent).toMatch(/you clicked 1 times/i);
});
