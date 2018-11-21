import * as React from 'react';


interface IProps {
    currentItem:any,
    records:any
}

export default class SalesReport extends React.Component<IProps, {}> {

  constructor(props: any) {
    super(props)
    this.methodNotImplemented = this.methodNotImplemented.bind(this)
  }

  public render() {
    return (
      <div className="Report">
        <p>Graph goes here</p>
      </div>
    );
  }

  
  
	private methodNotImplemented() {
		alert("Method not implemented")
	}
}
