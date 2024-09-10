export function startOfDayUTC(date: Date | string | number): Date {
  const inputDate = new Date(date);
  return new Date(
    Date.UTC(
      inputDate.getUTCFullYear(),
      inputDate.getUTCMonth(),
      inputDate.getUTCDate(),
    ),
  );
}
