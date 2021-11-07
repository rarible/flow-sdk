import type { Fcl } from "@rarible/fcl-types"
import { FlowService } from "./authorizer"

export function createTestAuth(
	fcl: Fcl,
	network: "emulator" | "testnet",
	accountAddress: string,
	privateKey: string,
	keyIndex: number = 0,
) {
	fcl.config()
		.put("accessNode.api", network === "testnet" ? "https://access-testnet.onflow.org" : "http://127.0.0.1:8080")
	const flowService = new FlowService(
		fcl,
		accountAddress,
		privateKey,
		keyIndex,
	)
	return flowService.authorizeMinter()
}
