import type { Fcl } from "@rarible/fcl-types"
import type { FlowRoyalty } from "@rarible/flow-api-client"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import { runScript } from "../../common/transaction"
import { getEnglishAuctionScript } from "../../tx-code-store/auction/english-auction-scripts"
import type { FlowCurrency, FlowFee, FlowNetwork } from "../../types"
import { CONFIGS } from "../../config/config"
import { getCurrency } from "../../common/get-currency"
import { toFlowContractAddress } from "../../common/flow-address"

type FlowEnglishAuctionBlockchainLot = {
	uuid: number,
	reward: {
		path: { type: string, value: [{}] },
		address: string,
		borrowType: string
	},
	refund: {
		path: { type: string, value: [{}] },
		address: string,
		borrowType: string
	},
	item: [
		{
			uuid: number,
			id: number,
			creator: string,
			metadata: { etaURI: string },
			royalties: { address: string, fee: string }[]
		}
	],
	payouts: { target: any, rate: string },
	bidType: string,
	minimumBid: string,
	buyoutPrice: string,
	increment: string,
	startAt: string,
	duration: string,
	bids: {},
	finishAt: string,
	primaryBid: null
}

type GetLotResponse = {
	currency: FlowCurrency
	royalties: FlowFee[]
}

export async function getLot(fcl: Fcl, network: FlowNetwork, lotId: number): Promise<GetLotResponse> {
	const params = getEnglishAuctionScript.getLot(fcl, lotId)
	const lot: FlowEnglishAuctionBlockchainLot = await runScript(
		fcl, params, { EnglishAuction: CONFIGS[network].mainAddressMap.EnglishAuction },
	)
	const royalties: FlowRoyalty[] = lot.item[0].royalties.map(r => {
		return {
			account: toFlowAddress(r.address),
			value: toBigNumber(r.fee),
		}
	})

	return {
		currency: getCurrency(toFlowContractAddress(lot.bidType)),
		royalties,
	}
}
