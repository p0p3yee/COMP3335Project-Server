const myContract = artifacts.require("./contract.sol");
// const Migrations = artifacts.require("./Migrations.sol");
module.exports = deployer => {
  deployer.deploy(myContract);
};