type AttributesResponse = {
	key: string
	value: string
}

export function convertIpfsAttributes(sourceAttributes: Record<string, string>[]): AttributesResponse[] {
	return sourceAttributes.reduce((p, c) => {
		const preparedArray: AttributesResponse[] = []
		Object.keys(c).forEach(k => {
			preparedArray.push({ key: k, value: c[k] })
		})
		return [...p, ...preparedArray]
	}, <AttributesResponse[]>[])
}
