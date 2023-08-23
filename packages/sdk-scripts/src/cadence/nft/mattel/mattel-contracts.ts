export interface ContractsAddresses {
	name: string
	mainnetAddress: string
	testnetAddress: string
	testnetAddressRaribleDeployed: string
}

export enum TypeOfContract {
	COLLECTION = "Collection",
	STOREFRONT = "Storefront"
}
export interface ContractDetails {
	storagePath: string
	publicPath: string
	publicType: string
	contractType: TypeOfContract
	nameOfMethodForCreateResource: string
}

export interface NFTColectionDetails {
	privatePath: string
}

export const NonFungibleToken: ContractsAddresses = {
	name: "NonFungibleToken",
	mainnetAddress: "0x1d7e57aa55817448",
	testnetAddress: "0x631e88ae7f1d7c20",
	testnetAddressRaribleDeployed: "0x631e88ae7f1d7c20",
}

export const MetadataViews: ContractsAddresses = {
	name: "MetadataViews",
	mainnetAddress: "0x1d7e57aa55817448",
	testnetAddress: "0x631e88ae7f1d7c20",
	testnetAddressRaribleDeployed: "0x631e88ae7f1d7c20",
}

export const FungibleToken: ContractsAddresses = {
	name: "FungibleToken",
	mainnetAddress: "0xf233dcee88fe0abe",
	testnetAddress: "0x9a0766d93b6608b7",
	testnetAddressRaribleDeployed: "0x9a0766d93b6608b7",
}

export const FlowToken: ContractsAddresses = {
	name: "FlowToken",
	mainnetAddress: "0x1654653399040a61",
	testnetAddress: "0x7e60df042a9c0868",
	testnetAddressRaribleDeployed: "0x7e60df042a9c0868",
}

export const NFTStorefrontV2: ContractsAddresses & ContractDetails = {
	name: "NFTStorefrontV2",
	mainnetAddress: "0x4eb8a10cb9f87357",
	testnetAddress: "0x2d55b98eb200daef",
	testnetAddressRaribleDeployed: "0x80102bce1de42dc4",
	storagePath: "NFTStorefrontV2.StorefrontStoragePath",
	publicPath: "NFTStorefrontV2.StorefrontPublicPath",
	publicType: "&NFTStorefrontV2.Storefront{NFTStorefrontV2.StorefrontPublic}",
	contractType: TypeOfContract.STOREFRONT,
	nameOfMethodForCreateResource: "createStorefront() as! @NFTStorefrontV2.Storefront",
}

export const HWGaragePack: ContractsAddresses & ContractDetails & NFTColectionDetails = {
	name: "HWGaragePack",
	mainnetAddress: "0xd0bcefdf1e67ea85",
	testnetAddress: "0x9f36754d9b38f155",
	testnetAddressRaribleDeployed: "0x80102bce1de42dc4",
	storagePath: "HWGaragePack.CollectionStoragePath",
	publicPath: "HWGaragePack.CollectionPublicPath",
	publicType: "&HWGaragePack.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, HWGaragePack.PackCollectionPublic, MetadataViews.ResolverCollection}",
	contractType: TypeOfContract.COLLECTION,
	nameOfMethodForCreateResource: "createEmptyCollection()",
	privatePath: "/private/HWGaragePackCollection",
}
export const HWGaragePackV2: ContractsAddresses & ContractDetails & NFTColectionDetails = {
	name: "HWGaragePackV2",
	mainnetAddress: "",
	testnetAddress: "",
	testnetAddressRaribleDeployed: "",
	storagePath: "HWGaragePackV2.CollectionStoragePath",
	publicPath: "HWGaragePackV2.CollectionPublicPath",
	publicType: "&HWGaragePackV2.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, HWGaragePackV2.PackCollectionPublic, MetadataViews.ResolverCollection}",
	contractType: TypeOfContract.COLLECTION,
	nameOfMethodForCreateResource: "createEmptyCollection()",
	privatePath: "/private/HWGaragePackV2Collection",
}

