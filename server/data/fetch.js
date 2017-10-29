
import request from "sync-request"; // sorry, just initializing here so I can press...
import { find, filter } from 'lodash';

const season_url = 'https://ergast.com/api/f1/{year}.json';
const round_url = 'https://ergast.com/api/f1/{year}/{round}/results.json';

const fetch_season = (year) => {

    var model = {
        season: null,
        drivers: [],
        constructors: [],
        races: [],
        raceresults: [],
    };

    console.log(year);
    var response = request('GET', season_url.replace('{year}', year.toString()));
    let data = JSON.parse(response.body.toString('utf-8'));

    model.season = { year: data.MRData.RaceTable.season, races: [] };

    var rounds = data.MRData.RaceTable.Races.length;
    for (var round = 1; round <= rounds; ++round) {
        console.log("Round: "+round.toString());
        response = request('GET', round_url.replace('{year}', year.toString()).replace('{round}', round.toString()));
        let data = JSON.parse(response.body.toString('utf-8'));
        if (!data.MRData.RaceTable.Races.length) continue;
        var racedata = data.MRData.RaceTable.Races[0];
        var race = { season: model.season,
                     round: parseInt(racedata.round),
                     name: racedata.raceName,
                     date: racedata.date,
                   }
        for (var i = 0; i < racedata.Results.length; ++i) {
            var resultdata = racedata.Results[i];

            var driver = find(model.drivers, { id: resultdata.Driver.driverId});
            if (!driver) {
                driver = { id: resultdata.Driver.driverId,
                           code: resultdata.Driver.code,
                           name: resultdata.Driver.familyName,
                           givenName: resultdata.Driver.givenName,
                         };
                model.drivers.push(driver);
            }

            var constructor = find(model.constructors, { id: resultdata.Constructor.constructorId});
            if (!constructor) {
                constructor = { id: resultdata.Constructor.constructorId,
                                name: resultdata.Constructor.name,
                              };
                model.constructors.push(constructor);
            }

            var raceresult = { race: race,
                               position: parseInt(resultdata.position),
                               number:  parseInt(resultdata.number),
                               driver: driver,
                               constructor: constructor,
                               points: parseInt(resultdata.points),
                               status: resultdata.positionText,
                               statusText: resultdata.status,
                               laps: parseInt(resultdata.laps),
                               grid: parseInt(resultdata.grid),
                             }
            model.raceresults.push(raceresult);
        }
        model.races.push(race);
    }
    return model;
};


const fetch = () => {
    return fetch_season(2017);
};

export default fetch;
