import type { Fcl } from "@rarible/fcl-types"
import t from "@onflow/types"
import { StorefrontCommon } from "@rarible/flow-sdk-scripts"
import { runScript } from "../common/transaction"
import type { FlowCurrency, FlowNetwork } from "../types"
import { CONFIGS } from "../config"

type FlowOrderDetails = {
	storefrontID: number
	purchased: boolean
	nftType: string//'A.f8d6e0586b0a20c7.RaribleNFT.NFT'
	nftID: number
	salePaymentVaultType: string//'A.0ae53cb6e3f42a79.FlowToken.Vault',
	salePrice: string //'0.10000000',
	currency: FlowCurrency
	saleCuts: { receiver: object, amount: string }[]
}

export async function getOrderDetailsFromBlockchain(
	fcl: Fcl,
	network: FlowNetwork,
	address: string,
	orderId: number,
): Promise<FlowOrderDetails> {
	const cadence = StorefrontCommon.read_listing_details
	const map = {
		NFTStorefront: CONFIGS[network].mainAddressMap.NFTStorefront,
	}
	const args = fcl.args([fcl.arg(address, t.Address), fcl.arg(orderId, t.UInt64)])
	const details = await runScript(
		fcl,
		{
			cadence,
			args,
		},
		map,
	)
	const fungibleContract = details.salePaymentVaultType.split(".")[2]
	switch (fungibleContract) {
		case "FlowToken":
			return {
				...details,
				currency: "FLOW",
			}
		case "FUSD":
			return {
				...details,
				currency: "FUSD",
			}
		default:
			throw new Error("Unsupported fungible token")
	}
}
