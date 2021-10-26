import { ec as EC } from "elliptic"

import { SHA3 } from "sha3"
import { Fcl } from "@rarible/fcl-types"

const ec = new EC("p256")

class FlowService {
	constructor(
		private readonly fcl: Fcl,
		private readonly minterFlowAddress: string,
		private readonly minterPrivateKeyHex: string,
		private readonly minterAccountIndex: number,
	) {
	}

	authorizeMinter = () => {
		return async (account: any = {}) => {
			const user = await this.getAccount(this.minterFlowAddress)
			const key = user.keys[this.minterAccountIndex]

			const sign = this.signWithKey
			const pk = this.minterPrivateKeyHex

			return {
				...account,
				tempId: `${user.address}-${key.index}`,
				addr: this.fcl.sansPrefix(user.address),
				keyId: Number(key.index),
				signingFunction: (signable: { message: string }) => {
					return {
						addr: this.fcl.withPrefix(user.address),
						keyId: Number(key.index),
						signature: sign(pk, signable.message),
					}
				},
			}
		}
	}

	getAccount = async (addr: string) => {
		const account = await this.fcl.account(addr)
		return account
	}

	private signWithKey = (privateKey: string, msg: string) => {
		const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"))
		const sig = key.sign(this.hashMsg(msg))
		const n = 32
		const r = sig.r.toArrayLike(Buffer, "be", n)
		const s = sig.s.toArrayLike(Buffer, "be", n)
		return Buffer.concat([r, s]).toString("hex")
	}

	private hashMsg = (msg: string) => {
		const sha = new SHA3(256)
		sha.update(Buffer.from(msg, "hex"))
		return sha.digest()
	}
}

export { FlowService }
