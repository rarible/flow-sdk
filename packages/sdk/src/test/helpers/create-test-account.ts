import type {Maybe} from "@rarible/types"
import type {Fcl} from "@rarible/fcl-types"
import { randomWord, toFlowContractAddress } from "@rarible/types"
import * as rlp from "rlp"
import {pubFlowKey} from "@onflow/flow-js-testing"
import {createTestAuth} from "@rarible/flow-test-common"
import {FLOW_TESTNET_ACCOUNT_5} from "@rarible/flow-test-common"
import {runTransaction, waitForSeal} from "../../common/transaction"
import {CONFIGS, TestnetCollections} from "../../config/config"
import type {FlowNetwork} from "../../types"
import {setupAccount} from "../../collection/setup-account"

export async function createTestAccount(
	fcl: Maybe<Fcl>,
	network: FlowNetwork,
) {
	if (!fcl) {
		throw new Error("Fcl is required for setup collection on account")
	}
	const auth = createTestAuth(fcl, "testnet", FLOW_TESTNET_ACCOUNT_5.address, FLOW_TESTNET_ACCOUNT_5.privKey)

	const pk = randomWord().slice(2)
	const pubEncoded = await pubFlowKey({privateKey: pk})
	const [pubBuffer] = rlp.decode(Buffer.from(pubEncoded.toString("hex"), "hex")) as unknown as Buffer[]
	const pub = pubBuffer.toString("hex" as any)
	const createAcc = await runTransaction(
		fcl,
		CONFIGS[network].mainAddressMap,
		{
			cadence: getTxCode(pub),
			args: fcl.args([]),
		},
		auth,
	)
	const tx = await waitForSeal(fcl, createAcc)
	const accountEvent = tx.events.find(e => e.type === "flow.AccountCreated")
	if (!accountEvent) {
		throw new Error("No account event")
	}
	const address = accountEvent.data.address
	return {
		auth: createTestAuth(fcl, "testnet", address, pk),
		pk,
		pub,
		address: accountEvent?.data.address,
	}
}

export async function createTestAccountWithMattelContracts(
	fcl: Maybe<Fcl>,
	network: FlowNetwork,
) {
	if (!fcl) {
		throw new Error("Fcl is required for setup collection on account")
	}
	const acc = await createTestAccount(fcl, network)
	const auth = createTestAuth(fcl, "testnet", acc.address, acc.pk)
	await setupAccount(fcl, auth, network, toFlowContractAddress(TestnetCollections.HWGaragePackV2))
	return acc
}

function getTxCode(pub: string) {
	return `
		  transaction {
        prepare(signer: AuthAccount) {
          let newAccount = AuthAccount(payer: signer)
          let key = PublicKey(
              publicKey: "${pub}".decodeHex(),
              signatureAlgorithm: SignatureAlgorithm.ECDSA_P256
          )

          newAccount.keys.add(
              publicKey: key,
              hashAlgorithm: HashAlgorithm.SHA3_256,
              weight: 1000.0
          )
        }
      }
              `
}
