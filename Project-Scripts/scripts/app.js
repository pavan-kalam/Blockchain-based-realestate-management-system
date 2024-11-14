import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";
import { addTransaction, getTransactions, clearTransactions } from './transactionHistory.js';
import { abi } from "./abi.js";
// Create a global dapp object to store our functions
window.dapp = {};

const contractAddress = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
// const ETHERSCAN_API_KEY = '1743RQKSKC4EFE26MTHG3Y8MHVV8DEJWQF';
// const COINMARKETCAP_API_KEY = '8c021844-c880-46fd-8bd0-a153bf87c9ed'; // Replace with your actual API key

let lastUpdate = 0;
const CACHE_DURATION = 300000; // 5 minutes
// Add these variables at the top of your JavaScript file
let isAuthenticated = false;
let userRole = null;

// Hardcoded admin credentials (in a real application, this should be handled securely)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// const abi = [
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "initialOwner",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "constructor"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "sender",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         },
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         }
//       ],
//       "name": "ERC721IncorrectOwner",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "operator",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "name": "ERC721InsufficientApproval",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "approver",
//           "type": "address"
//         }
//       ],
//       "name": "ERC721InvalidApprover",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "operator",
//           "type": "address"
//         }
//       ],
//       "name": "ERC721InvalidOperator",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         }
//       ],
//       "name": "ERC721InvalidOwner",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "receiver",
//           "type": "address"
//         }
//       ],
//       "name": "ERC721InvalidReceiver",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "sender",
//           "type": "address"
//         }
//       ],
//       "name": "ERC721InvalidSender",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "name": "ERC721NonexistentToken",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         }
//       ],
//       "name": "OwnableInvalidOwner",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         }
//       ],
//       "name": "OwnableUnauthorizedAccount",
//       "type": "error"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "approved",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "name": "Approval",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "operator",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "bool",
//           "name": "approved",
//           "type": "bool"
//         }
//       ],
//       "name": "ApprovalForAll",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "previousOwner",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "newOwner",
//           "type": "address"
//         }
//       ],
//       "name": "OwnershipTransferred",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "string",
//           "name": "location",
//           "type": "string"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "price",
//           "type": "uint256"
//         }
//       ],
//       "name": "PropertyListed",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "address",
//           "name": "buyer",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "price",
//           "type": "uint256"
//         }
//       ],
//       "name": "PropertySold",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "from",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "name": "Transfer",
//       "type": "event"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "name": "approve",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         }
//       ],
//       "name": "balanceOf",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "name": "buyProperty",
//       "outputs": [],
//       "stateMutability": "payable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "name": "getApproved",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "name": "getProperty",
//       "outputs": [
//         {
//           "components": [
//             {
//               "internalType": "string",
//               "name": "location",
//               "type": "string"
//             },
//             {
//               "internalType": "uint256",
//               "name": "price",
//               "type": "uint256"
//             },
//             {
//               "internalType": "bool",
//               "name": "forSale",
//               "type": "bool"
//             }
//           ],
//           "internalType": "struct TokenLand.Property",
//           "name": "",
//           "type": "tuple"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "operator",
//           "type": "address"
//         }
//       ],
//       "name": "isApprovedForAll",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "newPrice",
//           "type": "uint256"
//         }
//       ],
//       "name": "listPropertyForSale",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "string",
//           "name": "location",
//           "type": "string"
//         },
//         {
//           "internalType": "uint256",
//           "name": "price",
//           "type": "uint256"
//         }
//       ],
//       "name": "mintProperty",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "name",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "owner",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "name": "ownerOf",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "productCount",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "name": "properties",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "location",
//           "type": "string"
//         },
//         {
//           "internalType": "uint256",
//           "name": "price",
//           "type": "uint256"
//         },
//         {
//           "internalType": "bool",
//           "name": "forSale",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "renounceOwnership",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "from",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "name": "safeTransferFrom",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "from",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         },
//         {
//           "internalType": "bytes",
//           "name": "data",
//           "type": "bytes"
//         }
//       ],
//       "name": "safeTransferFrom",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "operator",
//           "type": "address"
//         },
//         {
//           "internalType": "bool",
//           "name": "approved",
//           "type": "bool"
//         }
//       ],
//       "name": "setApprovalForAll",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes4",
//           "name": "interfaceId",
//           "type": "bytes4"
//         }
//       ],
//       "name": "supportsInterface",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "symbol",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "name": "tokenURI",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "from",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "tokenId",
//           "type": "uint256"
//         }
//       ],
//       "name": "transferFrom",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "newOwner",
//           "type": "address"
//         }
//       ],
//       "name": "transferOwnership",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     }
// ];

