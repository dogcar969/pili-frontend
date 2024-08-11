export const TimeStampFormat = (timestamp) => {
  return timestamp?.slice(0, 10) + ' ' + timestamp?.slice(11, 16)
}
