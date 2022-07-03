'use strict';

/**
 * This is a Node.JS module to load a user's Identity to his wallet.
 * This Identity will be used to sign transactions initiated by this user.
 * 	User name would be <<ORG_NAME>>_ADMIN
 */

const fs = require('fs'); // FileSystem Library
const path = require('path'); // Support library to build filesystem paths in NodeJs
const { FileSystemWallet, X509WalletMixin } = require('fabric-network'); // Wallet Library provided by Fabric

const crypto_materials = path.resolve(__dirname, '../network/crypto-config'); // Directory where all Network artifacts are stored

// A wallet is a filesystem path that stores a collection of Identities
async function addIdentity(orgType,privateKeyFileName){
	try {
    // create wallet
		const wallet = new FileSystemWallet('./identity/'+orgType+'');

		// Fetch the credentials from our previously generated Crypto Materials required to create this user's identity
		const credentialPath = path.join(crypto_materials, '/peerOrganizations/'+orgType+'.pharma-network.com/users/Admin@'+orgType+'.pharma-network.com');
		const certificate = fs.readFileSync(path.join(credentialPath, '/msp/signcerts/Admin@'+orgType+'.pharma-network.com-cert.pem')).toString();

		// IMPORTANT: Change the private key name to the key generated on your computer
		const privatekey = fs.readFileSync(path.join(credentialPath, '/msp/keystore/'+privateKeyFileName)).toString();

		// Load credentials into wallet
		const identityLabel = orgType.toUpperCase()+'_ADMIN';
		const identity = X509WalletMixin.createIdentity(''+orgType+'MSP', certificate, privatekey);

		await wallet.import(identityLabel, identity);

		console.log(identityLabel +" identity added successfully");

	} catch (error) {
		console.log(error.stack);
		throw new Error(`Error adding to wallet. ${error}`);
	}
}

/**
 * This is a Node.JS module to load all user's Identity to their respective wallet.
 * This Identity will be used to sign transactions initiated by this user.
 */
async function initializeAllIdentititiesDoneAtOnce() {
	try {
		await addIdentity('manufacturer','a7d60f2e26907585bc3a42f2dd0faf6bd0eb4dff8f6e099d3df12d39f1d34125_sk');
		await addIdentity('distributor','5b28905801dc33f04375dec4b4244bdb93dc0d78444310e1ee16d21619e9df6c_sk');
		await addIdentity('retailer','5884b126290eb9efa71acda9fbc924198a291ea87e021687b3e00f2a4be8c8de_sk');
		await addIdentity('consumer','80db60e034de00284ab2e2f81b356fc2d140ce13cd3a296498f28751033e1abc_sk');
		await addIdentity('transporter','294232cf149c785274ebbd5674e341d20f5d45ed027eb1cb5824c845dca35006_sk');
	} catch (error) {
		console.log(error.stack);
		throw new Error(`Error adding to wallet. ${error}`);
	}
}

exports.addIdentity = addIdentity;
exports.initializeAllIdentititiesDoneAtOnce = initializeAllIdentititiesDoneAtOnce;
