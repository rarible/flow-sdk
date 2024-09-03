export const transfer = `
    import FungibleToken from 0xFungibleToken
    import %ftContract% from address

    transaction(recepient: Address, amount: UFix64){
    let sentVault: @{FungibleToken.Vault}

      prepare(signer: auth(BorrowValue) &Account){

        let vaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &%ftContract%.Vault>(from: %ftStoragePath%)
          ?? panic("Could not borrow reference to the owner's Vault!")

        // Withdraw tokens from the signer's stored vault
        self.sentVault <- vaultRef.withdraw(amount: amount)

      }

      execute {

          // Get a reference to the recipient's Receiver
          let receiverRef =  getAccount(recepient)
              .capabilities.borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
                  ?? panic("Could not borrow receiver reference to the recipient's Vault")

          // Deposit the withdrawn tokens in the recipient's receiver
          receiverRef.deposit(from: <-self.sentVault)
      }
    }
  `
