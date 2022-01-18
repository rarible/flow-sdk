import type { Fcl } from "@rarible/fcl-types"
import { RaribleNFT } from "@rarible/flow-sdk-scripts"
import * as t from "@onflow/types"
import type { FlowAddress } from "@rarible/types"
import { toBigNumber, toFlowAddress } from "@rarible/types"
import type { MethodArgs } from "../../common/transaction"
import { runScript } from "../../common/transaction"
import { CONFIGS } from "../../config/config"
import type { FlowFee, FlowNetwork } from "../../types"

type BorrowNftType = {
	uuid: number,
	id: number,
	creator: string,
	metadata: {
		metaURI: string
	},
	royalties: { address: string, fee: string }[]
}

export async function getFlowRaribleNftRoyalties(
	fcl: Fcl,
	network: FlowNetwork,
	owner: FlowAddress,
	tokenId: number,
): Promise<FlowFee[]> {
	const params: MethodArgs = {
		cadence: RaribleNFT.borrow_nft,
		args: fcl.args([fcl.arg(owner, t.Address), fcl.arg(tokenId, t.UInt64)]),
	}
	const borrow: BorrowNftType = await runScript(fcl, params, CONFIGS[network].mainAddressMap)
	return borrow.royalties.map(r => ({ account: toFlowAddress(r.address), value: toBigNumber(r.fee) }))
}
