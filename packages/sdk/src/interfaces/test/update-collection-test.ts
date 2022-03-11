import type { FlowRoyalty } from "@rarible/flow-api-client"
import type { UpdateCollectionResponse } from "../collection/update-collection"
import type { FlowSdk } from "../../index"
import type { FlowCollectionId } from "../../types/collection"
import { parseEvents } from "../../common/parse-tx-events"

type Meta = {
	icon: string
	description: string
	url: string
}
const metaNew: Meta = {
	icon: "http://new.icon",
	description: "new description",
	url: "htp://new.url",
}

export async function updateCollectionTest(
	sdk: FlowSdk, collectionId: FlowCollectionId, royalties: FlowRoyalty[] = [], meta: Meta = metaNew,
): Promise<UpdateCollectionResponse> {
	const tx = await sdk.collection.updateCollection({
		collectionId,
		...meta,
		royalties,
	})
	const metaResponse: any = parseEvents(tx.events, "Changed", "meta")
	expect(tx.collectionId).toEqual(tx.collectionId)
	expect(metaResponse.icon).toEqual(meta.icon)
	expect(metaResponse.description).toEqual(meta.description)
	expect(metaResponse.url).toEqual(meta.url)
	if (royalties.length) {
		const royalty: any = parseEvents(tx.events, "Changed", "royalties")
		expect(royalty.length).toEqual(royalties.length)
	}
	return tx
}
