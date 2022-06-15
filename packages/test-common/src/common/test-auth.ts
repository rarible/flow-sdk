import type { Fcl } from "@rarible/fcl-types"
import { FlowService } from "./authorizer"

export function createTestAuth(
	fcl: Fcl,
	network: "emulator" | "testnet" | "mainnet",
	accountAddress: string,
	privateKey: string,
	keyIndex: number = 0,
) {
	switch (network) {
		case "emulator": {
			fcl.config()
				.put("accessNode.api", "http://127.0.0.1:8080")
			break
		}
		case "testnet": {
			fcl.config().put("accessNode.api", "https://access-testnet.onflow.org")
			break
		}
		case "mainnet": {
			fcl.config().put("accessNode.api", "https://access.onflow.org")
			break
		}
	}

	const flowService = new FlowService(
		fcl,
		accountAddress,
		privateKey,
		keyIndex,
	)
	return flowService.authorizeMinter()
}
