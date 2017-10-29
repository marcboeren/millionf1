import React, { Component } from 'react';
import './App.css';

const SEASONINFO = {
  year: 2017,
  rounds: 20
};

const DRIVERINFO = [
  { id: "vettel", code: "VET", number: 5, name: "Vettel", givenName: "Sebastian", totalPoints: 68,
    raceresults: [
       {round: 1, position: 1, points: 25, grid: 2 },
       {round: 2, position: 2, points: 18, grid: 2 },
       {round: 3, position: 1, points: 25, grid: 3 }
    ]
  },
  { id: "hamilton", code: "HAM", number: 44, name: "Hamilton", givenName: "Lewis", totalPoints: 61,
    raceresults: [
       {round: 1, position: 2, points: 18, grid: 1 },
       {round: 2, position: 1, points: 25, grid: 1 },
       {round: 3, position: 2, points: 18, grid: 2 }
    ]
  }
];


const resultviews = {
    POSITION: 'position',
    POINTS: 'points',
    QUALIFYING: 'qualifying',
}


class RaceResults extends Component {

  render() {

    if (!this.props.drivers.length) {
      return '';
    }

    var RaceResultHeaderCells = [];
    for(var round=1; round <= this.props.seasoninfo.rounds; ++round) {
      RaceResultHeaderCells.push(<td key={round}>{round}</td>);
    }
    var RaceResultsRow = this.props.drivers.map((driver) => {
      var RaceResultCells = [];
      for(var round=1; round <= this.props.seasoninfo.rounds; ++round) {
        // eslint-disable-next-line
        var raceresults = driver.raceresults.filter((raceresult) => raceresult.round === round);
        if (raceresults.length) {
          var raceresult = raceresults[0];
          var value;
          switch(this.props.resultview) {
            case resultviews.POINTS:
              value = raceresult.points;
              break;
            case resultviews.QUALIFYING:
              value = raceresult.grid;
              break;
            case resultviews.POSITION:
            default:
              value = raceresult.position;
              break;
          }
          RaceResultCells.push(<td key={round}>{value}</td>);
        }
        else {
          RaceResultCells.push(<td key={round}>-</td>);
        }
      }
      return (
        <tr key={driver.id}>
          <td className="code">{driver.code}</td>
          {RaceResultCells}
          <td className="total">{driver.totalPoints}</td>
        </tr>
      );
    });
    return (
      <table className="raceresults">
        <thead>
        <tr>
          <th className="code">Driver</th>
          {RaceResultHeaderCells}
          <th className="total">Total</th>
        </tr>
        </thead>
        <tbody>
        {RaceResultsRow}
        </tbody>
      </table>
    );
  }
}


class DriverInfo extends Component {

  constructor(props) {
    super(props);
    this.state = { selecteddrivers: new Set()
                 , resultview: resultviews.POSITION
                 };
  }

  handleDriverClick(driver) {
    var currentset = new Set(this.state.selecteddrivers);
    if (currentset.has(driver.id)) {
      currentset.delete(driver.id);
    }
    else {
      currentset.add(driver.id);
    }
    this.setState({selecteddrivers: currentset});
  }

  handleResultviewClick(resultview) {
    this.setState({resultview: resultview});
  }

  render() {
    var self = this;
    this.props.driverinfo.sort((a, b) => b.totalPoints - a.totalPoints);
    var DriverList = this.props.driverinfo.map((driver) => {
      return (
        <div className={"driver" + (this.state.selecteddrivers.has(driver.id) ? ' is-selected' : '')}
             key={driver.id}
             onClick={(e) => self.handleDriverClick(driver, e)}>
          <span className="name">{driver.name}</span><span className="points">{driver.totalPoints}</span>
        </div>
      );
    });
    var selecteddrivers = this.props.driverinfo.filter((driver) => this.state.selecteddrivers.has(driver.id));
    return (
      <div className="driverinfo">
        <h1>Formula 1 Season {this.props.seasoninfo.year}</h1>
        <div className="drivers">
          {DriverList}
        </div>
        <div className="resultviews">
          <div className={"resultview" + (this.state.resultview === resultviews.POSITION ? ' is-selected' : '')}
               onClick={(e) => self.handleResultviewClick(resultviews.POSITION, e)}>Position</div>
          <div className={"resultview" + (this.state.resultview === resultviews.POINTS ? ' is-selected' : '')}
               onClick={(e) => self.handleResultviewClick(resultviews.POINTS, e)}>Points</div>
          <div className={"resultview" + (this.state.resultview === resultviews.QUALIFYING ? ' is-selected' : '')}
               onClick={(e) => self.handleResultviewClick(resultviews.QUALIFYING, e)}>Qualifying (grid, actually)</div>
        </div>
        <div className="races">
          <RaceResults seasoninfo={this.props.seasoninfo} drivers={selecteddrivers} resultview={this.state.resultview}/>
        </div>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="app">
        <DriverInfo seasoninfo={SEASONINFO} driverinfo={DRIVERINFO}/>
      </div>
    );
  }
}

export default App;
