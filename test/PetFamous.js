const { assert } = require('chai');

const PetFamous = artifacts.require("PetFamous");

contract('PetFamous', ([deployer]) => {
    let petFamous;

    before(async() => {
        petFamous = await PetFamous.new();
    });

    describe('deployment', async() => {
        it('deploys successfully', async() => {
            const address = await petFamous.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });
    });

    describe('mint Pet NFT ', async() => {
        let result;
        const imageURL = "test.png";

        it('sender get NFT successfully', async() => {
            result = await petFamous.mintPetNFT(imageURL, { from: deployer });

            const event = result.logs[1].args;
            assert.equal(event.tokenId, 1, 'Token Id is correct');
            assert.equal(event.imageURL, imageURL, 'Image URL is correct');
            assert.equal(event.from, deployer, 'Sender address is correct');

            result = await petFamous.totalSupply();
            assert.equal(result.toString(), '1', 'Total supply is correct');

            result = await petFamous.ownerOf('1');
            assert.equal(result.toString(), deployer.toString(), 'Sender get the token');
        });
    });
})