let contract;
let signer;
let ethUsdRate = 0;

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, abi, signer);
            console.log("Contract initialized:", contract);
            const address = await signer.getAddress();
            document.getElementById('accountInfo').innerText = `Connected: ${address}`;
            await displayCurrentBlockNumber();
            await displayUserBalance();
            await verifyContractDeployment();
            await fetchEthUsdRate();
            
            // Hide connect button and show login section
            document.getElementById('connectButton').style.display = 'none';
            showLoginSection();
            // Show navigation after successful connection
            // document.getElementById('navigation').style.display = 'flex';
            
            // loadProperties();
            // displayTransactionHistory();
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            alert(`Failed to connect wallet: ${error.message}`);
        }
    } else {
        alert('Please install MetaMask!');
    }
}

// Add these new functions
function showLoginSection() {
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('appSection').style.display = 'none';
  document.getElementById('navigation').style.display = 'none';
}

function showAppSection() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('appSection').style.display = 'block';
  document.getElementById('navigation').style.display = 'block';
}

async function loginAsAdmin() {
  const username = document.getElementById('usernameInput').value;
  const password = document.getElementById('passwordInput').value;

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      userRole = 'admin';
      isAuthenticated = true;
      document.getElementById('navigation').style.display = 'block';
      document.getElementById('adminButtons').style.display = 'block';
      document.getElementById('buyerButtons').style.display = 'none';
      showAppSection();
      loadPage('buy'); // Load default page
  } else {
      alert('Invalid admin credentials!');
  }
}

async function loginAsBuyer() {
  userRole = 'buyer';
  isAuthenticated = true;
  document.getElementById('navigation').style.display = 'block';
  document.getElementById('adminButtons').style.display = 'none';
  document.getElementById('buyerButtons').style.display = 'block';
  showAppSection();
  loadPage('buy'); // Load default page
}

function logout() {
  isAuthenticated = false;
  userRole = null;
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('appSection').style.display = 'none';
  document.getElementById('navigation').style.display = 'none';
  document.getElementById('adminButtons').style.display = 'none';
  document.getElementById('buyerButtons').style.display = 'none';
  document.getElementById('logoutButton').style.display = 'none';
  document.getElementById('connectButton').style.display = 'block';
  document.getElementById('accountInfo').innerText = 'Not connected';
  document.getElementById('blockInfo').innerText = '';
  document.getElementById('balanceInfo').innerText = '';
}

async function verifyContractDeployment() {
  try {
      if (!window.ethereum) {
          console.warn("MetaMask not detected");
          return;
      }
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Add a check for provider
      if (!provider) {
          console.warn("Provider not initialized");
          return;
      }

      const code = await provider.getCode(contractAddress);
      if (code === "0x") {
          console.warn("Contract not deployed at this address on current network");
          // Don't block the rest of the functionality
      } else {
          console.log("Contract verified at address:", contractAddress);
      }
  } catch (error) {
      console.warn("Error verifying contract:", error);
      // Don't block the rest of the functionality
  }
}

async function displayCurrentBlockNumber() {
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const blockNumber = await provider.getBlockNumber();
        console.log("Current block number:", blockNumber);
        document.getElementById('blockInfo').innerText = `Current Block: ${blockNumber}`;
    } catch (error) {
        console.error("Failed to get block number:", error);
    }
}

async function displayUserBalance() {
    if (!signer) {
        console.error("Wallet not connected");
        return;
    }
    try {
        const address = await signer.getAddress();
        const balance = await signer.getBalance();
        const balanceInEth = ethers.utils.formatEther(balance);
        console.log("User balance:", balanceInEth, "ETH");
        document.getElementById('balanceInfo').innerText = `Balance: ${balanceInEth} USDT`;
    } catch (error) {
        console.error("Failed to get balance:", error);
    }
}

