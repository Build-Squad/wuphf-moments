export const getMomentNFTProperties: any = `
import NonFungibleToken from 0x1d7e57aa55817448
import Golazos from 0x87ca73a41bb50ad5

pub struct MomentNFTProperies {
    pub let id: UInt64
    pub let editionID: UInt64
    pub let serialNumber: UInt64

    init(
        id: UInt64,
        editionID: UInt64,
        serialNumber: UInt64
    ) {
        self.id = id
        self.editionID = editionID
        self.serialNumber = serialNumber
    }
}

pub fun main(address: Address, id: UInt64): MomentNFTProperies {
    let account = getAccount(address)

    let collectionRef = account.getCapability(
        Golazos.CollectionPublicPath
    ).borrow<&{Golazos.MomentNFTCollectionPublic}>()
    ?? panic("Could not borrow capability from public collection")

    let nft = collectionRef.borrowMomentNFT(id: id)
        ?? panic("Couldn't borrow momentNFT")

    return MomentNFTProperies(
        id: nft.id,
        editionID: nft.editionID,
        serialNumber: nft.serialNumber
    )
}
`