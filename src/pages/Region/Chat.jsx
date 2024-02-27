import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: 'basic-bar'
        },
        xaxis: {
          categories: ['Nord-Kivu', 'Sud-Kivu', 'Kinshasa', 'Tshopo', 'Katanga', 'Ituri']
        }
      },
      series: [
        {
          name: 'series-1',
          data: [30, 50, 49, 60, 70, 91]
        }
      ]
    };
  }

  render() {
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <Chart options={this.state.options} series={this.state.series} type="bar" width="500" />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
