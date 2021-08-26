import { getAccountAddress } from "flow-js-testing"

const UFIX64_PRECISION = 8

// UFix64 values shall be always passed as strings
export const toUFix64 = (value: number) => value.toFixed(UFIX64_PRECISION)

export const getServiceAccountAddress = async () => getAccountAddress("master")
