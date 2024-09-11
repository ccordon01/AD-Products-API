export function endOfDayUTC(date: Date | string | number): Date {
  const inputDate = new Date(date);
  return new Date(
    Date.UTC(
      inputDate.getUTCFullYear(),
      inputDate.getUTCMonth(),
      inputDate.getUTCDate(),
      23,
      59,
      59,
      999,
    ),
  );
}
