import type {Maybe} from "@rarible/types"
import type {Fcl} from "@rarible/fcl-types"
import type {ConfigurationParameters} from "@rarible/flow-api-client"
import type {FlowEnv} from "../../config/env"
import type {AuthWithPrivateKey} from "../../types"
import {createFlowSdk} from "../../index"

export function createTestFlowSdk(
	fcl: Maybe<Fcl>,
	network: FlowEnv,
	params?: ConfigurationParameters,
	auth?: AuthWithPrivateKey,
) {
	return createFlowSdk(fcl, network, {
		apiKey: getAPIKey(network),
		...params,
	}, auth)
}

export function getAPIKey(env: FlowEnv) {
	switch (env) {
		case "mainnet":
			return process.env.SDK_API_KEY_PROD
		default:
			return process.env.SDK_API_KEY_TESTNET
	}
}
