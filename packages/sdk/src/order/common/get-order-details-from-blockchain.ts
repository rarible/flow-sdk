import type { Fcl } from "@rarible/fcl-types"
import { scriptOrderDetails } from "@rarible/flow-sdk-scripts/build/cadence/nft/mattel-contracts-orders"
import { openBidCommon, StorefrontCommon } from "@rarible/flow-sdk-scripts"
import * as t from "@onflow/types"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import { runScript } from "../../common/transaction"
import type { FlowCurrency, FlowFee, FlowNetwork } from "../../types"
import { CONFIGS } from "../../config/config"
import { withPrefix } from "../../common/prefix"

type FlowSaleCuts = { receiver: { address: string }, amount: string }

type FlowOrderDetails = {
	storefrontID: number
	purchased: boolean
	nftType: string//'A.f8d6e0586b0a20c7.RaribleNFT.NFT'
	nftID: number
	salePaymentVaultType: string//'A.0ae53cb6e3f42a79.FlowToken.Vault',
	salePrice: string //'0.10000000',
	saleCuts: FlowFee[]
	currency: FlowCurrency
	isLegacy: boolean
}

export async function getOrderDetailsFromBlockchain(
	fcl: Fcl,
	network: FlowNetwork,
	orderType: "bid" | "sell" | "sellV2",
	address: string,
	orderId: number,
): Promise<FlowOrderDetails> {
	let cadence: string, map: Record<string, string>
	switch (orderType) {
		case "sell":
			cadence = StorefrontCommon.read_listing_details
			map = {
				NFTStorefront: CONFIGS[network].mainAddressMap.NFTStorefront,
			}
			break
		case "sellV2":
			cadence = scriptOrderDetails
			map = {
				NFTStorefrontV2: CONFIGS[network].mainAddressMap.NFTStorefrontV2,
			}
			break
		case "bid":
			cadence = openBidCommon.readBidDetails
			map = {
				RaribleOpenBid: CONFIGS[network].mainAddressMap.RaribleOpenBid,
			}
			break
		default:
			throw new Error("Unsupported order type")
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
	let fungibleContract: string
	if ("vaultType" in details) {
		fungibleContract = details.vaultType.typeID.split(".")[2]
	} else if ("salePaymentVaultType" in details) {
		fungibleContract = details.salePaymentVaultType.typeID.split(".")[2]
	} else {
		throw new Error("Unknown order object type returned from blockchain")
	}
	const protocolFeeReceiver = CONFIGS[network].protocolFee.account
	const data = {
		...details,
		saleCuts: ("saleCuts" in details ? details.saleCuts : details.cuts).map((s: FlowSaleCuts) => ({
			account: toFlowAddress(s.receiver.address),
			value: toBigNumber(s.amount),
		})),
	}
	data.isLegacy = data.saleCuts.filter(
		(s: FlowFee) => withPrefix(s.account).toLowerCase() === withPrefix(protocolFeeReceiver).toLowerCase(),
	).length > 1
	switch (fungibleContract) {
		case "FlowToken":
			return {
				...data,
				currency: "FLOW",
			}
		case "FUSD":
			return {
				...data,
				currency: "FUSD",
			}
		default:
			throw new Error("Unsupported fungible token")
	}
}

type FlowOrderV2Details = {
	nftID: string
	customID: "RARIBLE"
	commissionAmount: string
	expiry: string
	purchased: boolean
	salePrice: string
}

export async function getStorefrontV2OrderDetailsFromBlockchain(
	fcl: Fcl,
	network: FlowNetwork,
	address: string,
	orderId: number,
): Promise<FlowOrderV2Details> {
	return runScript(
		fcl,
		{
			cadence: scriptOrderDetails,
			args: fcl.args([fcl.arg(address, t.Address), fcl.arg(orderId, t.UInt64)]),
		},
		{ NFTStorefrontV2: CONFIGS[network].mainAddressMap.NFTStorefrontV2 },
	)
}
