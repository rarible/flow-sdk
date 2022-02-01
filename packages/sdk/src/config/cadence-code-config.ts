import type { FlowContractName, FungibleContracts, NonFungibleContract } from "../types"

export type FtCodeConfig = Record<"%ftPublicPath%" | "%ftPrivateType%" | "%ftPrivatePath%" | "%ftStoragePath%" | "%ftContract%", string>

export function getFtCodeConfig(contract: FungibleContracts): FtCodeConfig {
	const knownConf = {
		"%ftContract%": contract,
		"%ftPrivateType%": "FungibleToken.Provider,FungibleToken.Balance,FungibleToken.Receiver",
		"%ftPrivatePath%": `/private/${contract}_vaultRef`,
	}
	switch (contract) {
		case "FUSD":
			return {
				...knownConf,
				"%ftPublicPath%": "/public/fusdReceiver",
				"%ftStoragePath%": "/storage/fusdVault",
			}
		case "FlowToken":
			return {
				...knownConf,
				"%ftPublicPath%": "/public/flowTokenReceiver",
				"%ftStoragePath%": "/storage/flowTokenVault",
			}
		default:
			throw new Error(`Unsupported fungible contract: ${contract}`)
	}
}

type NftStaticVariables = {
	"%nftPublicPath%": string
	"%nftStoragePath%": string
	"%publicTypeAddon%"?: string
}
const nftCodeConfig: Record<NonFungibleContract, NftStaticVariables> = {
	RaribleNFT: {
		"%nftPublicPath%": "RaribleNFT.collectionPublicPath",
		"%nftStoragePath%": "RaribleNFT.collectionStoragePath",
	},
	Evolution: {
		"%nftPublicPath%": "/public/f4264ac8f3256818_Evolution_Collection",
		"%nftStoragePath%": "/storage/f4264ac8f3256818_Evolution_Collection",
		"%publicTypeAddon%": "Evolution.EvolutionCollectionPublic",
	},
	MotoGPCard: {
		"%nftPublicPath%": "/public/motogpCardCollection",
		"%nftStoragePath%": "/storage/motogpCardCollection",
		"%publicTypeAddon%": "MotoGPCard.ICardCollectionPublic",
	},
	TopShot: {
		"%nftPublicPath%": "/public/MomentCollection",
		"%nftStoragePath%": "/storage/MomentCollection",
		"%publicTypeAddon%": "TopShot.MomentCollectionPublic",
	},
	MugenNFT: {
		"%nftPublicPath%": "MugenNFT.CollectionPublicPath",
		"%nftStoragePath%": "MugenNFT.CollectionStoragePath",
	},
	CNN_NFT: {
		"%nftPublicPath%": "CNN_NFT.CollectionPublicPath",
		"%nftStoragePath%": "CNN_NFT.CollectionStoragePath",
	},
	MatrixWorldFlowFestNFT: {
		"%nftPublicPath%": "MatrixWorldFlowFestNFT.CollectionPublicPath",
		"%nftStoragePath%": "MatrixWorldFlowFestNFT.CollectionStoragePath",
	},
	MatrixWorldVoucher: {
		"%nftPublicPath%": "MatrixWorldVoucher.CollectionPublicPath",
		"%nftStoragePath%": "MatrixWorldVoucher.CollectionStoragePath",
	},
	DisruptArt: {
		"%nftPublicPath%": "DisruptArt.disruptArtPublicPath",
		"%nftStoragePath%": "DisruptArt.disruptArtStoragePath",
	},
	Art: {
		"%nftPublicPath%": "Art.CollectionPublicPath",
		"%nftStoragePath%": "Art.CollectionStoragePath",
		"%publicTypeAddon%": "Art.CollectionPublic",
	},
	StarlyCard: {
		"%nftPublicPath%": "StarlyCard.CollectionPublicPath",
		"%nftStoragePath%": "StarlyCard.CollectionStoragePath",
		"%publicTypeAddon%": "StarlyCard.StarlyCardCollectionPublic",
	},
	OneFootballCollectible: {
		"%nftPublicPath%": "OneFootballCollectible.CollectionPublicPath",
		"%nftStoragePath%": "OneFootballCollectible.CollectionStoragePath",
		"%publicTypeAddon%": "OneFootballCollectible.OneFootballCollectibleCollectionPublic",
	},
	ChainmonstersRewards: {
		"%nftPublicPath%": "/public/ChainmonstersRewardCollection",
		"%nftStoragePath%": "/storage/ChainmonstersRewardCollection",
		"%publicTypeAddon%": "ChainmonstersRewards.ChainmonstersRewardCollectionPublic",
	},
	SoftCollection: {
		"%nftPublicPath%": "SoftCollection.CollectionPublicPath",
		"%nftStoragePath%": "SoftCollection.CollectionStoragePath",
	},
	RaribleNFTv2: {
		"%nftPublicPath%": "RaribleNFTv2.CollectionPublicPath",
		"%nftStoragePath%": "RaribleNFTv2.CollectionStoragePath",
	},
}
export type NftCodeConfig = NftStaticVariables & {
	"%nftContract%": string
	"%nftStorageType%": string
	"%nftPrivatePath%": string
	"%nftPrivateType%": string
	"%nftPublicType%": string
	"%nftPublicTypeMin%": string
}

export function getNftCodeConfig(contract: FlowContractName): NftCodeConfig {
	if (!Object.keys(nftCodeConfig).includes(contract)) {
		throw new Error(`Unsupported contract: ${contract}`)
	}
	const staticConfig = nftCodeConfig[contract as NonFungibleContract]
	return {
		...staticConfig,
		"%nftContract%": contract,
		"%nftStorageType%": `${contract}.Collection`,
		"%nftPrivatePath%": `/private/${contract}_collectionRef`,
		"%nftPrivateType%": "NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,NonFungibleToken.Receiver",
		"%nftPublicType%": `${staticConfig["%publicTypeAddon%"] ? staticConfig["%publicTypeAddon%"] + "," : ""}NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver`,
		"%nftPublicTypeMin%": staticConfig["%publicTypeAddon%"] || "NonFungibleToken.CollectionPublic",
	}

}
