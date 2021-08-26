import * as fcl from "@onflow/fcl"

class Service {

	getAccount = async (address: string) => {
		const { account } = await fcl.send([fcl.getAccount(address)])
		return account
	}

}

export { Service }
