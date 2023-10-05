// Unix to human readable conversion
const unixToDow = (unix_timestamp) => {
    const dtFormat = new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        timeZone: 'UTC',
        hour12: false
    });

    return dtFormat.format(new Date(unix_timestamp * 1000));
}

const unixToHour = (unix_timestamp) => {
    const dtFormat = new Intl.DateTimeFormat('en-GB', {
        hour: 'numeric',
        timeZone: 'UTC',
        hour12: false
    });

    return dtFormat.format(new Date(unix_timestamp * 1000));
}

const unixToTimeString = (unix_timestamp) => {
    const dtFormat = new Intl.DateTimeFormat('en-GB', {
        timeStyle: 'short',
        timeZone: 'UTC',
        hour12: false
    });

    return dtFormat.format(new Date(unix_timestamp * 1000));
}

// Selecting specific data coming in from the OpenWeatherMap API
const prepareCurrent = (data) => {
    return current = {
        name: data.name,
        time: unixToTimeString(data.dt + data.timezone_offset),
        sunrise: unixToTimeString(data.sunrise + data.timezone_offset),
        sunset: unixToTimeString(data.sunset + data.timezone_offset),
        temperature: data.temp,
        feels_like: data.feels_like,
        pressure: data.pressure,
        humidity: data.humidity,
        dew_point: data.dew_point,
        uvi: data.uvi,
        clouds: data.clouds,
        visibility: data.visibility,
        wind_speed: data.wind_speed,
        wind_deg: data.wind_deg,
        rain: typeof data.rain === 'undefined' ? null : data.rain["1h"],
        snow: typeof data.snow === 'undefined' ? null : data.snow["1h"],
        weather: data.weather['0'],
    };
}

const prepareHourly = (data) => {
    const hourly = [];
    for(let i = 1; i <= 6; i++) {
        hourly[i-1] = {
            hour: unixToHour(data[i].dt + data.timezone_offset),
            temperature: data[i].temp,
            precipitation: data[i].pop,
            rain: typeof data[i].rain === 'undefined' ? null : data[i].rain["1h"],
            snow: typeof data[i].snow === 'undefined' ? null : data[i].snow["1h"],
            weather: data[i].weather['0'],
        }
    }
    return hourly;
}

const prepareDaily = (data) => {
    const daily = [];
    for(let i = 1; i <= 6; i++) {
        daily[i-1] = {
            dow: unixToDow(data[i].dt + data.timezone_offset),
            temperature: {
                day: data[i].temp.day,
                night: data[i].temp.night,
            },
            precipitation: data[i].pop,
            rain: typeof data[i].rain === 'undefined' ? null : data[i].rain,
            snow: typeof data[i].snow === 'undefined' ? null : data[i].snow,
            weather: data[i].weather['0'],
        }
    }
    return daily;
}

const prepareData = (data) => {
    return {
        current: prepareCurrent({
            ...data.current,
            timezone_offset: data.timezone_offset,
            name: data.name,
        }),
        forecast: {
            hourly: prepareHourly({
                ...data.hourly,
                timezone_offset: data.timezone_offset
            }),
            daily: prepareDaily({
                ...data.daily,
                timezone_offset: data.timezone_offset
            }),
        },
    }
}

module.exports = {
    prepareData
}