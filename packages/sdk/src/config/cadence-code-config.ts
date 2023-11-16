import type { FlowContractName, FungibleContracts, NonFungibleContract } from "../types"

export type FtCodeConfig = Record<"%ftPublicPath%" | "%ftPrivateType%" | "%ftPrivatePath%" | "%ftStoragePath%" | "%ftContract%" | "%ftBalancePublicPath%", string>

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
				"%ftBalancePublicPath%": "/public/fusdBalance",
				"%ftPublicPath%": "/public/fusdReceiver",
				"%ftStoragePath%": "/storage/fusdVault",
			}
		case "FiatToken":
			return {
				...knownConf,
				"%ftBalancePublicPath%": "FiatToken.VaultBalancePubPath",
				"%ftPublicPath%": "FiatToken.VaultReceiverPubPath",
				"%ftStoragePath%": "FiatToken.VaultStoragePath",
			}
		case "FlowToken":
			return {
				...knownConf,
				"%ftBalancePublicPath%": "/public/flowTokenBalance",
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
	"%nftPrivatePath%"?: string
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
		"%publicTypeAddon%": "CNN_NFT.CNN_NFTCollectionPublic",
	},
	MatrixWorldFlowFestNFT: {
		"%nftPublicPath%": "MatrixWorldFlowFestNFT.CollectionPublicPath",
		"%nftStoragePath%": "MatrixWorldFlowFestNFT.CollectionStoragePath",
	},
	MatrixWorldVoucher: {
		"%nftPublicPath%": "MatrixWorldVoucher.CollectionPublicPath",
		"%nftStoragePath%": "MatrixWorldVoucher.CollectionStoragePath",
		"%publicTypeAddon%": "MatrixWorldVoucher.MatrixWorldVoucherCollectionPublic",
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
	BarterYardPackNFT: {
		"%nftPublicPath%": "BarterYardPackNFT.CollectionPublicPath",
		"%nftStoragePath%": "BarterYardPackNFT.CollectionStoragePath",
		"%publicTypeAddon%": "BarterYardPackNFT.BarterYardPackNFTCollectionPublic",
	},
	FanfareNFTContract: {
		"%nftPublicPath%": "FanfareNFTContract.CollectionPublicPath",
		"%nftStoragePath%": "FanfareNFTContract.CollectionStoragePath",
		"%publicTypeAddon%": "FanfareNFTContract.FanfareNFTCollectionPublic",
	},
	Kicks: {
		"%nftPublicPath%": "Kicks.CollectionPublicPath",
		"%nftStoragePath%": "Kicks.CollectionStoragePath",
	},
	Moments: {
		"%nftPublicPath%": "Moments.CollectionPublicPath",
		"%nftStoragePath%": "Moments.CollectionStoragePath",
		"%publicTypeAddon%": "Moments.CollectionPublic",
	},
	SomePlaceCollectible: {
		"%nftPublicPath%": "SomePlaceCollectible.CollectionPublicPath",
		"%nftStoragePath%": "SomePlaceCollectible.CollectionStoragePath",
		"%publicTypeAddon%": "SomePlaceCollectible.CollectibleCollectionPublic",
	},
	IrNFT: {
		"%nftPublicPath%": "IrNFT.CollectionPublicPath",
		"%nftStoragePath%": "IrNFT.CollectionStoragePath",
		"%publicTypeAddon%": "IrNFT.CollectionPublic",
	},
	IrVoucher: {
		"%nftPublicPath%": "IrVoucher.CollectionPublicPath",
		"%nftStoragePath%": "IrVoucher.CollectionStoragePath",
		"%publicTypeAddon%": "IrVoucher.CollectionPublic",
	},
	GeniaceNFT: {
		"%nftPublicPath%": "GeniaceNFT.CollectionPublicPath",
		"%nftStoragePath%": "GeniaceNFT.CollectionStoragePath",
		"%publicTypeAddon%": "GeniaceNFT.GeniaceNFTCollectionPublic",
	},
	CryptoPiggo: {
		"%nftPublicPath%": "CryptoPiggo.CollectionPublicPath",
		"%nftStoragePath%": "CryptoPiggo.CollectionStoragePath",
		"%publicTypeAddon%": "CryptoPiggo.CryptoPiggoCollectionPublic",
	},
	HWGaragePack: {
		"%nftPublicPath%": "HWGaragePack.CollectionPublicPath",
		"%nftStoragePath%": "HWGaragePack.CollectionStoragePath",
		"%nftPrivatePath%": "/private/HWGaragePackCollection",
		"%publicTypeAddon%": "HWGaragePack.PackCollectionPublic",
	},
	HWGarageCard: {
		"%nftPublicPath%": "HWGarageCard.CollectionPublicPath",
		"%nftStoragePath%": "HWGarageCard.CollectionStoragePath",
		"%nftPrivatePath%": "/private/HWGarageCardCollection",
		"%publicTypeAddon%": "HWGarageCard.HWGarageCardCollectionPublic",
	},
	HWGarageCardV2: {
		"%nftPublicPath%": "HWGarageCardV2.CollectionPublicPath",
		"%nftStoragePath%": "HWGarageCardV2.CollectionStoragePath",
		"%nftPrivatePath%": "/private/HWGarageCardV2Collection",
		"%publicTypeAddon%": "HWGarageCardV2.CardCollectionPublic",
	},
	HWGaragePackV2: {
		"%nftPublicPath%": "HWGaragePackV2.CollectionPublicPath",
		"%nftStoragePath%": "HWGaragePackV2.CollectionStoragePath",
		"%nftPrivatePath%": "/private/HWGaragePackV2Collection",
		"%publicTypeAddon%": "HWGaragePackV2.PackCollectionPublic",
	},
	HWGarageTokenV2: {
		"%nftPublicPath%": "HWGarageTokenV2.CollectionPublicPath",
		"%nftStoragePath%": "HWGarageTokenV2.CollectionStoragePath",
		"%nftPrivatePath%": "/private/HWGarageTokenV2Collection",
		"%publicTypeAddon%": "HWGarageTokenV2.TokenCollectionPublic",
	},
	BBxBarbieCard: {
		"%nftPublicPath%": "BBxBarbieCard.CollectionPublicPath",
		"%nftStoragePath%": "BBxBarbieCard.CollectionStoragePath",
		"%nftPrivatePath%": "/private/BBxBarbieCardCollection",
		"%publicTypeAddon%": "BBxBarbieCard.CardCollectionPublic",
	},
	BBxBarbiePack: {
		"%nftPublicPath%": "BBxBarbiePack.CollectionPublicPath",
		"%nftStoragePath%": "BBxBarbiePack.CollectionStoragePath",
		"%nftPrivatePath%": "/private/BBxBarbiePackCollection",
		"%publicTypeAddon%": "BBxBarbiePack.PackCollectionPublic",
	},
	BBxBarbieToken: {
		"%nftPublicPath%": "BBxBarbieToken.CollectionPublicPath",
		"%nftStoragePath%": "BBxBarbieToken.CollectionStoragePath",
		"%nftPrivatePath%": "/private/BBxBarbieTokenCollection",
		"%publicTypeAddon%": "BBxBarbieToken.TokenCollectionPublic",
	},
	Gamisodes: {
		"%nftPublicPath%": "Gamisodes.COLLECTION_PUBLIC_PATH",
		"%nftStoragePath%": "Gamisodes.COLLECTION_STORAGE_PATH",
		"%nftPrivatePath%": "Gamisodes.COLLECTION_PRIVATE_PATH",
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
		"%nftPrivatePath%": staticConfig["%nftPrivatePath%"] || `/private/${contract}_collectionRef`,
		"%nftPrivateType%": "NonFungibleToken.CollectionPublic,NonFungibleToken.Provider,NonFungibleToken.Receiver",
		"%nftPublicType%": `${staticConfig["%publicTypeAddon%"] ? staticConfig["%publicTypeAddon%"] + "," : ""}NonFungibleToken.CollectionPublic,NonFungibleToken.Receiver`,
		"%nftPublicTypeMin%": staticConfig["%publicTypeAddon%"] || "NonFungibleToken.CollectionPublic",
	}

}
