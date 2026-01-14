import moment from "moment";

export function addMinutes(minutes: number, date: any, timeFormat?: string) {
  let returnDate = new Date(date.getTime() + minutes * 60000);
  if (timeFormat) {
    return showDate(returnDate, timeFormat);
  } else {
    return returnDate;
  }
}

export function addMinutesToTime(timeStr: string, minutesToAdd: number) {
  const time = moment(timeStr, "hh:mm A");

  time.add(minutesToAdd, "minutes");
  const updatedTimeStr = time.format("hh:mm A");
  return updatedTimeStr;
}

export const sendDate = (d: string | number | Date) => {
  return new Date(d).toISOString().split("T")[0];
};

export function showPickerTime(time12h: any) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") {
    hours = "00";
  }
  if (modifier === "PM") {
    hours = parseInt(hours, 10) + 12;
  }
  return new Date(new Date().setHours(hours)).setMinutes(minutes);
}

export const showDate = (d: any, newFormat: any, currentFormat?: any) => {
  if (currentFormat) {
    const date = moment(d, currentFormat).format(newFormat);
    return date;
  } else {
    const date = moment(d).format(newFormat);
    return date;
  }
};

export const getTimestamp = (time: any) => {
  const UTCseconds =
    (time.getTime() + time.getTimezoneOffset() * 60 * 1000) / 1000;
  // let UTCseconds =
  //   Math.floor(time.getTime() / 1000) + time.getTimezoneOffset() * 60;
  return UTCseconds;
};

export const timestamptDateTime = (t: number, format = "DD MMM, hh:mm A") => {
  if (t && typeof t === "number") {
    const offset = new Date().getTimezoneOffset(); // minute
    const offsetSeconds = offset * 60; // seconds
    const timestamp = t - offsetSeconds;
    const r = moment.unix(timestamp).utc().format(format);
    // const r = moment.unix(t).utc().format(format);
    return r;
  } else {
    return "";
  }
};

export const compareTimess = (time1: any, time2: any) => {
  var d1 = new Date(time1);
  var d2 = new Date(time2);
  d1.setSeconds(0, 0);
  d2.setSeconds(0, 0);
  const format = "HH:mm";
  const momentTime1 = moment(d1, format);
  const momentTime2 = moment(d2, format);
  if (momentTime1.isBefore(momentTime2)) {
    return -1;
  } else if (momentTime1.isAfter(momentTime2)) {
    return 1;
  } else {
    return 0;
  }
};

export const compareTimes = (
  time1: any,
  time2: any,
  stringFormatTime2: boolean
) => {
  let d1 = new Date(time1);
  let d2 = null;
  if (stringFormatTime2) {
    d2 = new Date(showPickerTime(time2));
  } else {
    d2 = new Date(time2);
  }
  d1.setSeconds(0, 0);
  d2.setSeconds(0, 0);
  const format = "HH:mm";
  const momentTime1 = moment(d1, format);
  const momentTime2 = moment(d2, format);
  if (moment(momentTime1).format("x") <= moment(momentTime2).format("x")) {
    return false;
  } else {
    return true;
  }
};

export function compareDates(date1: any, date2: any) {
  const date1Updated = new Date(date1.replace(/-/g, "/"));
  const date2Updated = new Date(date2.replace(/-/g, "/"));
  return date1Updated > date2Updated;
}

export const timer = (remaining: number): any => {
  let timout: any = null;
  let m: any = Math.floor(remaining / 60);
  let s: any = remaining % 60;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;
  const remainTime = m + ":" + s;
  remaining -= 1;
  if (remaining >= 0) {
    timout = setTimeout(function () {
      timer(remaining);
    }, 1000);
    return remainTime;
  } else {
    clearTimeout(timout);
    return;
  }
};

export function showDaysAgoTime(time: any) {
  return moment(time, "YYYY MM DD").fromNow();
}

export const getYears = (date?: string, format = "YYYY-MM-DD") => {
  return moment().diff(moment(date, format), "years");
};
