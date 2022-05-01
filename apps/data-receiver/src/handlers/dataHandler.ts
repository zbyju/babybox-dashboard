import { dataQueryToData, isTypeOfDataQuery } from "shared/utils/data"

export const handleIncomingData = (query: unknown): void => {
    if(!isTypeOfDataQuery(query)) return
    const data = dataQueryToData(query)
    console.log(data)
}
