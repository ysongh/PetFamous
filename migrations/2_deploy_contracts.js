const PetFamous = artifacts.require("PetFamous");

module.exports = function(deployer){
    deployer.deploy(PetFamous);
};