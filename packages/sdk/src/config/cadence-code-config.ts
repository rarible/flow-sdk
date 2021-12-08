import type { FlowContractName, FungibleContracts, NonFungibleContracts } from "../types"

export const orderCodeConfig: Record<string, {
	nftProviderPath: string
	collectionPath: string
	collectionPublicPath: string
	nftReceiver: string
	linkArg: string
}> = {
	TopShot: {
		nftProviderPath: "TopShotProviderForNFTStorefront",
		collectionPath: "/storage/MomentCollection",
		collectionPublicPath: "/public/MomentCollection",
		nftReceiver: "{TopShot.MomentCollectionPublic}",
		linkArg: "{TopShot.MomentCollectionPublic}",

	},
	Evolution: {
		nftProviderPath: "EvolutionProviderForNFTStorefront",
		collectionPath: "/storage/f4264ac8f3256818_Evolution_Collection",
		collectionPublicPath: "/public/f4264ac8f3256818_Evolution_Collection",
		nftReceiver: "{Evolution.EvolutionCollectionPublic}",
		linkArg: "{Evolution.EvolutionCollectionPublic}",
	},
	MotoGPCard: {
		nftProviderPath: "MotoGPCardProviderForNFTStorefront",
		collectionPath: "/storage/motogpCardCollection",
		collectionPublicPath: "/public/motogpCardCollection",
		nftReceiver: "MotoGPCard.Collection{MotoGPCard.ICardCollectionPublic}",
		linkArg: "MotoGPCard.Collection{MotoGPCard.ICardCollectionPublic}",
	},
	RaribleNFT: {
		nftProviderPath: "RaribleNFTProviderForNFTStorefront",
		collectionPath: "RaribleNFT.collectionStoragePath",
		collectionPublicPath: "RaribleNFT.collectionPublicPath",
		nftReceiver: "{NonFungibleToken.Receiver}",
		linkArg: "{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}",
	},
}

export type FtCodeConfig = Record<"@ftPublicPath" | "@ftPrivateType" | "@ftPrivatePath" | "@ftStoragePath" | "@ftContract", string>

export function getFtCodeConfig(contract: FungibleContracts): FtCodeConfig {
	const ftPrivateType = "&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}"
	switch (contract) {
		case "FUSD":
			return {
				"@ftContract": contract,
				"@ftPublicPath": "/public/fusdReceiver",
				"@ftPrivateType": ftPrivateType,
				"@ftPrivatePath": `/private/${contract}_vaultRef`,
				"@ftStoragePath": "/storage/fusdVault",
			}
		case "FlowToken":
			return {
				"@ftContract": contract,
				"@ftPublicPath": "/public/flowTokenReceiver",
				"@ftPrivateType": ftPrivateType,
				"@ftPrivatePath": `/private/${contract}_vaultRef`,
				"@ftStoragePath": "/storage/flowTokenVault",
			}
		default:
			throw new Error(`Unsupported fungible contract: ${contract}`)
	}
}

const nftCodeConfig: Record<NonFungibleContracts, Record<"@nftPublicPath" | "@nftPublicType" | "@nftStoragePath", string>> = {
	RaribleNFT: {
		"@nftPublicPath": "RaribleNFT.collectionPublicPath",
		"@nftPublicType": "&{NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver}",
		"@nftStoragePath": "RaribleNFT.collectionStoragePath",
	},
	Evolution: {
		"@nftPublicPath": "/public/f4264ac8f3256818_Evolution_Collection",
		"@nftPublicType": "&{Evolution.EvolutionCollectionPublic}",
		"@nftStoragePath": "/storage/f4264ac8f3256818_Evolution_Collection",
	},
	MotoGPCard: {
		"@nftPublicPath": "/public/motogpCardCollection",
		"@nftPublicType": "&MotoGPCard.Collection{MotoGPCard.ICardCollectionPublic}",
		"@nftStoragePath": "/storage/motogpCardCollection",
	},
	TopShot: {
		"@nftPublicPath": "/public/MomentCollection",
		"@nftPublicType": "&{TopShot.MomentCollectionPublic}",
		"@nftStoragePath": "/storage/MomentCollection",
	},
}
type NftCodeTmplateAlases = "@nftPublicType" |
"@nftContract" |
"@nftPublicPath" |
"@nftStorageType" |
"@nftStoragePath" |
"@nftPrivatePath" |
"@nftPrivateType"
export type NftCodeConfig = Record<NftCodeTmplateAlases, string>

export function getNftCodeConfig(contract: FlowContractName): NftCodeConfig {
	switch (contract) {
		case "RaribleNFT":
		case "TopShot":
		case "MotoGPCard":
		case "Evolution":
			return {
				...nftCodeConfig[contract],
				"@nftContract": contract,
				"@nftPrivatePath": `${contract}.Collection`,
				"@nftPrivateType": `/private/{${contract}}_collectionRef`,
				"@nftStorageType": "{NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,NonFungibleToken.Receiver}",
			}
		default:
			throw new Error(`Unsupported contract: ${contract}`)
	}
}
