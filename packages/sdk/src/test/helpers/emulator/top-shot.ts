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

export async function initAccountTopShot(fcl: Fcl, auth: AuthWithPrivateKey, contractOwner: string) {
	const cadence = testTransactions.topShot.init
	const map = {
		TopShot: contractOwner,
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

async function createTopShotItem(fcl: Fcl, auth: AuthWithPrivateKey, contractOwner: string) {
	const cadence = testTransactions.topShot.createPlay
	const meta = {
		"FullName": "Trae Young",
		"FirstName": "Trae",
		"LastName": "Young",
		"Birthdate": "1998-09-19",
		"Birthplace": "Lubbock, TX, USA",
		"JerseyNumber": "11",
		"DraftTeam": "Dallas Mavericks",
		"DraftYear": "2018",
		"DraftSelection": "5",
		"DraftRound": "1",
		"TeamAtMomentNBAID": "1610612737",
		"TeamAtMoment": "Atlanta Hawks",
		"PrimaryPosition": "PG",
		"PlayerPosition": "G",
		"Height": "73",
		"Weight": "180",
		"TotalYearsExperience": "1",
		"NbaSeason": "2019-20",
		"DateOfMoment": "2019-11-06 00:30:00 +0000 UTC",
		"PlayCategory": "Handles",
		"PlayType": "Handles",
		"HomeTeamName": "Atlanta Hawks",
		"AwayTeamName": "San Antonio Spurs",
		"HomeTeamScore": "108",
		"AwayTeamScore": "100",
	}

	const preparedForTxMeta = Object.entries(meta).map(m => ({ key: m[0], value: m[1] }))
	const args = fcl.args([fcl.arg(preparedForTxMeta, t.Dictionary({ key: t.String, value: t.String }))])
	const map = {
		TopShot: contractOwner,
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

async function createTopShotSet(fcl: Fcl, auth: AuthWithPrivateKey, contractOwner: string) {
	const cadence = testTransactions.topShot.createSet
	const name = "Genesis"
	const args = fcl.args([fcl.arg(name, t.String)])
	const map = {
		TopShot: contractOwner,
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

async function addTopShotItemsToSet(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	contractOwner: string,
	setId: number,
	itemsId: number[],
) {
	const cadence = testTransactions.topShot.addPlaysToSet
	const args = fcl.args([fcl.arg(setId, t.UInt32), fcl.arg(itemsId, t.Array(t.UInt32))])
	const map = {
		TopShot: contractOwner,
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

async function mintTopShotToAccount(
	fcl: Fcl,
	auth: AuthWithPrivateKey,
	contractOwner: string,
	recipient: string,
) {
	const cadence = testTransactions.topShot.mint
	const map = {
		TopShot: contractOwner,
	}
	const args = fcl.args([fcl.arg(1, t.UInt32), fcl.arg(1, t.UInt32), fcl.arg(recipient, t.Address)])
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

type TopShotTest = {
	acc1: TestAccount,
	acc2: Omit<TestAccount, "tokenId">,
	serviceAcc: Omit<TestAccount, "tokenId" | "sdk">,
}

export async function createTopShotTestEnvironment(fcl: Fcl): Promise<TopShotTest> {
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
	await initAccountTopShot(fcl, serviceAuth, serviceAddress)
	await initAccountTopShot(fcl, testAuth1, serviceAddress)
	await initAccountTopShot(fcl, testAuth2, serviceAddress)

	//mint topShot to test account 1
	await createTopShotItem(fcl, serviceAuth, serviceAddress)
	await createTopShotSet(fcl, serviceAuth, serviceAddress)
	await addTopShotItemsToSet(fcl, serviceAuth, serviceAddress, 1, [1])
	await mintTopShotToAccount(fcl, serviceAuth, serviceAddress, testAddress1)

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

export async function getTopShotIds(
	fcl: Fcl,
	contractOwner: string,
	address: string,
) {
	const cadence = testScripts.topShot.getSetIds
	const map = {
		TopShot: contractOwner,
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
