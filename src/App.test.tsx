import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

it('renders title text', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  
  const found = div.getElementsByClassName("App-title").item(0) as HTMLElement;
  expect(found.innerHTML).toEqual("Welcome to MMO Market Tracker");
  
  ReactDOM.unmountComponentAtNode(div);
});
