import { Address, BigNumber } from "@rarible/types"

type Part = {
	account: Address,
	value: number
}

type BlockchainType = "ETH" | "FLOW"

type TokenId = number

type FlowCollectionAddress = string //todo "A.${FlowAddress}.${string}"

type NftItemId = string // todo "FLOW:${FlowAddress}:${tokenId}" FLOW must be ${blockchain}

type Collection = FlowCollectionAddress

type FlowOrderType = "RARIBLE_FLOW_V1"

type FlowAssetType = {
	assetClass: "FLOW_NFT"
	contract: FlowAddress
	tokenId: BigNumber
}

/**
 * NFT
 */
type MintRequest = {
	collection: FlowCollectionAddress
	url: string
	royalties: Part[]
}

type TransferRequest = {
	blockchain: BlockchainType
	tokenId: TokenId
	to: FlowAddress
}

type RaribleNftSdk = {
	mint(data: MintRequest): Promise<TokenId>,
	transfer(data: TransferRequest): Promise<string>
	burn(tokenId: TokenId): Promise<string>
}

async function mint(data: MintRequest): Promise<TokenId> {
	const mintRequestToPassIntoTransaction = {
		metadata: data.url,
		royalties: data.royalties,
	}
	return Promise.resolve(123)
}

async function transfer(data: TransferRequest): Promise<string> {
	const transferRequestToSendTx = {
		tokenId: data.tokenId,
		to: toFlowAddress(data.to),
	}
	return Promise.resolve("hash")
}

/**
 * Order
 */
type SellRequest = {
	asset: FlowAssetType
	price: BigNumber
}


// buy
type FillRequest = {
	asset: FlowAssetType
	owner: FlowAddress
	orderId: number
}

type RaribleOrderSdk = {
	sell(data: SellRequest): Promise<string>
	fill(data: FillRequest): Promise<string>
}

async function sell(data: SellRequest): Promise<string> {
	const sellRequestToSendTx = {
		saleItemID: data.asset.tokenId,
		saleItemPrice: data.price,
	}
	return Promise.resolve("hash")
}

async function fill(data: FillRequest): Promise<string> {
	const buyRequestToSendTx = {
		saleOfferResourceID: data.orderId,
		storefrontAddress: data.owner,
	}
	return Promise.resolve("hash")
}

/**
 * NftItem
 */
type NftItem = {
	"blockchain": BlockchainType,
	"id": NftItemId,
	"tokenId": TokenId,
	"collection": Collection,
	"creators": Part[],
	"owners": FlowAddress[],
	"royalties": Part[],
	"mintedAt": "2019-08-24T14:15:22Z",
	"lastUpdatedAt": "2019-08-24T14:15:22Z",
	"supply": BigNumber,
	"metaURL": string,
	"meta": {
		"name": "string",
		"description": "string",
		"attributes": [],
		"contents": [],
		"raw": "string"
	},
	"deleted": true
}
/**
 * Order
 */
type FlowOrder = {
	"id": 717802,
	"type": FlowOrderType,
	"maker": FlowAddress,
	"taker": FlowAddress,
	"make": {
		"assetType": FlowAssetType,
		"value": 717802
	},
	"take": {
		"assetType": FlowAssetType,
		"value": 717802
	},
	"data": {
		"dataType": "DATA_V1",
		"payouts": [],
		"originFees": []
	},
	"fill": 717802,
	"startedAt": "2019-08-24T14:15:22Z",
	"endedAt": "2019-08-24T14:15:22Z",
	"makeStock": 717802.342336,
	"cancelled": true,
	"createdAt": "2019-08-24T14:15:22Z",
	"lastUpdatedAt": "2019-08-24T14:15:22Z",
	"makeBalance": 717802.342336,
	"makePriceUSD": 717802.342336,
	"takePriceUSD": 717802.342336
}

declare const validAddress: unique symbol

export type FlowAddress = string & {
	[validAddress]: true
}

export function toFlowAddress(value: string): FlowAddress {
	let hex: string
	if (value.startsWith("0x")) {
		hex = value.substring(2).toLowerCase()
	} else {
		hex = value.toLowerCase()
	}
	const re = /[0-9a-f]{16}/g
	if (re.test(hex)) {
		return `0x${hex}` as FlowAddress
	} else {
		throw new Error(`not an address: ${value}`)
	}
}


