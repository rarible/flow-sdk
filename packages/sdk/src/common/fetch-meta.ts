import fetch from "node-fetch"
import type { PinataMetaData } from "../types"
import { METADATA_HOST } from "../config/config"
import { retry } from "./retry"

export async function fetchMeta(metaUri: string): Promise<Partial<PinataMetaData>> {
	const url = `${METADATA_HOST}/ipfs/${metaUri.split("/")[3]}`
	return retry(10, 1000, async () => {
		try {
			const data = await fetch(url)
			return data.json()
		} catch (e) {
			throw new Error(`Cant fetch meta data from ${url}`)
		}
	})
}
