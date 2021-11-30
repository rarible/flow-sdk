import { createTestAuth, getServiceAccountAddress, testTransactions } from "@rarible/flow-test-common"
import type { Fcl } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { testScripts } from "@rarible/flow-test-common/build/common/scripts"
import { createEmulatorAccount } from "@rarible/flow-test-common/src"
import { runScript, runTransaction, waitForSeal } from "../common/transaction"
import type { AuthWithPrivateKey, FlowNetwork } from "../types"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"
import { CONFIGS } from "../config"

async function runFusdTransaction(
	fcl: Fcl, network: FlowNetwork, auth: AuthWithPrivateKey, contractOwner: string, code: string,
) {
	const map = {
		FUSD: contractOwner,
		FungibleToken: CONFIGS[network].mainAddressMap.FungibleToken,
	}
	const txId = await runTransaction(
		fcl,
		map,
		{
			cadence: code,
		},
		auth,
	)
	return await waitForSeal(fcl, txId)
}

async function depositFusdMinter(
	fcl: Fcl, network: FlowNetwork, auth: AuthWithPrivateKey, contractOwner: string, to: string,
) {
	const cadence = testTransactions.fusd.depositFusdMinter
	const map = {
		FUSD: contractOwner,
		FungibleToken: CONFIGS[network].mainAddressMap.FungibleToken,
	}
	const txId = await runTransaction(
		fcl,
		map,
		{
			cadence,
			args: fcl.args([fcl.arg(to, t.Address)]),
		},
		auth,
	)
	return await waitForSeal(fcl, txId)
}

async function mintFusdToAccount(
	fcl: Fcl, network: FlowNetwork, auth: AuthWithPrivateKey, contractOwner: string, to: string, amount: string,
) {
	const cadence = testTransactions.fusd.mintFusd
	const map = {
		FUSD: contractOwner,
		FungibleToken: CONFIGS[network].mainAddressMap.FungibleToken,
	}
	const txId = await runTransaction(
		fcl,
		map,
		{
			cadence,
			args: fcl.args([fcl.arg(amount, t.UFix64), fcl.arg(to, t.Address)]),
		},
		auth,
	)
	return await waitForSeal(fcl, txId)
}

type TestAccount = {
	address: string
	sdk: FlowSdk
}

type FusdTest = {
	acc1: TestAccount,
	acc2: TestAccount,
	serviceAcc: Omit<TestAccount, "sdk">,
}

export async function createFusdTestEnvironment(fcl: Fcl, network: FlowNetwork): Promise<FusdTest> {
	//setup test account 1
	const { address: testAddress1, pk: testPk1 } = await createEmulatorAccount("accountName1")
	const testAuth1 = createTestAuth(fcl, "emulator", testAddress1, testPk1, 0)
	//setup test account 2
	const { address: testAddress2, pk: testPk2 } = await createEmulatorAccount("accountName2")
	const testAuth2 = createTestAuth(fcl, "emulator", testAddress2, testPk2, 0)
	//setup service account
	const serviceAddress = await getServiceAccountAddress()
	const serviceAuth = createTestAuth(fcl, "emulator", serviceAddress, testPk1, 0)

	// setup FUSD vault on accounts
	await runFusdTransaction(fcl, network, serviceAuth, serviceAddress, testTransactions.fusd.setupFusdVault)
	await runFusdTransaction(fcl, network, testAuth1, serviceAddress, testTransactions.fusd.setupFusdVault)
	await runFusdTransaction(fcl, network, testAuth2, serviceAddress, testTransactions.fusd.setupFusdVault)

	// setup FUSD minter
	await runFusdTransaction(fcl, network, serviceAuth, serviceAddress, testTransactions.fusd.setupFusdMinter)

	// deposit FUSD minter
	await depositFusdMinter(fcl, network, serviceAuth, serviceAddress, serviceAddress)

	// mint FUSD to acc's
	await mintFusdToAccount(fcl, network, serviceAuth, serviceAddress, serviceAddress, "100.0")
	await mintFusdToAccount(fcl, network, serviceAuth, serviceAddress, testAddress1, "100.0")
	await mintFusdToAccount(fcl, network, serviceAuth, serviceAddress, testAddress2, "100.0")


	return {
		acc1: {
			address: testAddress1,
			sdk: createFlowSdk(fcl, "emulator", {}, testAuth1),
		},
		acc2: {
			address: testAddress2,
			sdk: createFlowSdk(fcl, "emulator", {}, testAuth2),
		},
		serviceAcc: {
			address: serviceAddress,
		},
	}
}

export async function getEvolutionIds(
	fcl: Fcl,
	contractOwner: string,
	address: string,
	tokenId: number,
) {
	const cadence = testScripts.evolution.borrowId
	const map = {
		Evolution: contractOwner,
		NonFungibleToken: contractOwner,
	}
	const args = fcl.args([fcl.arg(address, t.Address), fcl.arg(tokenId, t.UInt64)])
	return await runScript(
		fcl,
		{
			cadence,
			args,
		},
		map,
	)
}
