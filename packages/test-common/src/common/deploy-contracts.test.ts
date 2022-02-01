import * as fclLib from "@onflow/fcl"
import type { Fcl } from "@rarible/fcl-types"
import { createTestAuth } from "./test-auth"
import { createFlowEmulator } from "./create-emulator"
import { createEmulatorAccount } from "./create-emulator-account"

describe("Test auth", () => {
	createFlowEmulator({ logs: false })
	const fcl: Fcl = fclLib
	test("Should import all deployed contracts", async () => {
		const { address, pk } = await createEmulatorAccount("TestAccount")
		const auth = await createTestAuth(fcl, "emulator", address, pk)
		const tx = await fcl.send([
			fcl.transaction(CODE),
			fcl.payer(auth),
			fcl.proposer(auth),
			fcl.authorizations([auth]),
			fcl.limit(999),
		])
		const result = await fcl.tx(tx).onceSealed()
		expect(result.status).toEqual(4)
	}, 20000)
})

const CODE = `
import NonFungibleToken from 0xf8d6e0586b0a20c7
import FUSD from 0xf8d6e0586b0a20c7
import NFTStorefront from 0xf8d6e0586b0a20c7
import MotoGPCard from 0xf8d6e0586b0a20c7
import Evolution from 0xf8d6e0586b0a20c7
import TopShot from 0xf8d6e0586b0a20c7
import RaribleFee from 0xf8d6e0586b0a20c7
import RaribleOrder from 0xf8d6e0586b0a20c7
import RaribleNFT from 0xf8d6e0586b0a20c7
import LicensedNFT from 0xf8d6e0586b0a20c7
import MotoGPAdmin from 0xf8d6e0586b0a20c7
import MotoGPCardMetadata from 0xf8d6e0586b0a20c7
import MotoGPCounter from 0xf8d6e0586b0a20c7
import MotoGPPack from 0xf8d6e0586b0a20c7
import MotoGPTransfer from 0xf8d6e0586b0a20c7
import PackOpener from 0xf8d6e0586b0a20c7
import ContractVersion from 0xf8d6e0586b0a20c7
import MugenNFT from 0xf8d6e0586b0a20c7
import CNN_NFT from 0xf8d6e0586b0a20c7
import MatrixWorldFlowFestNFT from 0xf8d6e0586b0a20c7
import MatrixWorldVoucher from 0xf8d6e0586b0a20c7
import Art from 0xf8d6e0586b0a20c7
import ChainmonstersRewards from 0xf8d6e0586b0a20c7
import StarlyCard from 0xf8d6e0586b0a20c7
import DisruptArt from 0xf8d6e0586b0a20c7
import OneFootballCollectible from 0xf8d6e0586b0a20c7
import RaribleNFTv2 from 0xf8d6e0586b0a20c7
import SoftCollection from 0xf8d6e0586b0a20c7
import MetadataViews from 0xf8d6e0586b0a20c7

transaction {
  prepare(account: AuthAccount) {
    log(account)
  }
}`
