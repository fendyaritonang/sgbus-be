const request = require('request');
const moment = require('moment');

const arrival = (busStopCode, callback) => {
  const url =
    'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=' +
    busStopCode;
  const headers = {
    AccountKey: process.env.BUSARRIVAL,
    accept: 'application/json',
  };

  if (!process.env.BUSARRIVAL || process.env.BUSARRIVAL == '') {
    callback(
      'Something is very wrong here, please contact the developer at ompu.sunggu@outlook.com'
    );
  } else {
    request({ url, json: true, headers }, (error, response) => {
      if (error) {
        callback('Unable to connect to bus arrival estimation service!');
      } else if (
        !response.body.Services ||
        response.body.Services.length == 0
      ) {
        callback('Unable to find bus stop code');
      } else {
        var busService = [];
        const services = response.body.Services;
        for (service in services) {
          const serviceNo = services[service].ServiceNo;
          const attr1 = nextBusAttributes(services[service].NextBus);
          const attr2 = nextBusAttributes(services[service].NextBus2);
          const attr3 = nextBusAttributes(services[service].NextBus3);

          busService.push({
            serviceNo,
            nextBus1:
              attr1.timeArrivalEstimation == '-'
                ? attr2.timeArrivalEstimation
                : attr1.timeArrivalEstimation,
            nextBus2:
              attr1.timeArrivalEstimation == '-'
                ? attr3.timeArrivalEstimation
                : attr2.timeArrivalEstimation,
          });
        }
        callback(undefined, busService);
      }
    });
  }
};

var nextBusAttributes = (nextBus) => {
  const estimatedArrival = nextBus.EstimatedArrival;
  var timeNow;
  var timeArrival;
  var timeDifferenceSeconds;
  var timeArrivalEstimation = '-';

  if (nextBus.EstimatedArrival) {
    timeNow = moment.utc();
    timeArrival = moment.utc(estimatedArrival);
    timeDifferenceSeconds = timeArrival.diff(timeNow, 'seconds');
    timeArrivalEstimation = Math.floor(timeDifferenceSeconds / 60);
    if (
      (timeDifferenceSeconds <= 30 && timeDifferenceSeconds > -10) ||
      timeArrivalEstimation == 0
    ) {
      timeArrivalEstimation = 'Arriving..';
    } else if (timeDifferenceSeconds <= -10) {
      timeArrivalEstimation = '-';
    } else {
      timeArrivalEstimation += ' mins';
    }
  }

  return {
    //timeArrival,
    timeArrivalEstimation,
    //timeDifferenceSeconds,
    //load: nextBus.Load,
    //feature: nextBus.Feature,
    //latitude: nextBus.Latitude,
    //longitude: nextBus.Longitude,
  };
};

module.exports = arrival;
