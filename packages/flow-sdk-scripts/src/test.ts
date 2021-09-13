// todo remove
import * as fcl from "@onflow/fcl"
import { commonNftTransactions } from "./scripts"
import { CommonNft } from "./common-nft"

describe("misc", () => {
	fcl.config()
		.put("0xNONFUNGIBLETOKEN", "0xf8d6e0586b0a20c7")
		.put("0xFUNGIBLETOKEN", "0xee82856bf20e2aa6")
		.put("0xNFTPLUS", "0xf8d6e0586b0a20c7")
		.put("0xCOMMONNFT", "0xf8d6e0586b0a20c7")
		.put("0xCOMMONFEE", "0xf8d6e0586b0a20c7")
		.put("0xNFTSTOREFRONT", "0xf8d6e0586b0a20c7")

	test("borrowNft", async () => {
		const result = await fcl
			.send(CommonNft.borrowNft("0xf8d6e0586b0a20c7", 0))
			.then(fcl.decode)
		console.log(result)
	})

	test("check", async () => {
		const result = await fcl
			.send(CommonNft.check("0xf8d6e0586b0a20c7"))
			.then(fcl.decode)
		console.log(result)
	})

	test("getIds", async () => {
		const result = await fcl
			.send(CommonNft.getIds("0xf8d6e0586b0a20c7"))
			.then(fcl.decode)
		console.log(result)
	})

	test("txTest", async () => {
		const result = await fcl.send([
			fcl.transaction(commonNftTransactions.init),
			fcl.payer(fcl.authz),
			fcl.proposer(fcl.authz),
			fcl.authorizations([fcl.authz]),
			fcl.limit(35),
		])
			.then(fcl.decode)
		console.log(result)
	})
})