async function mintProperty() {
  if (!contract) {
      alert('Please connect your wallet first');
      return;
  }

  if (userRole !== 'admin') {
    alert('Only administrators can mint properties');
    return;
  }

  const location = document.getElementById('locationInput').value;
  const priceEth = document.getElementById('priceInput').value;

  if (!location || !priceEth) {
      alert('Please enter both location and price.');
      return;
  }

  try {
      const priceWei = ethers.utils.parseEther(priceEth);
      const priceUsd = await convertEthToUsd(priceEth);
      
      const tx = await contract.mintProperty(location, priceWei);
      await tx.wait();
      
      alert('Property minted successfully!');
      addTransaction('Mint', `Minted property at ${location} for ${priceEth} USDT (≈ $${priceUsd} USD)`);
      
      // Clear form
      document.getElementById('locationInput').value = '';
      document.getElementById('priceInput').value = '';
      document.getElementById('usdPrice').innerHTML = '≈ $0.00 USD';
      
      loadProperties();
      displayTransactionHistory();
  } catch (error) {
      console.error("Failed to mint property:", error);
      alert(`Failed to mint property: ${error.message}`);
  }
}

async function listProperty() {
    if (!contract) {
        alert('Please connect your wallet first');
        return;
    }

    if (userRole !== 'admin') {
      alert('Only administrators can mint properties');
      return;
    }

    const tokenId = document.getElementById('tokenIdInput').value;
    const priceEth = document.getElementById('listPriceInput').value;

    if (!tokenId || !priceEth) {
        alert('Please enter both Token ID and price.');
        return;
    }

    try {
        const priceWei = ethers.utils.parseEther(priceEth);
        const tx = await contract.listPropertyForSale(tokenId, priceWei);
        await tx.wait();
        alert('Property listed successfully!');
        const priceUsd = await convertEthToUsd(priceEth);
        
        addTransaction('List', `Listed property ${tokenId} for ${priceEth} USDT (≈ $${ priceUsd} USD)`);
        loadProperties();
        displayTransactionHistory();
    } catch (error) {
        console.error("Failed to list property:", error);
        alert(`Failed to list property: ${error.message}`);
    }
}

