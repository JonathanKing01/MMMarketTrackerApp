import * as React from 'react';
import {Chart} from 'react-google-charts'
import '../App.css';

interface IProps {
    currentItem:any,
    records:any,
}

export default class SalesReport extends React.Component<IProps, {}> {

  constructor(props: any) {
    super(props)  
    this.methodNotImplemented = this.methodNotImplemented.bind(this)
    this.createChart = this.createChart.bind(this)
  }

  public render() {
    
    const { currentItem } = this.props;
    return (
      <div className="Report">
        <p>{currentItem.item}</p>
        {this.createChart()}
      </div>
    );
  }

  private createChart() {
    var table:any[] = []
    const itemList = this.props.records;

    table.push(["Time", "Price"])
    for (let i = 0; i < itemList.length; i++) {
      const item = itemList[i]
      table.push([(new Date(item.date).getUTCHours()*100) + new Date(item.date).getUTCMinutes(), Number(item.price)])
    }
    // var example = [
    //   ["Year", "Sales"],
    //   [4, 1000],
    //   [5, 1170],
    //   [6, 660],
    //   [7, 1030]
    // ];

    // alert("Table[1]: " + table[1] + ", example[1]: " + example[1])

    const options = {
      title: this.props.currentItem,
      curveType: "function",
      legend: { position: "bottom" }
    };

    return (
      <Chart 
          className = "chart"
          chartType="LineChart"
          width="800px"
          height="400px"
          data={table}
          options = {options}
      />

    );
}

  
	private methodNotImplemented() {
		alert("Method not implemented")
	}
}
