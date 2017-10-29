import React, { Component } from 'react';
import './App.css';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

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
      RaceResultHeaderCells.push(<th className="round" key={round}>{round}</th>);
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
          RaceResultCells.push(<td className="round" key={round}>{value}</td>);
        }
        else {
          RaceResultCells.push(<td className="round" key={round}>-</td>);
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
                 , driverinfo: null
                 , seasoninfo: null
                 };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data.season) {
      var season = nextProps.data.season;
      var seasoninfo = { year: season.year, rounds: season.rounds };
      this.setState({seasoninfo: seasoninfo});

      var driverinfo = [];
      var drivers = {}
      for (var i = 0; i < season.races.length; ++i ) {
        var race = season.races[i];
        for (var j = 0; j < race.results.length; ++j ) {
          var result = race.results[j];
          var driver;
          if (drivers.hasOwnProperty(result.driver.id)) {
            driver = drivers[result.driver.id];
          }
          else{
            driver = { id: result.driver.id
                     , code: result.driver.code
                     , number: result.number
                     , name: result.driver.name
                     , givenName: result.driver.givenName
                     , totalPoints: 0
                     , raceresults: [] };
            drivers[result.driver.id] = driver;
            driverinfo.push(driver);
          }
          driver.totalPoints+= result.points;
          driver.raceresults.push({ round: race.round
                                  , position: result.position
                                  , points: result.points
                                  , grid: result.grid
                                  });
        }
      }
      this.setState({driverinfo: driverinfo});
    }
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
    if (!this.state.seasoninfo) {
      return (
        <div className="driverinfo">
          Formula 1 Season data not loaded yet, please wait...
        </div>
      );
    }
    if (!this.state.driverinfo) {
      return (
        <div className="driverinfo">
          <h1>Formula 1 Season {this.state.seasoninfo.year}</h1>
          Race data not loaded yet, please wait...
        </div>
      );
    }
    this.state.driverinfo.sort((a, b) => b.totalPoints - a.totalPoints);
    var DriverList = this.state.driverinfo.map((driver) => {
      return (
        <div className={"driver" + (this.state.selecteddrivers.has(driver.id) ? ' is-selected' : '')}
             key={driver.id}
             onClick={(e) => self.handleDriverClick(driver, e)}>
          <span className="name">{driver.name}</span><span className="points">{driver.totalPoints}</span>
        </div>
      );
    });
    var selecteddrivers = this.state.driverinfo.filter((driver) => this.state.selecteddrivers.has(driver.id));
    return (
      <div className="driverinfo">
        <h1>Formula 1 Season {this.state.seasoninfo.year}</h1>
        <div className="drivers">
          {DriverList}
        </div>
        <div className="results">
         <div className="resultviews">
           <div className={"resultview" + (this.state.resultview === resultviews.POSITION ? ' is-selected' : '')}
                onClick={(e) => self.handleResultviewClick(resultviews.POSITION, e)}>Position</div>
           <div className={"resultview" + (this.state.resultview === resultviews.POINTS ? ' is-selected' : '')}
                onClick={(e) => self.handleResultviewClick(resultviews.POINTS, e)}>Points</div>
           <div className={"resultview" + (this.state.resultview === resultviews.QUALIFYING ? ' is-selected' : '')}
                onClick={(e) => self.handleResultviewClick(resultviews.QUALIFYING, e)}>Qualifying (grid, actually)</div>
         </div>
         <div className="races">
           <RaceResults seasoninfo={this.state.seasoninfo} drivers={selecteddrivers} resultview={this.state.resultview}/>
         </div>
       </div>
      </div>
    );
  }
}

const SEASON_DATA = gql`query {
  season {
    year,
    rounds,
    races {
      round,
      name,
      results {
        position,
        number,
        driver {
          id,
          code,
          name,
          givenName,
        },
        points,
        grid,
      },
    },
  }
}`;
const DriverInfoWithData = graphql(SEASON_DATA)(DriverInfo);

class App extends Component {
  render() {
    return (
      <div className="app">
        <DriverInfoWithData/>
      </div>
    );
  }
}



export default App;


