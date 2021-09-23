import { ec as EC } from "elliptic"
import { SHA3 } from "sha3"
import * as rlp from "rlp"
import { config } from "@onflow/fcl"

const ec = new EC("p256")

const hashMsgHex = (msgHex: string) => {
	const sha = new SHA3(256)
	sha.update(Buffer.from(msgHex, "hex"))
	return sha.digest()
}

export const signWithKey = (privateKey: string, msgHex: string): string => {
	const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
	const sig = key.sign(hashMsgHex(msgHex))
	const n = 32 // half of signature length?
	const r = sig.r.toArrayLike(Buffer, "be", n)
	const s = sig.s.toArrayLike(Buffer, "be", n)
	return Buffer.concat([r, s]).toString("hex")
}

export const authorization =
	(addr?: string, pk?: string, keyId = 0) =>
		async (account = {}) => {
			let serviceAddress: string
			let pkey: string

			if (addr && pk) {
				serviceAddress = addr
				pkey = pk
			} else {
				serviceAddress = await config().get("SERVICE_ADDRESS")
				pkey = await config().get("PRIVATE_KEY")
			}

			addr = sansPrefix(addr || serviceAddress)!

			const signingFunction = async (data: any) => ({
				keyId,
				addr: withPrefix(addr!),
				signature: signWithKey(pkey, data.message),
			})

			return {
				...account,
				tempId: `${addr}-${keyId}`,
				addr: sansPrefix(addr),
				keyId,
				signingFunction,
			}
		}

export const pubFlowKey = async () => {
	const keys = ec.keyFromPrivate(Buffer.from(await config().get("PRIVATE_KEY"), "hex"))
	const publicKey = keys.getPublic("hex").replace(/^04/, "")
	return rlp
		.encode([
			Buffer.from(publicKey, "hex"), // publicKey hex to binary
			2, // P256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
			3, // SHA3-256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
			1000, // give key full weight
		])
		.toString("hex")
}

export const sansPrefix = (address: string): string | null => {
	if (address == null) return null
	return address.replace(/^0x/, "")
}

export const withPrefix = (address: string): string | null => {
	if (address == null) return null
	return "0x" + sansPrefix(address)
}
