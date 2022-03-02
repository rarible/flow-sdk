import { getIpfsCid } from "./get-ipfs-cid"

describe("ipfs cid extractor test", () => {
	test("should get cid from ipfs url or throw", () => {
		expect(getIpfsCid("ipfs://ipfs/QmRLZdXWa3An6LB3k5iuQZhsLrvpheGsWBp7mhtmLFeJaz/image.png"))
			.toEqual("QmRLZdXWa3An6LB3k5iuQZhsLrvpheGsWBp7mhtmLFeJaz")
		expect(getIpfsCid("https://ipfs.daonomic.com/ipfs/QmbCZh92TtsmxCzpgWuuBnYHMkme3YHdhqj5nAybfmHNv3"))
			.toEqual("QmbCZh92TtsmxCzpgWuuBnYHMkme3YHdhqj5nAybfmHNv3")
		expect(() => getIpfsCid("https://ipfs.daonomic.com/ipf/QmbCZh92TtsmxCzpgWuuBnYHMkme3YHdhqj5nAybfmHNv3"))
			.toThrow()
	})
})
