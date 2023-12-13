## Flow SDK

## Installation

```shell
npm i -S @rarible/flow-sdk
```

## Usage

### Simple code [example](https://github.com/rarible/flow-sdk/tree/master/packages/sdk/example/index.ts)

Quick start

1. [Configure fcl](https://github.com/rarible/flow-sdk/tree/master/packages/sdk#configure-fcl)
2. [Create and use flow-sdk](https://github.com/rarible/flow-sdk/tree/master/packages/sdk#create-and-use-flow-sdk)

### Configure fcl

Flow-sdk use [@onflow/fcl-js](link:https://github.com/onflow/fcl-js). You can find configuration details for fcl
in [this page](https://docs.onflow.org/fcl/tutorials/flow-app-quickstart/#configuration)

```javascript
//example config for testnet
import { config } from "@onflow/fcl";

config({
  "accessNode.api": "https://access-testnet.onflow.org", // Mainnet: "https://access-mainnet-beta.onflow.org"
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn" // Mainnet: "https://fcl-discovery.onflow.org/authn"
})

```

### Create and use flow-sdk

Then we create the SDK according to the network that we configured in the previous step.

```typescript
import { createFlowSdk } from "@rarible/flow-sdk"
import * as fcl from "@onflow/fcl"

const sdk = createFlowSdk(fcl, "testnet")
```

#### Minting

Mint response represents transaction result extended with `txId` and minted `tokenId`

```typescript
import { toFlowContractAddress } from "@rarible/flow-sdk"
import { toFlowAddress } from "@rarible/types"

// collection = Contact address A.[contactAddress].[contractName]
const collection = toFlowContractAddress("A.0x1234567890abcdef.RaribleNFT")
// royalties - array of objects: {account: FlowAddress, value: BigNumber}, value must be a number between 0 and 1
const royalties = [{ account: toFlowAddress("0x1234567890abcdef"), value: toBigNumberLike("0.1") }]
const metaData = "your meta info" // usually ipfs url

const { tokenId } = await sdk.nft.mint(collection, metaData, royalties)
```

Returns `FlowTransaction` object with minted tokenId

#### Transfer

```typescript
import { toFlowAddress } from "@rarible/types"
import { toFlowContractAddress } from "@rarible/flow-sdk"

const collection = toFlowContractAddress("A.0x1234567890abcdef.RaribleNFT")
const tokenId = 123
const receiver = toFlowAddress("0x1234567890abcdef")

const tx = await sdk.nft.transfer(collection, tokenId, receiver)
```

Returns `FlowTransaction` object

#### Burn

```typescript
import { toFlowContractAddress } from "@rarible/flow-sdk"

const collection = toFlowContractAddress("A.0x1234567890abcdef.RaribleNFT")
const tokenId = 123

const tx = await sdk.nft.burn(collection, tokenId)
```

Returns `FlowTransaction` object

#### Create sell order

```typescript
import { toFlowContractAddress, toFlowItemId } from "@rarible/flow-sdk"

const collection = toFlowContractAddress("A.0x1234567890abcdef.RaribleNFT")
const itemId = toFlowItemId(`${collection}:123`)
const tx = await sdk.nft.sell(collection, currency, itemId, price)

/** supported currencies for now "FLOW" and "FUSD" */

/** FlowItemId you can find in FlowNftItem response from api,
 for example sdk.apis.item.getNftItemsByOwner({address: <your account address>})
 */

/** price must be a string of flow fungible token amount with 8 decimals,  for example: 1.123 or 0.1 or 0.00000001 */
```

Returns `FlowTransaction` object with orderId

#### Update order

```typescript
const tx = await sdk.nft.updateOrder(collection, currency, orderId, price)
// orderId can be a orderId number or full FlowOrder object received from order api
```

Returns `FlowTransaction` object with updated orderId

#### Cancel order

```typescript
const tx = await sdk.nft.cancelOrder(collection, orderId)
```

Returns `FlowTransaction` object

#### Buy an item

```typescript
const tx = await sdk.nft.fill(collection, orderId, owner)
// owner: FlowAddress - order owner address
```

Returns `FlowTransaction` object

#### Create bid

```typescript
import { toFlowContractAddress, toFlowItemId } from "@rarible/flow-sdk"

const collection = toFlowContractAddress("A.0x1234567890abcdef.RaribleNFT")
const itemId = toFlowItemId(`${collection}:123`)
const tx = await sdk.nft.bid(collection, currency, itemId, price)
// params the same as regular order creation
```

Returns `FlowTransaction` object with orderId

#### Update bid

```typescript
const tx = await sdk.nft.updateBid(collection, currency, bidId, price)
```

Returns `FlowTransaction` object with updated orderId

#### Cancel bid

```typescript
const tx = await sdk.nft.cancelBid(collection, bidId)
```

Returns `FlowTransaction` object

#### Accept bid

The same as buy order `sdk.order.fill`

#### Get account fungible tokens balance

```typescript
const balance = await sdk.wallet.getFungibleBalance(accountAddress, "FUSD")
```
