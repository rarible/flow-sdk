export const transfer = `
    import FungibleToken from 0xFungibleToken
    import %ftContract% from address

    transaction(recepient: Address, amount: UFix64){
      prepare(signer: AuthAccount){
        let sender = signer.borrow<&%ftContract%.Vault>(from: %ftStoragePath%)
          ?? panic("Could not borrow Provider reference to the Vault")

        let receiverAccount = getAccount(recepient)

        let receiver = receiverAccount.getCapability(%ftPublicPath%)
          .borrow<&%ftContract%.Vault{FungibleToken.Receiver}>()
          ?? panic("Could not borrow Receiver reference to the Vault")

        let tempVault <- sender.withdraw(amount: amount)
        receiver.deposit(from: <- tempVault)
      }
    }
  `
