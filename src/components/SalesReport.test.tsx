import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SalesReport from './SalesReport';

it('renders name tag', () => {
  const div = document.createElement('div');

  var dummyRecords = [{id:0, item:"string", price:0, date:"2018-11-20T01:57:36.268Z"}]

  ReactDOM.render(<SalesReport currentItem={{item:"Unit Test"}} initRecords={dummyRecords}/>, div);
  
  const found = div.getElementsByClassName("Name-tag").item(0) as HTMLElement;
  expect(found.innerHTML).toEqual("Unit Test");
  
  ReactDOM.unmountComponentAtNode(div);
});

it('renders records table', () => {
    const div = document.createElement('div');
  
    var dummyRecords = [{id:0, item:"string", price:0, date:"2018-11-20T01:57:36.268Z"}]
    
    ReactDOM.render(<SalesReport currentItem={{item:"Unit Test"}} initRecords={dummyRecords}/>, div);
    
    var found = div.getElementsByClassName("report-Table-row").item(0) as HTMLElement;
    expect(found.innerHTML).toEqual("0");

    found = div.getElementsByClassName("report-Table-row").item(1) as HTMLElement;
    expect(found.innerHTML).toEqual("1.57, 20");
    
    ReactDOM.unmountComponentAtNode(div);
  });