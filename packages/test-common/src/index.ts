import { config } from "@onflow/config"
import { withPrefix } from "./common/create-emulator"
import { createTestAuth } from "./common/test-auth"

export { createEmulatorAccount } from "./common/create-emulator-account"
export { createFlowEmulator } from "./common/create-emulator"
export { createTestAuth } from "./common/test-auth"
export const createFlowAuth = createTestAuth

export * from "./config"
export { testTransactions } from "./common/transactions"
export { testScripts } from "./common/scripts"

export async function getServiceAccountAddress() {
	return withPrefix(await config().get("SERVICE_ADDRESS"))
}

export { FlowService } from "./common/authorizer"
