import { createTestAuth, getServiceAccountAddress, testTransactions } from "@rarible/flow-test-common"
import type { Fcl } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { testScripts } from "@rarible/flow-test-common/build/common/scripts"
import { createEmulatorAccount } from "@rarible/flow-test-common/src"
import { runScript, runTransaction, waitForSeal } from "../common/transaction"
import type { AuthWithPrivateKey } from "../types"
import type { FlowSdk } from "../index"
import { createFlowSdk } from "../index"

export async function initAccountMotoGp(fcl: Fcl, auth: AuthWithPrivateKey, contractOwner: string) {
	const cadence = testTransactions.motoGpCard.init
	const map = {
		MotoGPCard: contractOwner,
		MotoGPPack: contractOwner,
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

async function addMotoGpPackType(fcl: Fcl, auth: AuthWithPrivateKey, contractOwner: string) {
	const cadence = testTransactions.motoGpCard.addPackType

	const args = fcl.args([fcl.arg(0, t.UInt64)])
	const map = {
		MotoGPAdmin: contractOwner,
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

async function mintMotoGpPackToAddress(fcl: Fcl, auth: AuthWithPrivateKey, contractOwner: string, recipient: string) {
	const cadence = testTransactions.motoGpCard.mintPackToAddress
	const args = fcl.args([
		fcl.arg([recipient], t.Array(t.Address)),
		fcl.arg([0], t.Array(t.UInt64)),
		fcl.arg([[1]], t.Array(t.Array(t.UInt64))),
	])
	const map = {
		MotoGPAdmin: contractOwner,
		MotoGPPack: contractOwner,
		MotoGPTransfer: contractOwner,
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

async function transferMotoGpPackToOpener(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	contractOwner: string,
	packId: number,
	toAddress: string,
) {
	const cadence = testTransactions.motoGpCard.transferPackToOpener
	const args = fcl.args([fcl.arg(packId, t.UInt64), fcl.arg(toAddress, t.Address)])
	const map = {
		PackOpener: contractOwner,
		MotoGPCard: contractOwner,
		MotoGPPack: contractOwner,
		MotoGPTransfer: contractOwner,
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

async function openMotoGpPack(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	contractOwner: string,
	recipient: string,
) {
	const cadence = testTransactions.motoGpCard.openPack
	const map = {
		MotoGPAdmin: contractOwner,
		PackOpener: contractOwner,
		MotoGPCard: contractOwner,
		MotoGPTransfer: contractOwner,
	}
	const args = fcl.args([
		fcl.arg(recipient, t.Address),
		fcl.arg(0, t.UInt64),
		fcl.arg([1, 2, 3], t.Array(t.UInt64)),
		fcl.arg([1, 2, 3], t.Array(t.UInt64)),
	])
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
		packId: 0,
		cardIds: [1, 2, 3],
		serials: [1, 2, 3],
	}
}

type TestAccount = {
	address: string
	sdk: FlowSdk
	packId: number
	cardIds: number[]
}

type TopShotTest = {
	acc1: TestAccount,
	acc2: Omit<TestAccount, "packId" | "cardIds">,
	serviceAcc: Omit<TestAccount, "packId" | "cardIds" | "sdk">,
}

export async function createMotoGpTestEnvironment(fcl: Fcl): Promise<TopShotTest> {
	//setup test account 1
	const { address: testAddress1, pk: testPk1 } = await createEmulatorAccount("accountName1")
	const testAuth1 = createTestAuth(fcl, "emulator", testAddress1, testPk1, 0)
	//setup test account 2
	const { address: testAddress2, pk: testPk2 } = await createEmulatorAccount("accountName2")
	const testAuth2 = createTestAuth(fcl, "emulator", testAddress2, testPk2, 0)
	//setup service account
	const serviceAddress = await getServiceAccountAddress()
	const serviceAuth = createTestAuth(fcl, "emulator", serviceAddress, testPk1, 0)

	// init topShot storage on accounts
	await initAccountMotoGp(fcl, serviceAuth, serviceAddress)
	await initAccountMotoGp(fcl, testAuth1, serviceAddress)
	await initAccountMotoGp(fcl, testAuth2, serviceAddress)

	await addMotoGpPackType(fcl, serviceAuth, serviceAddress)
	await mintMotoGpPackToAddress(fcl, serviceAuth, serviceAddress, testAddress1)
	await transferMotoGpPackToOpener(fcl, testAuth1, serviceAddress, 0, testAddress1)
	await openMotoGpPack(fcl, serviceAuth, serviceAddress, testAddress1)


	return {
		acc1: {
			address: testAddress1,
			sdk: createFlowSdk(fcl, "emulator", {}, testAuth1),
			packId: 0,
			cardIds: [1, 2, 3],
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

export async function borrowMotoGpCardId(
	fcl: Fcl,
	contractOwner: string,
	address: string,
	tokenId: number,
) {
	const cadence = testScripts.motoGp.borrowCardId
	const map = {
		NonFungibleToken: contractOwner,
		MotoGPCard: contractOwner,
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
