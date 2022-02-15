import type { Fcl } from "@rarible/fcl-types"
import type { FlowRoyalty } from "@rarible/flow-api-client"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import { runScript } from "../../../common/transaction"
import { CONFIGS } from "../../../config/config"
import { getCurrency } from "../../../common/get-currency"
import { getEnglishAuctionScript } from "../../../blockchain-api/auction/english-auction-scripts"
import type { FlowCurrency, FlowFee, FlowNetwork } from "../../../types/types"
import { toFlowContractAddress } from "../../../types/contract-address"

type FlowEnglishAuctionBlockchainLot = {
	uuid: number,
	lot: {
		uuid: number,
		mark: number,
		item: {
			uuid: number,
			id: number,
			creator: string,
			metadata: { etaURI: string },
			royalties: { address: string, fee: string }[]
		},
		refund: {
			path: { type: string, value: [{}] },
			address: string,
			borrowType: string
		},
		payouts: { target: any, rate: string }[],
	},
	bidType: string
	minimumBid: string
	buyoutPrice: string
	increment: string
	startAt: string
	duration: string
	bid: null,
	finishAt: string
}

type GetLotResponse = {
	currency: FlowCurrency
	royalties: FlowFee[]
	payouts: FlowFee[]
}

export async function getLot(fcl: Fcl, network: FlowNetwork, lotId: number): Promise<GetLotResponse> {
	const params = getEnglishAuctionScript.getLot(fcl, lotId)
	const lot: FlowEnglishAuctionBlockchainLot = await runScript(
		fcl, params, { EnglishAuction: CONFIGS[network].mainAddressMap.EnglishAuction },
	)
	const royalties: FlowRoyalty[] = lot.lot.item.royalties.map(r => {
		return {
			account: toFlowAddress(r.address),
			value: toBigNumber(r.fee),
		}
	})

	const payouts: FlowFee[] = lot.lot.payouts.map(p => {
		return {
			account: p.target,
			value: toBigNumber(p.rate),
		}
	})

	return {
		currency: getCurrency(toFlowContractAddress(lot.bidType)),
		royalties,
		payouts,
	}
}
