import { getAccountAddress, mintFlow } from "flow-js-testing"
import { EMULATOR_SERVICE_ACCOUNT_PK } from "../config"

type EmulatorAccount = {
	address: string
	pk: string
}

export async function createEmulatorAccount(accountName: string): Promise<EmulatorAccount> {
	const address = await getAccountAddress(accountName)
	await mintFlow(address, "10000.1")

	return {
		address,
		pk: EMULATOR_SERVICE_ACCOUNT_PK,
	}
}
