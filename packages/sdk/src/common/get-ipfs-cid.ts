const IPFS_URI_CID_REGEXP = /\/ipfs\/[a-zA-Z0-9]*/g

export function getIpfsCid(string: string | undefined): string | undefined {
	if (string === undefined) {
		return string
	}
	const match = string.match(IPFS_URI_CID_REGEXP)?.[0]
	if (match) {
		return match.slice(6)
	}
	throw new Error("String doesn't content ipfs cid")
}
