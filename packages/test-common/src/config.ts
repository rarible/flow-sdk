export const EMULATOR_SERVICE_ACCOUNT_PK = "9929788f279238828e7da0592d87f1ada84b6bc373a50639bdff13a483e04fd4"

export const CONTRACTS: Record<Contracts, string> = {
	NonFungibleToken: "NonFungibleToken",
	FUSD: "FUSD",
	NFTStorefront: "NFTStorefront",
	MotoGPCard: "MotoGPCard",
	Evolution: "Evolution",
	TopShot: "TopShot",
	RaribleFee: "RaribleFee",
	RaribleOrder: "RaribleOrder",
	RaribleNFT: "RaribleNFT",
	LicensedNFT: "LicensedNFT",
	MotoGPAdmin: "MotoGPAdmin",
	MotoGPCardMetadata: "MotoGPCardMetadata",
	MotoGPCounter: "MotoGPCounter",
	MotoGPPack: "MotoGPPack",
	MotoGPTransfer: "MotoGPTransfer",
	PackOpener: "PackOpener",
	ContractVersion: "ContractVersion",
	RaribleOpenBid: "RaribleOpenBid",
	MugenNFT: "MugenNFT",
	CNN_NFT: "CNN_NFT",
	MatrixWorldFlowFestNFT: "MatrixWorldFlowFestNFT",
	MatrixWorldVoucher: "MatrixWorldVoucher",
	DisruptArt: "DisruptArt",
	Art: "Art",
	StarlyCard: "StarlyCard",
	OneFootballCollectible: "OneFootballCollectible",
	ChainmonstersRewards: "ChainmonstersRewards",
	Content: "Content",
	MetadataViews: "MetadataViews",
	BarterYardPackNFT: "BarterYardPackNFT",
	Moments: "Moments",
	FanfareNFTContract: "FanfareNFTContract",
	Kicks: "Kicks",
	NFTLX: "NFTLX",

}
type Contracts =
	"NonFungibleToken" |
	"FUSD" |
	"NFTStorefront" |
	"MotoGPCard" |
	"Evolution" |
	"TopShot" |
	"RaribleFee" |
	"RaribleOrder" |
	"RaribleNFT" |
	"LicensedNFT" |
	"MotoGPAdmin" |
	"MotoGPCardMetadata" |
	"MotoGPCounter" |
	"MotoGPPack" |
	"MotoGPTransfer" |
	"PackOpener" |
	"ContractVersion" |
	"RaribleOpenBid" |
	"MugenNFT" |
	"CNN_NFT" |
	"MatrixWorldFlowFestNFT" |
	"MatrixWorldVoucher" |
	"DisruptArt" |
	"Art" |
	"StarlyCard" |
	"OneFootballCollectible" |
	"ChainmonstersRewards" |
	"Content" |
	"MetadataViews" |
	"BarterYardPackNFT" |
	"Moments" |
	"FanfareNFTContract" |
	"Kicks" |
	"NFTLX"

type TestAccount = {
	address: string
	privKey: string
	pubKey: string
}

export const FLOW_TESTNET_ACCOUNT_1: TestAccount = {
	address: "0x285b7909b8ed1652",
	privKey: "90a0c5a6cf05794f2e1104ca4be77895d8bfd8d4681eba3552ac5723f585b91c",
	pubKey: "12955691c2f82ebcda217af08f4619a96eb5991b95ac7c9c846e854f2164bc1048ed7f0ed5daa97ea37a638ea9d97b3e6981cd189d4a927a0244258e937d0fc4",
}

export const FLOW_TESTNET_ACCOUNT_2: TestAccount = {
	address: "0x2bb384fe0d14e574",
	privKey: "319e778494e038707b4e1ed67b1fdd5a4b36a8ed42f8ef53364c6dc4b1fccdf2",
	pubKey: "4d66ade3ce849e31308221f831c9afc4ec1808cf7ab85b75bb181a04897a8b39447d9cc8be85242385ddd9b580f93f248fa75cfadc9a492dac5b8cbaf149b9a1",
}

