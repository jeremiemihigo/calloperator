export function excelSerialToJSDate(serial: number) {
  let days = serial;
  if (serial >= 60) {
    days -= 1;
  }

  const epoch = Date.UTC(1899, 11, 31);
  const msPerDay = 24 * 60 * 60 * 1000;
  return new Date(epoch + days * msPerDay).toLocaleDateString();
}
