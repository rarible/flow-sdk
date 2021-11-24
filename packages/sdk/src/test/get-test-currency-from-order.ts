import type { Fcl } from "@rarible/fcl-types"
import t from "@onflow/types"
import { StorefrontCommon } from "@rarible/flow-sdk-scripts"
import { getServiceAccountAddress } from "@rarible/flow-test-common"
import { runScript } from "../common/transaction"
import type { FlowCurrency } from "../types"

export async function getTestFtCurrencyFromOrder(
	fcl: Fcl,
	address: string,
	orderId: number,
): Promise<FlowCurrency> {
	const cadence = StorefrontCommon.read_listing_details
	const serviceAddress = await getServiceAccountAddress()
	const map = {
		NFTStorefront: serviceAddress,
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
			return "FLOW"
		case "FUSD":
			return "FUSD"
		default:
			throw new Error("Unsupported fungible token")
	}
}
