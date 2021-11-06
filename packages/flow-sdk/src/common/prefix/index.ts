export type Sansed = string & {
	__IS_SANSED__: string
}

export function sansPrefix(address: string): Sansed {
	const replaced = address.replace(/^0x/, "")
	if (isSansed(replaced)) {
		return replaced
	}
	throw new Error("Can't remove 0x from string")
}

export function isSansed(str: string): str is Sansed {
	return !str.startsWith("0x")
}

export type Prefixed = string & {
	__IS_PREFIXED__: string
}

export function withPrefix(address: string): Prefixed {
	if (isPrefixed(address)) {
		return address
	}
	return "0x" + address as Prefixed
}

function isPrefixed(str: string): str is Prefixed {
	return str.startsWith("0x")
}
