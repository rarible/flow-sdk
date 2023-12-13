import {
	createEmulatorAccount,
	createTestAuth,
	getServiceAccountAddress,
	testTransactions,
} from "@rarible/flow-test-common"
import type { Fcl } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { testScripts } from "@rarible/flow-test-common"
import { runScript, runTransaction, waitForSeal } from "../../../common/transaction"
import type { AuthWithPrivateKey } from "../../../types"
import type { FlowSdk } from "../../../index"
import { createFlowSdk } from "../../../index"

export async function initAccountEvolution(fcl: Fcl, auth: AuthWithPrivateKey, contractOwner: string) {
	const cadence = testTransactions.evolution.init
	const map = {
		Evolution: contractOwner,
	}
	const txId = await runTransaction(
		fcl,
		map,
		{
			cadence,
		},
		auth,
	)
	return await waitForSeal(fcl, txId)
}

async function createEvolutionItem(fcl: Fcl, auth: AuthWithPrivateKey, contractOwner: string) {
	const cadence = testTransactions.evolution.createItem
	const [title, desc, hash] = ["The Collection", "First edition, series one", "0f886aaf9af7b43b97da112d0ba0a559c449710372b8ab93a4be6c91623b92c8"]
	const args = fcl.args([fcl.arg(title, t.String), fcl.arg(desc, t.String), fcl.arg(hash, t.String)])
	const map = {
		Evolution: contractOwner,
	}
	const txId = await runTransaction(
		fcl,
		map,
		{
			cadence,
			args,
		},
		auth,
	)
	return await waitForSeal(fcl, txId)
}

async function createEvolutionSet(fcl: Fcl, auth: AuthWithPrivateKey, contractOwner: string) {
	const cadence = testTransactions.evolution.createSet
	const [name, desc] = ["Prima", "first set"]
	const args = fcl.args([fcl.arg(name, t.String), fcl.arg(desc, t.String)])
	const map = {
		Evolution: contractOwner,
	}
	const txId = await runTransaction(
		fcl,
		map,
		{
			cadence,
			args,
		},
		auth,
	)
	return await waitForSeal(fcl, txId)
}

async function addEvolutionItemsToSet(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	contractOwner: string,
	setId: number,
	itemsId: number[],
) {
	const cadence = testTransactions.evolution.addItemToSet
	const args = fcl.args([fcl.arg(setId, t.UInt32), fcl.arg(itemsId, t.Array(t.UInt32))])
	const map = {
		Evolution: contractOwner,
	}
	const txId = await runTransaction(
		fcl,
		map,
		{
			cadence,
			args,
		},
		auth,
	)
	return await waitForSeal(fcl, txId)
}

async function mintEvolutionToAccount(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	contractOwner: string,
	recipient: string,
) {
	const cadence = testTransactions.evolution.mint
	const map = {
		Evolution: contractOwner,
	}
	const args = fcl.args([fcl.arg(recipient, t.Address), fcl.arg(1, t.UInt32), fcl.arg(1, t.UInt32)])
	const txId = await runTransaction(
		fcl,
		map,
		{
			cadence,
			args,
		},
		auth,
	)
	return {
		tx: await waitForSeal(fcl, txId),
		setId: 1,
		itemId: 1,
	}
}

type TestAccount = {
	address: string
	sdk: FlowSdk
	tokenId: number
}

type EvolutionTest = {
	acc1: TestAccount,
	acc2: Omit<TestAccount, "tokenId">,
	serviceAcc: Omit<TestAccount, "tokenId" | "sdk">,
}

export async function createEvolutionTestEnvironment(fcl: Fcl): Promise<EvolutionTest> {
	//setup test account 1
	const { address: testAddress1, pk: testPk1 } = await createEmulatorAccount("accountName1")
	const testAuth1 = createTestAuth(fcl, "emulator", testAddress1, testPk1, 0)
	//setup test account 2
	const { address: testAddress2, pk: testPk2 } = await createEmulatorAccount("accountName2")
	const testAuth2 = createTestAuth(fcl, "emulator", testAddress2, testPk2, 0)
	//setup service account
	const serviceAddress = await getServiceAccountAddress()
	const serviceAuth = createTestAuth(fcl, "emulator", serviceAddress, testPk1, 0)

	// init evolution storage on accounts
	await initAccountEvolution(fcl, testAuth1, serviceAddress)
	await initAccountEvolution(fcl, testAuth2, serviceAddress)

	//mint evolution to test account 1
	await createEvolutionItem(fcl, serviceAuth, serviceAddress)
	await createEvolutionSet(fcl, serviceAuth, serviceAddress)
	await addEvolutionItemsToSet(fcl, serviceAuth, serviceAddress, 1, [1])
	await mintEvolutionToAccount(fcl, serviceAuth, serviceAddress, testAddress1)

	return {
		acc1: {
			address: testAddress1,
			sdk: createFlowSdk(fcl, "emulator", {}, testAuth1),
			tokenId: 1,
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
