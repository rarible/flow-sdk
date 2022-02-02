import type { NonFungibleContract } from "../../types"

// type _FlowContractAddressPrefix = "A"

type _FlowAddress = string

// type _FlowContractName = FlowContractName

type _FlowCollectionName = NonFungibleContract
type _FlowCollectionId = string
type _FlowCollectionFullId = string & {
	__IS_FLOW_COLLECTION_FULL_ID__: true
}

// flow address - optional prefixed with "0x" string from characters and digits and length of 16(sans prefixed)
// contract resource and collection addresses are always prefixed with "A."
// contract name - word of any characters and digits
// collection id - A.[flow address].[flow non fungible contract name]?.[collection id: stringify number]
// contract address - A.[flow address].[flow any contract name]

const collectionIdRegExp = /^A\.0*x*[0-9a-f]{16}\.[0-9A-Za-z_]{3,}(\.[0-9]+)?$/

export function _toFlowCollectionFullId(
	address: _FlowAddress,
	name: _FlowCollectionName,
	id?: _FlowCollectionId,
): _FlowCollectionFullId {
	const collection = `A.${address}.${name}${id ? `.${id}` : ""}`
	if (collectionIdRegExp.test(collection)) {
		return collection as _FlowCollectionFullId
	}
	throw new Error(`${collection} is not valid flow collection id`)
}

describe("Test toCollectionId func", () => {
	test("should success cast to _FlowCollectionFullId type", () => {
		expect(_toFlowCollectionFullId("abcdef1234567890", "SoftCollection", "123")).toBeTruthy()
	})
})
