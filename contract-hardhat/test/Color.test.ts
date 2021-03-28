import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { assert } from 'chai';
import { ethers } from 'hardhat';

describe("Color contract", () => {
    let contract: any;
    let signers: SignerWithAddress[];
    before( async () => {
        signers = await ethers.getSigners();
        const Color = await ethers.getContractFactory("Color");
        contract = await Color.deploy();
    });

    describe('deployment', async() => {
        it('deploys successfuly', async () => {
            const address = contract.address;
            assert.notEqual(address, '');
            assert.notEqual(address, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });
        it('has a name', async () => {
            const name = await contract.name()
            assert.equal(name, 'Color');
        });
        it('has a symbol', async () => {
            const sym = await contract.symbol()
            assert.equal(sym, 'COLOR');
        });
    });

    describe('minting', async() => {
        it.only('Creates a new token', async () => {
            console.log(contract.interface.functions);
            const result = await contract.functions.mint("#ffffff");
            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply, 1);
            const event = result.logs[0].args;

            assert.equal(event.tokenId.toNumber(), 0, `Id is correct ${event.tokenId.toNumber()}`);
            assert.equal(event.from, 0x0000000000000000000000000000000000000000, 'From is correct');
            assert.equal(event.to, signers[0].address, 'To is correct');

            await contract.mint("#ffffff").should.be.rejected;
        });
    });
    describe('indexing', () => {
        it('lists colors', async () => {
            await contract.mint("red");
            await contract.mint("green");
            await contract.mint("blue");
            const totalSupply = await contract.totalSupply();

            let color;
            let result = [];
            for (let i = 1; i<=totalSupply; i++) {
                color = await contract.colors(i - 1);
                result.push(color);
            }
            const expected = ['#ffffff', 'red', 'green', 'blue'];
            assert.equal(result.join(','), expected.join(','));
        });
    });
});



