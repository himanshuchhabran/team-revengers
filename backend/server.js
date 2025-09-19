const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
require("dotenv").config();

const app = express();
const fs = require('fs');

app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---
// These details come from your local Ganache instance and Truffle/Hardhat deployment.
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545"); // Ganache RPC URL
// 1. Load the contract artifact file
const contractArtifact = JSON.parse(fs.readFileSync('./build/contracts/ProduceTracker.json', 'utf8'));

// 2. Extract the ABI and the deployed contract address
const contractABI = contractArtifact.abi;
const contractAddress = contractArtifact.networks[5777]?.address; // 5777 is the default Ganache network ID

// Check if the contract address was found
if (!contractAddress) {
    console.error("Could not find deployed contract address. Make sure you have migrated the contract and the network ID (5777) is correct.");
    process.exit(1);
}

// A private key from one of your Ganache accounts to sign transactions.
const privateKey = process.env.PRIVATE_KEY; 
const wallet = new ethers.Wallet(privateKey, provider);

// Connect to the contract
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

console.log("Backend server configured to interact with contract at:", contractAddress);


// --- API ENDPOINTS ---

/**
 * Endpoint to register a new produce batch.
 * Body: { "name": "Organic Potatoes" }
 */
app.post('/produce', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send({ error: 'Produce name is required.' });
        }

        console.log(`Registering new produce: ${name}`);
        const tx = await contract.registerProduce(name);
        await tx.wait(); // Wait for the transaction to be mined

        // Get the ID of the newly created produce
        const newProduceId = await contract.produceCount();
        console.log(`Successfully registered produce with ID: ${newProduceId.toString()}`);
        
        res.status(201).send({ message: 'Produce registered successfully!', produceId: newProduceId.toString() });
    } catch (error) {
        console.error("Error registering produce:", error);
        res.status(500).send({ error: 'Failed to register produce.', details: error.message });
    }
});

/**
 * Endpoint to transfer ownership of a produce batch.
 * Body: { "newOwner": "0x..." }
 */
app.put('/produce/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { newOwner } = req.body; // In a real app, this would be more secure
        if (!newOwner) {
            return res.status(400).send({ error: 'New owner address is required.' });
        }
        
        console.log(`Transferring produce ID ${id} to new owner: ${newOwner}`);
        const tx = await contract.transferOwnership(id, newOwner);
        await tx.wait();

        console.log(`Successfully transferred ownership of produce ID ${id}.`);
        res.status(200).send({ message: 'Ownership transferred successfully!' });
    } catch (error) {
        console.error("Error transferring ownership:", error);
        res.status(500).send({ error: 'Failed to transfer ownership.', details: error.message });
    }
});

/**
 * Endpoint to get the history of a produce batch.
 */
app.get('/produce/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Fetching history for produce ID: ${id}`);

        const history = await contract.getProduceHistory(id);
        const produceInfo = await contract.produceItems(id);

        const response = {
            id: produceInfo.id.toString(),
            name: produceInfo.name,
            owner: produceInfo.owner,
            history: history
        };
        
        console.log(`Successfully fetched history for produce ID ${id}.`);
        res.status(200).send(response);
    } catch (error) {
        console.error("Error fetching produce history:", error);
        res.status(500).send({ error: 'Failed to fetch produce history.', details: error.message });
    }
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Agri-Trace PoC server running on http://localhost:${PORT}`);
});
