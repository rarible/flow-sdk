import { getAccountAddress, mintFlow } from "flow-js-testing"

type EmulatorAccount = {
	address: string
	pk: string
}

export async function createEmulatorAccount(accountName: string): Promise<EmulatorAccount> {
	const address = await getAccountAddress(accountName)
	await mintFlow(address, "0.1")
	return {
		address,
		pk: "9929788f279238828e7da0592d87f1ada84b6bc373a50639bdff13a483e04fd4",
	}
}
