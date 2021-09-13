// File: ./src/config.js

import { config } from "@onflow/fcl"

config()
	.put("accessNode.api", "https://access-testnet.onflow.org")
	.put("challenge.handshake", "https://fcl-discovery.onflow.org/testnet/authn")
	.put("0xNONFUNGIBLETOKEN", "0x631e88ae7f1d7c20")
	.put("0xFUNGIBLETOKEN", "0x9a0766d93b6608b7")
	.put("0xNFTPLUS", "0x665b9acf64dfdfdb")
	.put("0xCOMMONNFT", "0x665b9acf64dfdfdb")
	.put("0xCOMMONFEE", "0x665b9acf64dfdfdb")
	.put("0xNFTSTOREFRONT", "0x665b9acf64dfdfdb")
