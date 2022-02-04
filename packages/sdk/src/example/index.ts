import * as fcl from "@onflow/fcl"
import { createFlowSdk } from "../index"
import { getCollectionId } from "../../build/config/config"

/** Configure fcl first */
/** Learn more about fcl configuration https://docs.onflow.org/fcl/#wallet-interactions */
fcl.config()
	.put("accessNode.api", "https://access-mainnet-beta.onflow.org")
	.put("challenge.handshake", "https://flow-wallet.blocto.app/authn")

/** Create SDK */
const sdk = createFlowSdk(fcl, "mainnet")

/** Nft features: mint, burn, transfer */
const collections = getCollectionId("mainnet", "DisruptArt")

sdk.nft.mint(collections, "ipfs:ipfs://...", []).then(response => {
	console.log("transaction id: ", response.txId)
	console.log("minted token id: ", response.tokenId)
})
