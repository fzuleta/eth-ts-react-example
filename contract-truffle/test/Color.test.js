const { assert } = require('chai');

const Color = artifacts.require("Color.sol");

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract('Color', (accounts) => {
    let contract;
    before( async () => {
        contract = await Color.deployed();
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
        it('Creates a new token', async () => {
            const result = await contract.mint("#ffffff");
            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply, 1);
            const event = result.logs[0].args;

            assert.equal(event.tokenId.toNumber(), 0, `Id is correct ${event.tokenId.toNumber()}`);
            assert.equal(event.from, 0x0000000000000000000000000000000000000000, 'From is correct');
            assert.equal(event.to, accounts[0], 'To is correct');

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