export const FLOW_TESTNET_ACCOUNT_3: TestAccount = {
	address: "0x9f50bb3b6fa40ff3",
	privKey: "252651f0a6173bec15ec47fb154344355b47950e743ebf71381ac86f9d3dded6",
	pubKey: "8ddfe4bb88e2b416902698e022d0664f6df7ec30ec8f8e385c52d50b7020d4a4601d1eb36db8b05ae1edaa59212c3cc0b7a73a2ae442914820b84f035cb8317e",
}
export const FLOW_TESTNET_ACCOUNT_4: TestAccount = {
	address: "0x97d54357e9938fd0",
	privKey: "3e45f87a2019d35c9aafae23c4ae731f42252d09a87828b012d06965e99ca9ab",
	pubKey: "a4bf31c725662f2becfe63fe109c33d2e89bdcf399bb449692c9564a189b296ae1183b5b9422c42477f6f044fac7ca5aa2b4097aa35b4a5123e806529dcd0548",
}
export const FLOW_TESTNET_ACCOUNT_5: TestAccount = {
	address: "0xc6202251d821b34d",
	privKey: "edc9f48cf3b13ac6b2608bc7af1739110c5b437b3bca7fd35b38c47cd7665d2d",
	pubKey: "",
}
export const FLOW_TESTNET_ACCOUNT_6: TestAccount = {
	address: "0x7f6ac234f574c5ea",
	privKey: "d2d9f47366ff08b3f379ee34fe7b4441868a4b954dc2d893102fa428e103e216",
	pubKey: "",
}

export const FLOW_TESTNET_ACCOUNT_7: TestAccount = {
	address: "0xdbb7924726a33031",
	privKey: "ccf77c1492eb0ae7abcb0b9e9a325e13b307b6d946dd98a2bd8f78d5b1573f5e",
	pubKey: "",
}

export const FLOW_TESTNET_ACCOUNT_8: TestAccount = {
	address: "0x4ee127ec6f94277f",
	privKey: "eee491e5c0b7936289af1a13376c944d2fa9764301f247f4164d3edf53dc0210",
	pubKey: "",
}
export const FLOW_TESTNET_ACCOUNT_9: TestAccount = {
	address: "0x66175a5250bfdbfc",
	privKey: "7494c3c07509115bd41010c676b8daeabc97e56224f34c07ea0c5a9295b1f4d6",
	pubKey: "",
}
export const FLOW_TESTNET_ACCOUNT_10: TestAccount = {
	address: "0x5587454ae32fa97e",
	privKey: "56e6cee98c16d1c5ae0841c867e3bbffd58003b8c4f51d85d8847487dbc1ec66",
	pubKey: "",
}

export const FLOW_TESTNET_ACCOUNT_11: TestAccount = {
	address: "0xe3da5545d9915388",
	privKey: "ef1054213ba4362a1712e20e5516c732ba800a059dc9bc8a34ce39a17f5a898b",
	pubKey: "",
}

export const FLOW_TESTNET_ACCOUNT_PYTHON: TestAccount = {
	address: "0xe431f1fddd278f14",
	privKey: "c30dbfc72c7d13283ebe1da4073f5cf6a6274884893e9e36c5dce8dac77714db",
	pubKey: "",
}

export const FLOW_TESTNET_ACCOUNT_PANDA: TestAccount = {
	address: "0x888ae1d8848e7e1e",
	privKey: "b9e95722cef1c43690d09989c673195c2356f060461e0f9f220b1b09c4c72fb2",
	pubKey: "",
}

export const FLOW_TESTNET_ACCOUNT_SNAKE: TestAccount = {
	address: "0xc6ed293e9d9d6ced",
	privKey: "ea8c739478ba55421520896b0e706857dd95e01f71217416f2fd12351d8ea4f5",
	pubKey: "",
}

export const FLOW_TESTNET_ACCOUNT_WOLF: TestAccount = {
	address: "0x314bec9cf32234c9",
	privKey: "9e44d233a17a9499454471118ca0ff9f538d9ccc19dcc754ce07f2aeff83de30",
	pubKey: "",
}

export const FLOW_TESTNET_ACCOUNT_BEAR: TestAccount = {
	address: "0x9306e31e4b42227e",
	privKey: "f85357ffa1aa48474770fb26eb30bae26b6e006520868ffa079d0154d2638cb4",
	pubKey: "",
}
