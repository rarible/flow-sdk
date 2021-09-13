import { CommonNft, runScript, runTransaction, waitForSeal } from "@rarible/flow-sdk-scripts"


export const check = async (address: string) =>
	await runScript(CommonNft.check(address))

export const getIds = async (address: string) =>
	await runScript(CommonNft.getIds(address))

export const borrowNft = async (address: string, tokenId: number) =>
	await runScript(CommonNft.borrowNft(address, tokenId))


export const init = async () => {
	const txId = await runTransaction(CommonNft.init())
	await waitForSeal(txId)
	return txId
}

export const clean = async () => {
	const txId = await runTransaction(CommonNft.clean())
	await waitForSeal(txId)
	return txId
}

export const mint = async () => {
	// NftSdk.mint()
}

export const mint0 = async () => {
	const txId = await runTransaction(await CommonNft.mint("ipfs//metadata", [
		{ account: "0xf2319b440a9c452f", value: "1.25" },
		{ account: "0xf2319b440a9c452f", value: "2.45" },
	]))
	await waitForSeal(txId)
	return txId
}

export const burn = async () => {
	const txId = await runTransaction(CommonNft.burn(0))
	await waitForSeal(txId)
	return txId
}

export const transfer = async () => {
	const txId = await runTransaction(CommonNft.transfer(0, "0xf2319b440a9c452f"))
	await waitForSeal(txId)
	return txId
}
