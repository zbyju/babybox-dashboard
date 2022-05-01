export enum Status {
    Error = 0,
    Ok = 1,
    WarningWrongTime = 2
}

export interface Data {
    receivedTime: Date,
    babyboxName: string,
    temperature: {
        outside: number,
        inner: number,
        bottom: number,
        top: number,
        casing: number
    },
    voltage: {
        battery: number,
        vin: number
    }
    status: number
}

export interface DataQuery {
    BB: string
    T0: string
    T1: string
    T2: string
    T3: string
    T4: string
    T5: string
    T6: string
    T7: string
}
