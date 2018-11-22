import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ItemSearch from './ItemSearch';

it('renders item list', () => {
  const div = document.createElement('div');

  ReactDOM.render(<ItemSearch selectNewItem={null} searchByName={null} items={["Unit Test"]} />, div);
  
  const found = div.getElementsByClassName("Table-row").item(0) as HTMLElement;
  expect(found.innerHTML).toEqual("Unit Test");
  
  ReactDOM.unmountComponentAtNode(div);
});