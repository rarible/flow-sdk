import * as path from "path"
import { deployContractByName, emulator, getAccountAddress, init, mintFlow, shallPass } from "flow-js-testing"
import { getServiceAccountAddress } from "./common"
import { commonNFTMint, getCommonNFTDetails, getCommonNFTIds, setupCommonNFTOnAccount } from "./common-nft"

// const DEFAULT_HTTP_PORT = 8080
// const DEFAULT_GRPC_PORT = 3569

describe("CommonNFT", () => {

	const deployContracts = async () => {
		const serviceAccount = await getServiceAccountAddress()
		await mintFlow(serviceAccount, "10.0")

		const addressMap = {
			"NonFungibleToken": serviceAccount,
			"NFTPlus": serviceAccount,
			"CommonNFT": serviceAccount,
			"CommonFee": serviceAccount,
			"NFTStorefront": serviceAccount,
		}

		for (const it of ["NonFungibleToken", "NFTPlus", "CommonNFT", "CommonFee", "NFTStorefront"]) {
			shallPass(await deployContractByName({ to: serviceAccount, name: it, addressMap }))
		}

		return Promise.resolve(addressMap)
	}

	test("create account", async () => {
		const Alice = await getAccountAddress("Alice")
		const Bob = await getAccountAddress("Bob")
		const Charlie = await getAccountAddress("Charlie")
		const Dave = await getAccountAddress("Dave")

		console.log("Four accounts were created with following addresses:\n", {
			Alice,
			Bob,
			Charlie,
			Dave,
		})
	}, 10000)

	beforeEach(async () => {
		const basePath = path.resolve(__dirname, "../cadence")
		init(basePath)
		// return emulator.start(DEFAULT_HTTP_PORT, true)
		return emulator.start()
	})

	afterEach(async () => {
		return emulator.stop()
	})

	test("should deploy", async () => {
		const addressMap = await deployContracts()
		const Alice = await getAccountAddress("Alice")

		shallPass(await setupCommonNFTOnAccount(Alice))
		const result = await commonNFTMint(Alice, "ipfs://bla-bla-bla", [{ address: Alice, fee: "2.5" }])
		console.log("mint =", result)
		const ids = await getCommonNFTIds(Alice)
		console.log("ids =", ids)
		const item = await getCommonNFTDetails(Alice, 0)
		console.log(item)
	}, 100000000)

})
