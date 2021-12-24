import type { FlowContractName, FungibleContracts, NonFungibleContracts } from "../types"

export type FtCodeConfig = Record<"@ftPublicPath" | "@ftPrivateType" | "@ftPrivatePath" | "@ftStoragePath" | "@ftContract", string>

export function getFtCodeConfig(contract: FungibleContracts): FtCodeConfig {
	const knownConf = {
		"@ftContract": contract,
		"@ftPrivateType": "&{FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver}",
		"@ftPrivatePath": `/private/${contract}_vaultRef`,
	}
	switch (contract) {
		case "FUSD":
			return {
				...knownConf,
				"@ftPublicPath": "/public/fusdReceiver",
				"@ftStoragePath": "/storage/fusdVault",
			}
		case "FlowToken":
			return {
				...knownConf,
				"@ftPublicPath": "/public/flowTokenReceiver",
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
	MugenNFT: {
		"@nftPublicPath": "MugenNFT.CollectionPublicPath",
		"@nftPublicType": "&{NonFungibleToken.CollectionPublic}",
		"@nftStoragePath": "MugenNFT.CollectionStoragePath",
	},
	CNN_NFT: {
		"@nftPublicPath": "CNN_NFT.CollectionPublicPath",
		"@nftPublicType": "&{NonFungibleToken.CollectionPublic}",
		"@nftStoragePath": "CNN_NFT.CollectionStoragePath",
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
		case "MugenNFT":
		case "CNN_NFT":
			return {
				...nftCodeConfig[contract],
				"@nftContract": contract,
				"@nftPrivatePath": `/private/${contract}_collectionRef`,
				"@nftPrivateType": "&{NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,NonFungibleToken.Receiver}",
				"@nftStorageType": `${contract}.Collection`,
			}
		default:
			throw new Error(`Unsupported contract: ${contract}`)
	}
}
