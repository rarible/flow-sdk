import { withPrefix } from "../../../common/prefix"

const REGEXP_IMPORT = /(\s*import\s*)([\w\d]+)(\s+from\s*)([\w\d".\\/]+)/g

export const replaceImportAddresses = (code: string, addressMap: { [key: string]: string }, byName = true): string => {
	const topShotFeeAddress = addressMap.TopShotFee
	const addTopShowFee = code.replace(/0xTOPSHOTFEE/g, topShotFeeAddress)
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

export function fillCodeTemplate(code: string, map: Record<string, string>): string {
	let resultCode = code
	Object.keys(map).forEach(key => {
		resultCode = resultCode.replace(new RegExp(key, "g"), map[key])
	})
	return resultCode
}
