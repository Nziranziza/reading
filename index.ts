export type Reading = {
  value: number;
  createdAt: Date;
  patientId: number;
  flagged?: boolean;
};

export let store: Reading[] = [];

/**
 * @description calculate average reading value for the past
 * 30 days
 * @returns number
 */
export function getAvgReadingForPrevMonth(): number {
  const days = 30;
  const current: Date = new Date();
  const currentTime: number = current.getTime();
  const last30Days: Date = new Date(current.setDate(current.getDate() - days));
  const last30DaysTime: number = last30Days.getTime();

  const last30DaysReadings: Reading[] = store.filter((reading) => {
    const readingTime = new Date(reading.createdAt).getTime();
    return readingTime <= currentTime && readingTime > last30DaysTime;
  });
  if(!last30DaysReadings.length) {
    return 0;
  }
  const last30DaysSumValue: number = last30DaysReadings.reduce(
    (prevReadingValue: number, currentReading: Reading) => {
      return prevReadingValue + currentReading.value;
    },
    0
  );
  return last30DaysSumValue / last30DaysReadings.length;
}

/**
 * @description Order readings by value and created date in descending order
 * if readings have same value order by created date 
 * @param a Reading
 * @param b Reading
 * @returns number
 */
export function sortByValueAndCreatedDate(a: Reading, b: Reading): number {
  if(b.value - a.value === 0) {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  }
  return b.value - a.value;
}
/**
 * @description Store reading as follows
 * 1. Store readings sorted in order of value and createdAt
 * 2. Duplicate readings(same createdAt and patientID) are discarded
 * 3. value > 10% of average readings for the past month are flagged
 * @param value
 * @param createdAt
 * @param patientId
 */
export function storeReading(
  value: number,
  createdAt: Date,
  patientId: number
) {
  let reading: Reading = {
    value,
    createdAt,
    patientId
  }
  if (
    store.find(
      (reading) =>
        reading.patientId === patientId &&
        new Date(reading.createdAt).getTime() === new Date(createdAt).getTime()
    )
  ) {
    return;
  }
  const avgReading = getAvgReadingForPrevMonth();
  if((((value - avgReading) / avgReading) * 100) > 10) {
    reading = {
      ...reading,
      flagged: true
    }
  }
  // Sort before insert
  const newReadings: Reading[] = [...store, reading].sort(sortByValueAndCreatedDate)
  store = newReadings;
}
