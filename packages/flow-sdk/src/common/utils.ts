export const sansPrefix = (address: string): string | null => {
	if (address == null) return null
	return address.replace(/^0x/, "")
}
