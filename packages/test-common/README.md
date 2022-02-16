Test account

For generating and funding flow accounts we're using [flow-js-testing](https://docs.onflow.org/flow-js-testing/) library
Usage example for flow [emulator](https://docs.onflow.org/emulator/).

```typescript
import { createEmulatorAccount, createFlowEmulator, createTestAuth } from "@rarible/flow-test-common"
import { createFlowSdk } from "@rarible/flow-sdk"

/* Firstly we create an emulator instance that starts and stops flow emulator in before/after test hooks*/
createFlowEmulator(fcl, network, accountAddress, accountPrivateKey, AccountKeyIndex)

const account = createEmulatorAccount("accountNameString") // may be any string
const auth = createTestAuth(fcl, "emulator", account.address, account.pk)

/* then we can create Sdk */

const sdk = createFlowSdk(fcl, "emulator", {}, auth)
```

For testnet we must create and fund testnet account to create a flow account on the testnet you need to do the following
steps:

1. Generate keys for account with command `flow keys generate`
2. Create account with your created public key [here](https://testnet-faucet.onflow.org/)
3. (Optional) fund your account by FLOW or FUSD tokens if needed [here](https://testnet-faucet.onflow.org/fund-account)

Now we can create test auth for SDK with account private key and address

```typescript
import { createTestAuth } from "@rarible/flow-test-common"
import { createFlowSdk } from "@rarible/flow-sdk"

const auth = createTestAuth(fcl, "emulator", account.address, account.pk)

const sdk = createFlowSdk(fcl, "emulator", {}, auth)
```
