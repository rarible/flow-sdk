type AttributesResponse = {
	key: string
	value: string
}

export function convertIpfsAttributes(sourceAttributes: Record<string, string>[]): AttributesResponse[] {
	return sourceAttributes.reduce((p, c) => {
		if ("key" in c && "value" in c) {
			return [...p, { key: c.key, value: c.value }]
		}
		throw new Error("Invalid ipfs attributes format, key or value keys are missing")
	}, <AttributesResponse[]>[])
}
