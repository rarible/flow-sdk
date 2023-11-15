export type VaultTokenOptions = {
	contractName: string,
	storagePath: string,
	publicPath: string,
	balancePublicPath: string
}
export const getVaultInitTx = (o: VaultTokenOptions = defaultVaultOptions) => `
      // Return early if the account already stores a ContractName Vault
      if acct.borrow<&${o.contractName}.Vault>(from: ${o.storagePath}) == nil {
          // Create a new ContractName Vault and put it in storage
          acct.save(
              <-${o.contractName}.createEmptyVault(),
              to: ${o.storagePath}
          )

          // Create a public capability to the Vault that only exposes
          // the deposit function through the Receiver interface
          acct.link<&${o.contractName}.Vault{FungibleToken.Receiver}>(
              ${o.publicPath},
              target: ${o.storagePath}
          )

          // Create a public capability to the Vault that only exposes
          // the balance field through the Balance interface
          acct.link<&${o.contractName}.Vault{FungibleToken.Balance}>(
              ${o.balancePublicPath},
              target: ${o.storagePath}
          )
      }
`
export const defaultVaultOptions: VaultTokenOptions = {
	contractName: "%ftContract%",
	storagePath: "%ftStoragePath%",
	publicPath: "%ftPublicPath%",
	balancePublicPath: "%ftBalancePublicPath%",
}
export const vaultOptions: Record<"FUSD" | "FiatToken", VaultTokenOptions> = {
	"FiatToken": {
		contractName: "FiatToken",
		storagePath: "FiatToken.VaultStoragePath",
		publicPath: "FiatToken.VaultReceiverPubPath",
		balancePublicPath: "FiatToken.VaultBalancePubPath",
	},
	"FUSD": {
		contractName: "FUSD",
		storagePath: "/storage/fusdVault",
		publicPath: "/public/fusdReceiver",
		balancePublicPath: "/public/fusdBalance",
	},
}


export const txInitVault: string = `
import NonFungibleToken from 0xNonFungibleToken
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import FUSD from 0xFUSD
import FiatToken from 0xFiatToken

transaction() {
    prepare(acct: AuthAccount) {
${getVaultInitTx(vaultOptions["FiatToken"])}
    }
    execute {
    }
}`
