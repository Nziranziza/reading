import { storeReading, store, Reading } from './index';

function decrementDate(dateString: string, days: number) {
  const date = new Date(dateString)
  return new Date(date.setDate(date.getDate() - days))
}

test('should store reading', () => {
  const reading: Reading = {
    value: 1,
    createdAt: new Date('01-01-1998'),
    patientId: 1,
  };
  const prevStoreSize = store.length;
  storeReading(reading.value, reading.createdAt, reading.patientId);
  expect(store.length).toBe(prevStoreSize + 1);
  expect(store[0].value).toBe(reading.value);
  expect(store[0].createdAt).toBe(reading.createdAt);
  expect(store[0].patientId).toBe(reading.patientId);
});
test('should discard duplicates reading', () => {
  const reading: Reading = {
    value: 2,
    createdAt: new Date('01-02-1998'),
    patientId: 2,
  };
  const prevStoreSize = store.length;
  storeReading(reading.value, reading.createdAt, reading.patientId);
  storeReading(reading.value, reading.createdAt, reading.patientId);
  expect(store.length).toBe(prevStoreSize + 1);
});

test('should flag a reading', () => {
  const current = new Date();
  const currentString = current.toString();
  const prevStoreSize = store.length;
  const readings: Reading[] = [
    {
      value: 2,
      createdAt: decrementDate(currentString, 1),
      patientId: 3,
    },
    {
      value: 2.1,
      createdAt: decrementDate(currentString, 2),
      patientId: 4,
    },
    {
      value: 2.15,
      createdAt: decrementDate(currentString, 3),
      patientId: 5,
    },
    {
      value: 2.16,
      createdAt: decrementDate(currentString, 4),
      patientId: 6,
    },
    {
      value: 2,
      createdAt: decrementDate(currentString, 6),
      patientId: 6,
    },
    {
      value: 2.2,
      createdAt: decrementDate(currentString, 9),
      patientId: 9,
    },
  ];
  const flaggedReading: Reading = {
    value: 5,
    createdAt: current,
    patientId: 10,
  };
  readings.forEach(({ value, createdAt, patientId }) => {
    storeReading(value, createdAt, patientId);
  });
  storeReading(
    flaggedReading.value,
    flaggedReading.createdAt,
    flaggedReading.patientId
  );
  expect(store.length).toBe(prevStoreSize + readings.length + 1);
  expect(
    store.find(
      ({ value, patientId, createdAt }) =>
        value === flaggedReading.value &&
        patientId === flaggedReading.patientId &&
        new Date(createdAt).getTime() ===
          new Date(flaggedReading.createdAt).getTime()
    )?.flagged
  ).toBeTruthy();
});

test('should stored data sorted by value and createdAt date', () => {
  const current = new Date();
  const currentString = current.toString();
  const prevStoreSize = store.length;
  const readings: Reading[] = [
    {
      value: 2.4,
      createdAt: decrementDate(currentString, 5),
      patientId: 3,
    },
    {
      value: 2.5,
      createdAt: decrementDate(currentString, 6),
      patientId: 4,
    },
    {
      value: 2.55,
      createdAt: decrementDate(currentString, 7),
      patientId: 5,
    },
    {
      value: 2.56,
      createdAt: decrementDate(currentString, 9),
      patientId: 6,
    },
    {
      value: 2,
      createdAt: decrementDate(currentString, 11),
      patientId: 6,
    },
    {
      value: 2.7,
      createdAt: decrementDate(currentString, 14),
      patientId: 9,
    },
  ];
  const highestValueReading1: Reading = {
    value: 8,
    createdAt: current,
    patientId: 10,
  };
  const highestValueReading2: Reading = {
    value: 8,
    createdAt: decrementDate(currentString, 1),
    patientId: 11,
  };
  readings.forEach(({ value, createdAt, patientId }) => {
    storeReading(value, createdAt, patientId);
  });
  storeReading(
    highestValueReading1.value,
    highestValueReading1.createdAt,
    highestValueReading1.patientId
  );
  storeReading(
    highestValueReading2.value,
    highestValueReading2.createdAt,
    highestValueReading2.patientId
  );
  expect(store.length).toBe(prevStoreSize + readings.length + 2);
  expect(
    store[0].value
  ).toBe(highestValueReading1.value);
  expect(
    store[1].value
  ).toBe(highestValueReading2.value);
  expect(
    new Date(store[0].createdAt).getTime()
  ).toBeGreaterThan(new Date(store[1].createdAt).getTime());
});

