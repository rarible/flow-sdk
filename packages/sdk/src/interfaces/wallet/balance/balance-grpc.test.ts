import { toFlowAddress } from "@rarible/types"
import { getFungibleBalanceSimpleGrpc } from "./balance-grpc"

describe("test grpc", () => {
	test("test grpc balance on testnet", async () => {
		const bal = await getFungibleBalanceSimpleGrpc({
			network: "testnet",
			address: toFlowAddress("0x79a759766b5ad70d"),
			currency: "FLOW",
		})
		expect(parseInt(bal)).toBeGreaterThanOrEqual(0)
	})
	test("test grpc balance on mainnet", async () => {
		const bal = await getFungibleBalanceSimpleGrpc({
			network: "mainnet",
			address: toFlowAddress("0xf3a44c5f89081f05"),
			currency: "FLOW",
		})
		expect(parseInt(bal)).toBeGreaterThanOrEqual(0)
	})
})
