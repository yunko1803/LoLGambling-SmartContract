var GambleFactory = artifacts.require('GambleFactory.sol');
// var Gamble = artifacts.require('Gamble.sol');

module.exports = function (deployer) {
	deployer.deploy(GambleFactory);
};
