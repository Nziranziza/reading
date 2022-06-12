# FDA-cleared device Readings

our FDA-cleared device captures spirometry data from our patients when they use it. For this example let’s assume the format is the following:

```js
{
	value: number,
	createdAt: Date,
	patientId: number
}
```

As part of the process that receives readings we want to implement the function storeReading(value, created_at, patient_id) that has the following business requirements:

- Readings have to be stored in order of value and created_at
- Duplicate readings (same created_at) have to be discarded
- If value is +10% of average readings for the past month then store it and add a flag to manually review it by a respiratory therapist

## How to get started

1. Install depencies
    ```
    npm i
    ```
2. Run test
    ```
    npm test
    ```
3. Run the function
    ```
    npm start
    ```