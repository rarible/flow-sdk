import { BigNumber } from "@rarible/types"

type RaribleNftSdk = {
	mint(data: MintRequest): Promise<TokenId>,
	transfer(data: TransferRequest): Promise<string>
	burn(tokenId: TokenId): Promise<string>
}

type RaribleOrderSdk = {
	sell(data: SellRequest): Promise<string>
	fill(data: FillRequest): Promise<string>
}

type RaribleSdk = {
	nft: RaribleNftSdk
	order: RaribleOrderSdk
}

async function mint(data: MintRequest): Promise<TokenId> {
	const mintRequestToPassIntoTransaction = {
		metadata: data.url,
		royalties: data.royalties,
	}
	return Promise.resolve(123)
}

async function butn(tokenId: TokenId): Promise<TokenId> {
	const mintRequestToPassIntoTransaction = {
		tokenId,
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

async function sell(data: SellRequest): Promise<string> {
	const sellRequestToSendTx = {
		saleItemID: data.itemId,
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

type TokenId = number

type FlowCollectionAddress = string //todo "A.${FlowAddress}.${string}"

/**
 * NFT requests
 */
type MintRequest = {
	collection: FlowCollectionAddress
	url: string
	royalties: PayInfo[]
}

type TransferRequest = {
	tokenId: TokenId
	to: FlowAddress
}

/**
 * Order requests
 */
type SellRequest = {
	itemId: string
	price: BigNumber
}


// buy
type FillRequest = {
	owner: FlowAddress
	orderId: number
}


/**
 * NftItem
 */
interface FlowNftItem {
	id?: string;
	contract?: string;
	tokenId?: number;
	creator?: string;
	owner?: string;
	meta?: string;
	date?: Date;
	listed?: boolean;
	collection?: string;
}

/**
 * Order
 */
export interface PayInfo {
	account: string;
	value: string;
}

export interface FlowOrderData {
	payouts: Array<PayInfo>;
	originalFees: Array<PayInfo>;
}

export interface FlowAssetNFT {
	type: FlowAssetNFTTypeEnum;
	tokenId: string;
}

export enum FlowAssetNFTTypeEnum {
	Nft = "nft"
}

export interface FlowAssetFungible {
	type: FlowAssetFungibleTypeEnum;
}

export enum FlowAssetFungibleTypeEnum {
	Fungible = "fungible"
}

type FlowAsset = FlowAssetFungible | FlowAssetNFT;

export interface FlowOrder {
	itemId: string;
	collection: string;
	maker: string;
	taker?: string;
	make: FlowAsset;
	take?: FlowAsset;
	data: FlowOrderData;
	fill: string;
	cancelled: boolean;
	createdAt: Date;
	lastUpdateAt: Date;
	amount: string;
	offeredNftId?: string;
	amountUsd: string;
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


