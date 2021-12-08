import { createTestAuth } from "@rarible/flow-test-common"
import * as fcl from "@onflow/fcl"
import { createEmulatorAccount, createFlowEmulator } from "@rarible/flow-test-common/src"
import { toBigNumber } from "@rarible/types"
import { createFlowSdk, toFlowContractAddress } from "../index"
import { EmulatorCollections } from "../config/config"

describe("Test bid on emulator", () => {
	createFlowEmulator({})
	const collection = toFlowContractAddress(EmulatorCollections.RARIBLE)

	test("Should create RaribleNFT bid order", async () => {
		const { address: address1, pk: pk1 } = await createEmulatorAccount("accountName1")
		const auth1 = createTestAuth(fcl, "emulator", address1, pk1, 0)
		const sdk1 = createFlowSdk(fcl, "emulator", {}, auth1)
		const { address: address2, pk: pk2 } = await createEmulatorAccount("accountName2")
		const auth2 = createTestAuth(fcl, "emulator", address2, pk2, 0)
		const sdk2 = createFlowSdk(fcl, "emulator", {}, auth2)
		const mintTx = await sdk1.nft.mint(
			collection,
			"ipfs://ipfs/QmNe7Hd9xiqm1MXPtQQjVtksvWX6ieq9Wr6kgtqFo9D4CU",
			[],
		)

		const tx = await sdk2.order.bid(
			collection,
			"FLOW",
			mintTx.tokenId,
			toBigNumber("0.1"),
		)
		expect(tx.status).toEqual(4)

	})
})
