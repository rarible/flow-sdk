## Flow SDK

## Installation

```shell
npm i -S @rarible/flow-sdk
```

## Usage

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
const {
  txId, // transaction id
  tokenId, // minted tokenId
  status, // flow transaction status
  statusCode, // flow transaction statusCode - for example: value 4 for sealed transaction
  errorMessage,
  events, // events generated from contract and include all events produced by transaction, deopsits withdrown etc.
} = await sdk.nft.mint(collection, "your meta info", [])
```

#### Transfer

```typescript
const {
  status,
  statusCode,
  errorMessage,
  events,
} = await sdk.nft.transfer(collection, tokenId, toFlowAddress)
```

#### Burn

```typescript
const {
  status,
  statusCode,
  errorMessage,
  events,
} = await sdk.nft.burn(collection, tokenId)
```

#### Create sell order

```typescript
const {
  status,
  statusCode,
  errorMessage,
  events,
} = await sdk.nft.sell(collection, currency, tokenId, price)
// supported currencies for now "FLOW" and "FUSD"
// price must be a string of flow fungible token amount with 8 decimals,  for example: 1.123 or 0.1 or 0.00000001
```

#### Update order

```typescript
const {
  status,
  statusCode,
  errorMessage,
  events,
} = await sdk.nft.sell(collection, currency, orderId, price)
// supported currencies for now "FLOW" and "FUSD"
// price must be a string of flow fungible token amount with 8 decimals,  for example: 1.123 or 0.1 or 0.00000001
```

#### Cancel order

```typescript
const {
  status,
  statusCode,
  errorMessage,
  events,
} = await sdk.nft.sell(collection, orderId)
```

#### Buy an item

```typescript
const {
  status,
  statusCode,
  errorMessage,
  events,
} = await sdk.nft.fill(collection, orderId, owner)
```

