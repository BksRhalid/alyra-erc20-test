const MyToken = artifacts.require("MyToken");

const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const constants = require("@openzeppelin/test-helpers/src/constants");

contract("MyToken", (accounts) => {
  const _name = "MyToken";
  const _symbol = "MTK";
  const _decimals = new BN(18);
  const _initialSupply = new BN(10000);
  const _owner = accounts[0];
  const _recipient = accounts[1];

  let MyTokenInstance;

  beforeEach(async () => {
    MyTokenInstance = await MyToken.new(_initialSupply, { from: _owner });
  });
  // Verify that the constructor params works
  it("has a name", async () => {
    expect(await MyTokenInstance.name()).to.equal(_name);
  });
  it("has a symbol", async () => {
    expect(await MyTokenInstance.symbol()).to.equal(_symbol);
  });
  it("has a decimals", async () => {
    expect(await MyTokenInstance.decimals()).to.be.bignumber.equal(_decimals);
  });
  it("check first balance is initalSupply", async () => {
    expect(await MyTokenInstance.balanceOf(_owner)).to.be.bignumber.equal(
      _initialSupply
    );
  });
  // Verify that the transfer function works
  it("check balance after transfert", async () => {
    expect(await MyTokenInstance.balanceOf(_recipient)).to.be.bignumber.equal(
      new BN(0)
    );
    await MyTokenInstance.transfer(_recipient, new BN(100), { from: _owner });
    expect(await MyTokenInstance.balanceOf(_owner)).to.be.bignumber.equal(
      new BN(9900)
    );
    expect(await MyTokenInstance.balanceOf(_recipient)).to.be.bignumber.equal(
      new BN(100)
    );
  });

  // Verify approval works

  it("check if approval done", async () => {
    let amount = new BN(100);
    let AllowanceBeforeApproval = await MyTokenInstance.allowance(
      _owner,
      _recipient
    );
    expect(AllowanceBeforeApproval).to.be.bignumber.equal(new BN(0));

    await MyTokenInstance.approve(_recipient, amount);

    let AllowanceAfterApproval = await MyTokenInstance.allowance(
      _owner,
      _recipient
    );
    expect(AllowanceAfterApproval).to.be.bignumber.equal(amount);
  });

  // Verify transferFrom works

  it("check if transferFrom done", async () => {
    let amount = new BN(100);

    await MyTokenInstance.approve(_recipient, amount);

    let balanceOwnerBeforeTransfer = await MyTokenInstance.balanceOf(_owner);
    let balanceRecipientBeforeTransfer = await MyTokenInstance.balanceOf(
      _recipient
    );
    expect(balanceOwnerBeforeTransfer).to.be.bignumber.equal(_initialSupply);
    expect(balanceRecipientBeforeTransfer).to.be.bignumber.equal(new BN(0));

    await MyTokenInstance.transferFrom(_owner, _recipient, amount, {
      from: _recipient,
    });

    let balanceOwnerAfterTransfer = await MyTokenInstance.balanceOf(_owner);
    let balanceRecipientAfterTransfer = await MyTokenInstance.balanceOf(
      _recipient
    );

    expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(
      balanceOwnerBeforeTransfer.sub(amount)
    );
    expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(
      balanceRecipientBeforeTransfer.add(amount)
    );
  });
});
