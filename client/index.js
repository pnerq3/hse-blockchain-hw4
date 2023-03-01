require('dotenv').config()
const fs = require('fs')
const Web3 = require('web3')

async function main() {
    // Part 1: Infura API key is stored in .env file
    const rpcURL = `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`;

    const web3 = new Web3(rpcURL);
    // Check that we can connect to Eth using Infura
    const myAccount = '0xf5294597001ff3DC604248B65C970fE0A2Bf88FE';
    const myBalance = await web3.eth.getBalance(myAccount);
    console.log(`ETH balance: ${myBalance / 1e18}`);

    // Part 3 (using ERC20 SmC from previous HW)
    const ABI = JSON.parse(fs.readFileSync('SomeToken.json')).abi;
    let myContract = new web3.eth.Contract(ABI, '0xF8C5cd0a23A108974351f9208749d8ac0928511f');

    // Let's call a method. "balanceOf" is a view method, so it doesn't cost any gas when called externally.
    const mySomeTokenBalance = await myContract.methods.balanceOf(myAccount).call();
    console.log(`STK balance: ${mySomeTokenBalance / 1e18}`);

    // Let's view events (Transfer)
    const firstBlock ='8481109';  // The block in which the contract was deployed
    const events = await myContract.getPastEvents('Transfer', {
        fromBlock: firstBlock,
        toBlock: 'latest'
    });
    console.log(`STK Transfer events: ${JSON.stringify(events, null, 2)}`);
}

main().catch(console.error);