export const HWGarageCard: ContractsAddresses & ContractDetails & NFTColectionDetails = {
	name: "HWGarageCard",
	mainnetAddress: "0xd0bcefdf1e67ea85",
	testnetAddress: "0x9f36754d9b38f155",
	testnetAddressRaribleDeployed: "0x80102bce1de42dc4",
	storagePath: "HWGarageCard.CollectionStoragePath",
	publicPath: "HWGarageCard.CollectionPublicPath",
	publicType: "&HWGarageCard.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, HWGarageCard.HWGarageCardCollectionPublic, MetadataViews.ResolverCollection}",
	contractType: TypeOfContract.COLLECTION,
	nameOfMethodForCreateResource: "createEmptyCollection()",
	privatePath: "/private/HWGarageCardCollection",
}

export const HWGarageCardV2: ContractsAddresses & ContractDetails & NFTColectionDetails = {
	name: "HWGarageCardV2",
	mainnetAddress: "",
	testnetAddress: "",
	testnetAddressRaribleDeployed: "",
	storagePath: "HWGarageCardV2.CollectionStoragePath",
	publicPath: "HWGarageCardV2.CollectionPublicPath",
	publicType: "&HWGarageCardV2.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, HWGarageCardV2.CardCollectionPublic, MetadataViews.ResolverCollection}",
	contractType: TypeOfContract.COLLECTION,
	nameOfMethodForCreateResource: "createEmptyCollection()",
	privatePath: "/private/HWGarageCardV2Collection",
}

export const HWGarageTokenV2: ContractsAddresses & ContractDetails & NFTColectionDetails = {
	name: "HWGarageTokenV2",
	mainnetAddress: "",
	testnetAddress: "",
	testnetAddressRaribleDeployed: "",
	storagePath: "HWGarageTokenV2.CollectionStoragePath",
	publicPath: "HWGarageTokenV2.CollectionPublicPath",
	publicType: "&HWGarageTokenV2.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, HWGarageTokenV2.TokenCollectionPublic, MetadataViews.ResolverCollection}",
	contractType: TypeOfContract.COLLECTION,
	nameOfMethodForCreateResource: "createEmptyCollection()",
	privatePath: "/private/HWGarageTokenV2Collection",
}

export const BBxBarbiePack: ContractsAddresses & ContractDetails & NFTColectionDetails = {
	name: "BBxBarbiePack",
	mainnetAddress: "",
	testnetAddress: "",
	testnetAddressRaribleDeployed: "",
	storagePath: "BBxBarbiePack.CollectionStoragePath",
	publicPath: "BBxBarbiePack.CollectionPublicPath",
	publicType: "&BBxBarbiePack.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, BBxBarbiePack.PackCollectionPublic, MetadataViews.ResolverCollection}",
	contractType: TypeOfContract.COLLECTION,
	nameOfMethodForCreateResource: "createEmptyCollection()",
	privatePath: "/private/BBxBarbiePackCollection",
}

export const BBxBarbieCard: ContractsAddresses & ContractDetails & NFTColectionDetails = {
	name: "BBxBarbieCard",
	mainnetAddress: "",
	testnetAddress: "",
	testnetAddressRaribleDeployed: "",
	storagePath: "BBxBarbieCard.CollectionStoragePath",
	publicPath: "BBxBarbieCard.CollectionPublicPath",
	publicType: "&BBxBarbieCard.Collection{NonFungibleToken.CollectionPublic, NonFungibleToken.Receiver, BBxBarbieCard.CardCollectionPublic, MetadataViews.ResolverCollection}",
	contractType: TypeOfContract.COLLECTION,
	nameOfMethodForCreateResource: "createEmptyCollection()",
	privatePath: "/private/BBxBarbieCardCollection",
}

export type MattelCollection =
	| "HWGaragePack"
	| "HWGarageCard"
	| "HWGarageCardV2"
	| "HWGaragePackV2"
	| "HWGarageTokenV2"
	| "BBxBarbiePack"
	| "BBxBarbieCard"
	| "BBxBarbieToken"
