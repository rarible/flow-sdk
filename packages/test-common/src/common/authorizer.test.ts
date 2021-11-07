import * as fclLib from "@onflow/fcl"
import type { Fcl } from "@rarible/fcl-types"
import { createTestAuth } from "./test-auth"
import { createFlowEmulator } from "./create-emulator"
import { createEmulatorAccount } from "./create-emulator-account"

describe("Test auth", () => {
	createFlowEmulator({ logs: false })
	const fcl: Fcl = fclLib
	test("Should send a transaction with handle auth", async () => {
		const { address, pk } = await createEmulatorAccount("TestAccount")
		const auth = await createTestAuth(fcl, "emulator", address, pk)
		const tx = await fcl.send([
			fcl.transaction(CODE),
			fcl.payer(auth),
			fcl.proposer(auth),
			fcl.authorizations([auth]),
			fcl.limit(999),
		])
		const result = await fcl.tx(tx).onceSealed()
		expect(result.status).toEqual(4)
	})
})

const CODE = `
import FungibleToken from 0xee82856bf20e2aa6

transaction {
  prepare(account: AuthAccount) {
    log(account)
  }
}`
