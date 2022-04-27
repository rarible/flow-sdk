# Flow SDK

Rarible Protocol Flow combines smart contracts for minting, exchanging tokens, APIs for order creation, discovery,
standards used in smart contracts.

Flow SDK enables applications to interact with protocol easily.

You can find detailed documentation at [docs.rarible.org](https://docs.rarible.org).

## Installation

```shell
npm i -S @rarible/flow-sdk
```

Install mono-repository dependencies:

```shell
yarn
```

To install dependencies and add linking run:

```shell
yarn bootstrap
```

To build all packages:

```shell
yarn build-all
```

If you haven't declared the `NPM_TOKEN` variable in the environment variables, add it with any value or export it
temporarily for the current session:

```shell
export NPM_TOKEN="123"
```

Otherwise, the `yarn` commands will not work.

## Testing

To run tests, you need to install [flow-cli](https://docs.onflow.org/flow-cli/install/).

nodejs version 16.9.0 is interrupting on tests with Flow emulator in some cases. It's an upstream bug in V8 present in node 16.9.0. [Here's](https://github.com/nodejs/node/issues/40030) more info about the bug.

## Usage

### Configure fcl

Flow-sdk use [@onflow/fcl-js](link:https://github.com/onflow/fcl-js). You can find configuration details for fcl in [this page](https://docs.onflow.org/fcl/tutorials/flow-app-quickstart/#configuration).

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

### Minting

Mint response represents transaction result extended with `txId` and minted `tokenId`

```typescript
import { toBigNumber, toFlowAddress } from "@rarible/types"

// royalties - array of objects: {account: FlowAddress, value: BigNumber}, value must be a number between 0 and 1
const yourRoyalties = [{ account: toFlowAddress("0x1234567890abcdef"), value: toBigNumber("0.1") }]

const {
  txId, // transaction id
  tokenId, // minted tokenId
  status, // flow transaction status
  statusCode, // flow transaction statusCode - for example: value 4 for sealed transaction
  errorMessage,
  events, // events generated from contract and include all events produced by transaction, deopsits withdrown etc.
} = await sdk.nft.mint(collection, "your meta info", yourRoyalties)
```

### Transfer

```typescript
const {
  status,
  statusCode,
  errorMessage,
  events,
} = await sdk.nft.transfer(collection, tokenId, toFlowAddress)
```

### Burn

```typescript
const {
  status,
  statusCode,
  errorMessage,
  events,
} = await sdk.nft.burn(collection, tokenId)
```

### Create sell order

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

### Update order

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

### Cancel order

```typescript
const {
  status,
  statusCode,
  errorMessage,
  events,
} = await sdk.nft.sell(collection, orderId)
```

### Buy an item

```typescript
const {
  status,
  statusCode,
  errorMessage,
  events,
} = await sdk.nft.fill(collection, orderId, owner)
```

## Suggestions

You are welcome to [suggest features](https://github.com/rarible/protocol/discussions) and [report bugs found](https://github.com/rarible/protocol/issues)!

## Contributing

The codebase is maintained using the "contributor workflow" where everyone without exception contributes patch proposals using "pull requests" (PRs). This facilitates social contribution, easy testing, and peer review.

See more information on [CONTRIBUTING.md](https://github.com/rarible/protocol/blob/main/CONTRIBUTING.md).

## License

Rarible Protocol Flow SDK is available under the [MIT License](LICENSE).
