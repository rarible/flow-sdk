import { withPrefix } from "./utils"

const REGEXP_IMPORT = /(\s*import\s*)([\w\d]+)(\s+from\s*)([\w\d".\\/]+)/g

export const replaceImportAddresses = (code: string, addressMap: { [key: string]: string }, byName = true): string => {
	const topShotFeeAddress = addressMap.TopShotFee
	const addTopShowFee = code.replace("0xTOPSHOTFEE", topShotFeeAddress)
	return addTopShowFee.replace(REGEXP_IMPORT, (__, imp, contract, _, address) => {
		const key = byName ? contract : address
		const nextAddress = addressMap instanceof Function ? addressMap(key) : addressMap[key]
		const addressWithPrefix = withPrefix(nextAddress)
		if (!addressWithPrefix) {
			throw new Error("Invalid contract address for injecting in transaction")
		}
		return `${imp}${contract} from ${addressWithPrefix}`
	})
}
