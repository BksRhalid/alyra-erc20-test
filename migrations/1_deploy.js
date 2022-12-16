const MyToken = artifacts.require("MyToken");

module.exports = async (deployer) => {
  await deployer.deploy(MyToken, "100000");
};
