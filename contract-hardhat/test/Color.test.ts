import { ethers, waffle } from 'hardhat'
import { assert, expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { Color } from './../types/Color';
const { deployContract } = waffle

const ColorArtifact = require('../artifacts/contracts/Color.sol/Color.json');

describe("Color contract", () => {
    let colorContract: Color;
    let signers: SignerWithAddress[];
    beforeEach( async () => {
        signers = await ethers.getSigners();
        colorContract = (await deployContract(signers[0], ColorArtifact)) as Color;
        
        // const Color = await ethers.getContractFactory("Color");
        // contract = (await Color.deploy()) as Color;

        expect(colorContract.address).to.properAddress;
    });

    describe('deployment', async() => {
        it('deploys successfuly', async () => {
            const address = colorContract.address;
            assert.notEqual(address, '');
            assert.notEqual(address as any, 0x0);
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });
        it('has a name', async () => {
            const name = await colorContract.name()
            assert.equal(name, 'Color');
        });
        it('has a symbol', async () => {
            const sym = await colorContract.symbol()
            assert.equal(sym, 'COLOR');
        });
    });

    describe('minting', async() => {
        it('Creates a new token', async () => {
            // console.log(contract.functions);
            const tx = await colorContract['mint(string)']('salmon');
            const totalSupply = await colorContract.totalSupply();
            expect(totalSupply.toNumber()).to.eq(1);
            // console.log(tx);
            expect(tx.from).eq(signers[0].address)
            // const event = result.logs[0].args;

            // assert.equal(event.tokenId.toNumber(), 0, `Id is correct ${event.tokenId.toNumber()}`);
            // assert.equal(event.from, 0x0000000000000000000000000000000000000000, 'From is correct');
            // assert.equal(event.to, signers[0].address, 'To is correct');

            let failed = false;
            try {
                await colorContract['mint(string)']("salmon");
            } catch (e) {
                failed = true;
            }
            expect(failed).to.be.true;

        });
    });
    describe('indexing', () => {
        it('lists colors', async () => {
            await colorContract['mint(string)']("red");
            await colorContract['mint(string)']("green");
            await colorContract['mint(string)']("blue");
            const totalSupply = (await colorContract.totalSupply()).toNumber();

            let color;
            let result = [];
            for (let i = 1; i <= totalSupply; i++) {
                color = await colorContract.colors(i - 1);
                result.push(color);
            }
            const expected = ['red', 'green', 'blue'];
            assert.equal(result.join(','), expected.join(','));
        });
    });
});



