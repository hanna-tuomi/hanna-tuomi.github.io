function requestWeather() {
  "use strict";

  function Weather() {
    this.ready = false;
    this.data = null;
    let self = this;

    let userLoadCallback = null;
    let userErrorCallback = null;


    // returns the time using the Moment class (for easier handling)
    this.getTime = function(range) {
      if (range) {
        // get array of times as seconds
        let sec = gatherRange(range, 'time');
        let outgoing = [ ];
        for (let i = 0; i < sec.length; i++) {
          // create each instant by multiplying seconds from the api to millis expected by Date()
          outgoing.push(new Moment(sec[i] * 1000));
        }
        return outgoing;
      }
      return new Moment(this.currently.time * 1000);
    };


    // return the time or a series of times as a JavaScript Date object
    this.getTimeDate = function(range) {
      if (range) {
        // get array of times as seconds
        let sec = gatherRange(range, 'time');
        let outgoing = [ ];
        for (let i = 0; i < sec.length; i++) {
          // create each instant by multiplying seconds from the api to millis expected by Date()
          outgoing.push(new Date(sec[i] * 1000));
        }
        return outgoing;
      }
      return new Date(this.currently.time * 1000);
    };


    // time in seconds, as returned from the api
    this.getTimeSeconds = function(range) {
      return range ? gatherRange(range, 'time') : this.currently.time;
    };


    // short summary of the weather
    this.getSummary = function(range) {
      return range ? gatherRange(range, 'summary') : this.currently.summary;
    };


    // gets an icon name for the current weather
    this.getIcon = function(range) {
      return range ? gatherRange(range, 'icon') : this.currently.icon;
    };


    // only current... does not work for minutes, hours, days
    this.getNearestStormDistance = function() {
      return this.currently.nearestStormDistance;
    };


    // only current... does not work for minutes, hours, days
    this.getNearestStormBearing = function() {
      return this.currently.nearestStormBearing;
    };


    // amount of precipitation (in inches)
    this.getPrecipIntensity = function(range) {
      return range ? gatherRange(range, 'precipIntensity') : this.currently.precipIntensity;
    };


    // percent chance of precipitation (0..1)
    this.getPrecipProbability = function(range) {
      return range ? gatherRange(range, 'precipProbability') : this.currently.precipProbability;
    };


    // getTemperature() returns the current temperature
    // getTemperature('hourly') returns the predicted temperatures for the next 49 hours
    // for individual days, only the minimum and maximum temperatures are available,
    // use getTemperatureMin() and getTemperatureMax() instead.
    this.getTemperature = function(range) {
      if (range === 'daily') {
        throw TypeError("Use getTemperatureMin('daily') and getTemperatureMax('daily') instead");
      }
      return range ? gatherRange(range, 'temperature') : this.currently.temperature;
    };


    // get the minimum daily temperature
    this.getTemperatureMin = function(range) {
      if (range !== 'daily') {
        throw TypeError("only getTemperatureMin('daily') is available");
      }
      return gatherRange(range, 'temperatureMin');
    };


    // get the maximum daily temperature
    this.getTemperatureMax = function(range) {
      if (range !== 'daily') {
        throw TypeError("only getTemperatureMax('daily') is available");
      }
      return gatherRange(range, 'temperatureMax');
    };


    // what the temperature feels like
    this.getApparentTemperature = function(range) {
      if (range === 'daily') {
        throw TypeError("Use getApparentTemperatureMin('daily') and getApparentTemperatureMax('daily') instead");
      }
      return range ? gatherRange(range, 'apparentTemperature') : this.currently.apparentTemperature;
    };


    // get the minimum daily temperature
    this.getApparentTemperatureMin = function(range) {
      if (range !== 'daily') {
        throw TypeError("only getApparentTemperatureMin('daily') is available");
      }
      return gatherRange(range, 'apparentTemperatureMin');
    };


    // get the maximum daily temperature
    this.getApparentTemperatureMax = function(range) {
      if (range !== 'daily') {
        throw TypeError("only getApparentTemperatureMax('daily') is available");
      }
      return gatherRange(range, 'apparentTemperatureMax');
    };


    // returns humidity percentage as number (0..1)
    this.getHumidity = function(range) {
      return range ? gatherRange(range, 'humidity') : this.currently.humidity;
    };


    // wind speed in miles per hour
    this.getWindSpeed = function(range) {
      return range ? gatherRange(range, 'windSpeed') : this.currently.windSpeed;
    };


    // wind direction in degrees (0..359), but only if getWindSpeed() is not 0
    this.getWindBearing = function(range) {
      return range ? gatherRange(range, 'windBearing') : this.currently.windBearing;
    };


    // percent of sky covered by clouds (0..1)
    this.getCloudCover = function(range) {
      return range ? gatherRange(range, 'cloudCover') : this.currently.cloudCover;
    };


    // sea level air pressure in millibars
    this.getPressure = function(range) {
      return range ? gatherRange(range, 'pressure') : this.currently.pressure;
    };


    // "The columnar density of total atmospheric ozone...in Dobson units"
    this.getOzone = function(range) {
      return range ? gatherRange(range, 'ozone') : this.currently.ozone;
    };


    // . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .

    // Internal functions, you can safely ignore these


    function gatherRange(range, name) {
      if (range === 'hourly') {
        return gatherField(name, self.hourly.data);
      } else if (range === 'daily') {
        return gatherField(name, self.daily.data);
      } else {
        throw TypeError("Use 'daily', 'hourly', or 'minutely'");
      }
    }


    function gatherField(name, array) {
      var outgoing = [ ];
      var len = array.length;
      for (var i = 0; i < len; i++) {
        outgoing.push(array[i][name]);
      }
      return outgoing;
    }

function wmoToIcon(code, isDay) {
  if (code === 0) return isDay ? 'clear-day' : 'clear-night';
  if (code <= 2) return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night';
  if (code === 3) return 'cloudy';
  if (code <= 49) return 'fog';
  if (code <= 67) return 'rain';
  if (code <= 77) return 'snow';
  if (code <= 82) return 'rain';
  if (code <= 86) return 'snow';
  if (code <= 99) return 'rain';
  return isDay ? 'clear-day' : 'clear-night';
}

function loadCallback(data) {
  self.data = data;

  // map Open-Meteo current conditions to Dark Sky-style "currently" object
  let now = new Date();
  let startIdx = 0;
  for (let i = 0; i < data.hourly.time.length; i++) {
    if (new Date(data.hourly.time[i]) >= now) {
      startIdx = i;
      break;
    }
  }

  self.currently = {
    temperature: data.current.temperature_2m,
    cloudCover: data.current.cloudcover / 100,
    precipProbability: (data.current.precipitation_probability || 0) / 100,
    windSpeed: data.current.windspeed_10m,
    windBearing: data.current.winddirection_10m,
    humidity: data.current.relativehumidity_2m / 100,
    icon: wmoToIcon(data.current.weathercode, data.current.is_day)
  };

  // map hourly arrays into Dark Sky-style { data: [...] } format
  self.hourly = {
    data: data.hourly.time.slice(startIdx, startIdx + 12).map((t, i) => ({
      time: new Date(t).getTime() / 1000,
      temperature: data.hourly.temperature_2m[startIdx + i],
      precipProbability: data.hourly.precipitation_probability[startIdx + i] / 100,
      cloudCover: data.hourly.cloudcover[startIdx + i] / 100
    }))
  };

  self.ready = true;
  if (userLoadCallback != null) {
    userLoadCallback(self);
  }
}


    function errorCallback(response) {
      console.error('Error while trying to retrieve the weather:');
      console.error(response);

      if (userErrorCallback != null) {
        userErrorCallback(response);
      }
    }


    // Round a number to a specific number of decimal places.
    // Unlike nf(), the result will still be a Number, not a String.
    // via https://www.jacklmoore.com/notes/rounding-in-javascript/
    function round(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }


    this.requestForecast = function() {
      let args = Array.from(arguments);  // otherwise pop() will not work
      if (args.length > 0) {
        if (typeof args[args.length-1] === 'function') {
          // at least one callback, are there two?
          if (args.length > 1 && typeof args[args.length-2] === 'function') {
            // contains both load and error callbacks
            userErrorCallback = args.pop();
          }
          userLoadCallback = args.pop();
        }
      }
      if (args.length === 1) {
        if (args[0] != 'gps') {
          loadJSON(args[0], loadCallback, errorCallback);
        } else {
          if (navigator.geolocation) {
            print('Getting GPS location...');
            navigator.geolocation.getCurrentPosition(function(position) {
              // Four decimal places should be enough for weather forecast location
              // https://www.forensicdjs.com/blog/gps-coordinates-many-decimal-places-need/
              let lat = round(position.coords.latitude, 4);
              let lon = round(position.coords.longitude, 4);
              self.requestForecast(lat, lon);
            },
            function (error) {
              switch (error.code) {
                case error.TIMEOUT: errorCallback('Position timeout'); break;
                case error.POSITION_UNAVAILABLE: errorCallback('Position unavailable'); break;
                case error.PERMISSION_DENIED: errorCallback('Location permission denied'); break;
                default: errorCallback('Unknown location error'); break;
              }
            });
          } else {
            errorCallback('This browser does not support navigator.geolocation');
          }
        }
      } else if (args.length === 2) {
        let lat = args[0];
        let lon = args[1];
        // use the open-meteo api
        let url = "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,weathercode,cloudcover,precipitation_probability,windspeed_10m,winddirection_10m,relativehumidity_2m,is_day&hourly=temperature_2m,precipitation_probability,cloudcover&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto";
        console.log('Loading weather from ' + url);
        loadJSON(url, loadCallback);

      } else {
        console.log(arguments);
        console.log('Use requestWeather(filename) or requestWeather(lat, lon)');
      }
    };
  }

  let w = new Weather();
  // Use apply() to pass arguments directly to another function
  w.requestForecast.apply(null, arguments);
  return w;
}
