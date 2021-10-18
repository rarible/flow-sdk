const REGEXP_IMPORT = /(\s*import\s*)([\w\d]+)(\s+from\s*)([\w\d".\\/]+)/g

export const replaceImportAddresses = (code: string, addressMap: { [key: string]: string }, byName = true): string => {
	return code.replace(REGEXP_IMPORT, (__, imp, contract, _, address) => {
		const key = byName ? contract : address
		const newAddress = addressMap instanceof Function ? addressMap(key) : addressMap[key]
		return `${imp}${contract} from ${newAddress}`
	})
}
