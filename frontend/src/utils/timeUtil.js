import moment from 'moment';
export function format(time, format) {
  return moment(time).utc().format(format);
}
export function formatTime(time) {
  return moment(time).utc().format('YYYY-MM-DD HH:mm:ss') + ' UTC';
}
export function formatTimeDay(time) {
  return moment(time).utc().format('YYYY-MM-DD') + ' UTC';
}

export function formatTimeMinus(time) {
  return moment(time).utc().format('YYYY-MM-DD HH:mm') + ' UTC';
}
export function formatTimeNormal(time) {
  return moment(time).utc().format('YYYY-MM-DD HH:mm:ss');
}
