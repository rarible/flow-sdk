import type { PinataMetaData } from "../../../types"
import { METADATA_HOST } from "../../../config/config"
import { retry } from "../../../common/retry"

export async function fetchMeta(metaUri: string): Promise<Partial<PinataMetaData>> {
	const url = `${METADATA_HOST}/ipfs/${metaUri.split("/")[3]}`
	return retry(10, 1000, async () => {
		return new Promise((resolve, reject) => {
			window.fetch(url, { method: "GET" }).then(response => {
				if (response.status >= 200 && response.status < 300) {
					resolve(response.json())
				} else {
					reject(`Cant fetch meta data from ${url}`)
				}
			}).catch((e: Error) => {
				throw new Error(`Cant fetch meta data: ${e}`)
			})
		})
	})
}
