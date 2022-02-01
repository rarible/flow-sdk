import {
	createEmulatorAccount,
	createTestAuth,
	getServiceAccountAddress,
	testTransactions,
} from "@rarible/flow-test-common"
import type { Fcl } from "@rarible/fcl-types"
import * as t from "@onflow/types"
import { testScripts } from "@rarible/flow-test-common/build/common/scripts"
import { runScript, runTransaction, waitForSeal } from "../../common/transaction"
import type { AuthWithPrivateKey } from "../../types"
import type { FlowSdk } from "../../index"
import { createFlowSdk } from "../../index"

export async function initAccountMugenArt(fcl: Fcl, auth: AuthWithPrivateKey, contractOwner: string) {
	const cadence = testTransactions.mugenArt.init
	const map = {
		MugenNFT: contractOwner,
		NonFungibleToken: contractOwner,
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

async function mintMugenArtToAccount(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	contractOwner: string,
	recipient: string,
) {
	const cadence = testTransactions.mugenArt.mint
	const map = {
		MugenNFT: contractOwner,
		NonFungibleToken: contractOwner,
	}
	const args = fcl.args([fcl.arg(recipient, t.Address), fcl.arg(0, t.UInt64)])
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
		typeId: 0,
	}
}

type TestAccount = {
	address: string
	sdk: FlowSdk
	tokenId: number
}

type MugenArtTest = {
	acc1: TestAccount,
	acc2: Omit<TestAccount, "tokenId">,
	serviceAcc: Omit<TestAccount, "tokenId" | "sdk">,
}

export async function createMugenArtTestEnvironment(fcl: Fcl): Promise<MugenArtTest> {
	//setup test account 1
	const { address: testAddress1, pk: testPk1 } = await createEmulatorAccount("accountName1")
	const testAuth1 = createTestAuth(fcl, "emulator", testAddress1, testPk1, 0)
	//setup test account 2
	const { address: testAddress2, pk: testPk2 } = await createEmulatorAccount("accountName2")
	const testAuth2 = createTestAuth(fcl, "emulator", testAddress2, testPk2, 0)
	//setup service account
	const serviceAddress = await getServiceAccountAddress()
	const serviceAuth = createTestAuth(fcl, "emulator", serviceAddress, testPk1, 0)

	// init MugenNFT storage on accounts
	await initAccountMugenArt(fcl, testAuth1, serviceAddress)
	await initAccountMugenArt(fcl, testAuth2, serviceAddress)

	//mint MugenNFT to test account 1
	await mintMugenArtToAccount(fcl, serviceAuth, serviceAddress, testAddress1)

	return {
		acc1: {
			address: testAddress1,
			sdk: createFlowSdk(fcl, "emulator", {}, testAuth1),
			tokenId: 0,
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

export async function getMugenArtIds(
	fcl: Fcl,
	contractOwner: string,
	address: string,
) {
	const cadence = testScripts.mugenArt.getIds
	const map = {
		MugenNFT: contractOwner,
		NonFungibleToken: contractOwner,
	}
	const args = fcl.args([fcl.arg(address, t.Address)])
	return await runScript(
		fcl,
		{
			cadence,
			args,
		},
		map,
	)
}