async function loadProperties() {
    if (!contract) {
        alert('Please connect your wallet first');
        return;
    }

    const propertyList = document.getElementById('propertyList');
    if (!propertyList) {
      console.error("Property list element not found");
      return;
    }

    propertyList.innerHTML = '';
    try {
        const count = await contract.productCount();
        console.log("Product count:", count.toString());
        for (let i = 1; i <= count; i++) {
            const property = await contract.getProperty(i);
            // const location = await contract.mintProperty(Location);
            const priceEth = ethers.utils.formatEther(property.price);
            const priceUsd = await convertEthToUsd(priceEth);
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                Token ID: ${i}<br>
                Location: ${property.location}<br>
                Price: ${priceEth} USDT (≈ $${priceUsd} USD)<br>
                For Sale: ${property.forSale}<br>
                <button onclick="window.dapp.buyProperty(${i}, '${property.price}')">Buy Property</button>
            `;
            propertyList.appendChild(listItem);
        }
    } catch (error) {
        console.error("Failed to load properties:", error);
        alert('Failed to load properties. Check console for details.');
    }
}

async function buyProperty(tokenId, price) {
    if (!contract) {
        alert('Please connect your wallet first');
        return;
    }

    try {
        const tx = await contract.buyProperty(tokenId, { value: price });
        await tx.wait();
        alert('Property purchased successfully!');
        const priceEth = ethers.utils.formatEther(price);
        const priceUsd = await convertEthToUsd(priceEth);
        addTransaction('Buy', `Bought property ${tokenId} for ${priceEth} USDT (≈ $${priceUsd} USD)`);
        loadProperties();
        displayUserBalance();
        displayTransactionHistory();
    } catch (error) {
        console.error("Failed to buy property:", error);
        alert(`Failed to buy property: ${error.message}`);
    }
}

function displayTransactionHistory() {
    const transactionList = document.getElementById('transactionList');
    
    if (transactionList) {
        transactionList.innerHTML = '';
        const transactions = getTransactions();
        transactions.forEach(tx => {
            const listItem = document.createElement('li');
            listItem.textContent = `${new Date(tx.timestamp).toLocaleString()} - ${tx.type}: ${tx.description}`;
            transactionList.appendChild(listItem);
        });
    } else {
        console.error("Transaction list element not found");
    }
}

const cacheDuration = 300000; // 5 minute

// let cachedUsdtUsdRate;
let cachedLastUpdate;

async function fetchEthUsdRate() {
    if (ethUsdRate && Date.now() - cachedLastUpdate < cacheDuration) {
        return ethUsdRate;
    }

    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd');
        const data = await response.json();
        if (data.tether && data.tether.usd) {
            const usdtUsdRate = parseFloat(data.tether.usd);
            ethUsdRate = usdtUsdRate;
            cachedLastUpdate = Date.now();
            return usdtUsdRate;
        }
    } catch (error) {
        console.error("All API attempts failed", error);
    }


  // If both APIs fail, use cached or fallback rate
  if (ethUsdRate !== 0) {
    return ethUsdRate;
  }
  return 2000; // Fallback rate
}

async function convertEthToUsd(ethAmount) {
  try {
      const rate = await fetchEthUsdRate();
      const usdAmount = (parseFloat(ethAmount) * rate).toFixed(2);
      console.log(`Converted ${ethAmount} USDT to $${usdAmount} USD`);
      return usdAmount;
  } catch (error) {
      console.error("Error converting USDT to USD:", error);
      // Use fallback calculation if conversion fails
      const fallbackRate = ethUsdRate || 2000;
      return (parseFloat(ethAmount) * fallbackRate).toFixed(2);
  }
}

// Add a function to handle the conversion display
// Define the function
async function convertAndDisplay() {
  const ethAmount = document.getElementById('ethAmount').value;
  if (!ethAmount) {
      alert('Please enter an USDT amount');
      return;
  }

  try {
      const usdAmount = await convertEthToUsd(ethAmount);
      const resultDiv = document.getElementById('usdResult');
      if (resultDiv) {
          resultDiv.innerHTML = `${ethAmount} USDT = $${usdAmount} USD`;
      }
  } catch (error) {
      console.error("Error in conversion:", error);
      alert('Error converting amount. Please try again.');
  }
}

async function updateUsdPrice(inputId, displayId) {
  try {
      const ethInput = document.getElementById(inputId);
      const usdDisplay = document.getElementById(displayId);
      
      if (!ethInput || !usdDisplay) return;
      
      const ethAmount = ethInput.value;
      
      if (ethAmount && !isNaN(ethAmount)) {
          const usdAmount = await convertEthToUsd(ethAmount);
          usdDisplay.innerHTML = `≈ $${usdAmount} USD`;
      } else {
          usdDisplay.innerHTML = `≈ $0.00 USD`;
      }
  } catch (error) {
      console.error("Error updating USD price:", error);
  }
}

// Add to window.dapp object
window.dapp.updateUsdPrice = updateUsdPrice;

// Make sure to expose it to the window.dapp object
window.dapp.convertAndDisplay = convertAndDisplay;

async function loadPage(page) {
    if (!isAuthenticated) {
      showLoginSection();
      return;
    }
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = '';

    switch(page) {
        case 'mint':
            if (userRole !== 'admin') {
              mainContent.innerHTML = `
                  <h2>Access Denied</h2>
                  <p>Only administrators can access this page.</p>
              `;
              return;
            }
            mainContent.innerHTML = `
                <h2>Mint New Property</h2>
                <div class="mint-form">
                    <div class="input-group">
                        <input id="locationInput" type="text" placeholder="Property Location">
                    </div>
                    <div class="input-group">
                        <input id="priceInput" type="number" 
                            step="0.000000000000000001" 
                            placeholder="Price (in USDT)" 
                            oninput="window.dapp.updateUsdPrice('priceInput', 'usdPrice')">
                        <div id="usdPrice" class="usd-conversion">≈ $0.00 USD</div>
                    </div>
                    <button onclick="window.dapp.mintProperty()">Mint Property</button>
                </div>
            `;
            break;

        case 'list':
            if (userRole !== 'admin') {
              mainContent.innerHTML = `
                  <h2>Access Denied</h2>
                  <p>Only administrators can access this page.</p>
              `;
              return;
            }
            mainContent.innerHTML = `
                <h2>List Property for Sale</h2>
                <div class="list-form">
                    <div class="input-group">
                        <input id="tokenIdInput" type="number" placeholder="Token ID">
                    </div>
                    <div class="input-group">
                        <input id="listPriceInput" type="number" 
                            step="0.000000000000000001" 
                            placeholder="List Price (in USDT)" 
                            oninput="window.dapp.updateUsdPrice('listPriceInput', 'listUsdPrice')">
                        <div id="listUsdPrice" class="usd-conversion">≈ $0.00 USD</div>
                    </div>
                    <button onclick="window.dapp.listProperty()">List Property</button>
                </div>
            `;
            break;
        case 'buy':
            mainContent.innerHTML = `
               <h2>Available Properties</h2>
               <ul id="propertyList"></ul>
            `;
            loadProperties();
            break;
        case 'convert':
            mainContent.innerHTML = `
                <h2>ETH to USD Converter</h2>
                <div id="ethUsdRate">Loading current USDT/USD rate...</div>
                <div class="converter-container">
                    <input id="ethAmount" type="number" step="0.000000000000000001" placeholder="USDT Amount">
                    <button onclick="window.dapp.convertAndDisplay()">Convert to USD</button>
                    <div id="usdResult"></div>
                </div>
            `;
            
            fetchEthUsdRate().then(() => displayEthUsdRate());
            break;
        case 'history':
            mainContent.innerHTML = `
            
                <h2>Transaction History</h2>
                <ul id="transactionList"></ul>
            
            `;
            await displayTransactionHistory();
            break;
    }
}

// Expose functions to the window object
window.dapp.connectWallet = connectWallet;
window.dapp.loadPage = loadPage;
window.dapp.mintProperty = mintProperty;
window.dapp.listProperty = listProperty;
window.dapp.buyProperty = buyProperty;
window.dapp.convertEthToUsd = convertEthToUsd;
// Add these to your existing window.dapp assignments
window.dapp.loginAsAdmin = loginAsAdmin;
window.dapp.loginAsBuyer = loginAsBuyer;
window.dapp.logout = logout;
window.dapp.showLoginSection = showLoginSection;
window.dapp.showAppSection = showAppSection;
window.dapp.displayTransactionHistory = displayTransactionHistory;
// window.dapp.showLoginPage = showLoginPage;
// window.dapp.setupNavigation = setupNavigation;



document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('connectButton');
    if (connectButton) {
        connectButton.addEventListener('click', window.dapp.connectWallet);
    }

    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                console.log("Wallet disconnected");
                document.getElementById('accountInfo').innerText = 'Not connected';
            } else {
                console.log("Wallet account changed:", accounts[0]);
                window.dapp.connectWallet();
            }
        });

        window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
        });
    }
});

// Add a function to display the current ETH/USD rate on your page
function displayEthUsdRate() {
  const rateDisplay = document.getElementById('ethUsdRate');
  if (rateDisplay) {
      const isFallback = ethUsdRate === 2000;
      rateDisplay.innerHTML = `Current USDT/USD Rate: $${ethUsdRate}${isFallback ? ' (Fallback Rate)' : ''}`;
      if (isFallback) {
          rateDisplay.style.color = 'orange'; // Highlight fallback rate
      } else {
          rateDisplay.style.color = ''; // Reset color
      }
  }
}

// Update the interval to fetch price updates (every 1 minute)
setInterval(async () => {
  try {
      await fetchEthUsdRate();
  } catch (error) {
      console.error("Error updating USDT/USD rate:", error);
  }
}, 60000);

setInterval(fetchEthUsdRate, 60000);