import { toFlowAddress } from "@rarible/types"
import { getFungibleBalanceSimpleGrpc } from "./balance-grpc"

describe("test grpc", () => {
	test("test grpc balance", async () => {
		const bal = await getFungibleBalanceSimpleGrpc({
			network: "testnet",
			address: toFlowAddress("0x79a759766b5ad70d"),
			currency: "FLOW",
		})
		expect(parseInt(bal)).toBeGreaterThanOrEqual(0)
	})
})
