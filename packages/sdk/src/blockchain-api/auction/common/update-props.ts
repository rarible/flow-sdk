import type { Fcl } from "@rarible/fcl-types"
import type { AuthWithPrivateKey, FlowNetwork, FlowTransaction } from "../../../types/types"
import { runTransaction, waitForSeal } from "../../../common/transaction"
import { getEnglishAuctionCode } from "../english-auction"
import { CONFIGS } from "../../../config/config"

export async function updateProps(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	network: FlowNetwork,
	minimalDuration?: string,
	maximalDuration?: string,
	reservePrice?: string,
): Promise<FlowTransaction> {
	const txId = await runTransaction(
		fcl,
		CONFIGS[network].mainAddressMap,
		getEnglishAuctionCode(fcl, "RaribleNFT", "FLOW")
			.updateProps({ minimalDuration, maximalDuration, reservePrice }),
		auth,
	)
	return waitForSeal(fcl, txId)
}
