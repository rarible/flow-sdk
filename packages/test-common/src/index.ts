import { config } from "@onflow/config"
import { withPrefix } from "./common/create-emulator"

export { createEmulatorAccount } from "./common/create-emulator-account"
export { createFlowEmulator } from "./common/create-emulator"
export { createTestAuth } from "./common/test-auth"

export {
	FLOW_TESTNET_ACCOUNT_1,
	FLOW_TESTNET_ACCOUNT_2,
	FLOW_TESTNET_ACCOUNT_3,
	FLOW_TESTNET_ACCOUNT_4,
} from "./config"
export { testTransactions } from "./common/transactions"
export { testScripts } from "./common/scripts"

export async function getServiceAccountAddress() {
	return withPrefix(await config().get("SERVICE_ADDRESS"))
}
