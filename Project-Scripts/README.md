## Blockchain - Based Real Estate Management System

TokenLand is a real estate marketplace that uses blockchain technology and Non-Fungible Tokens (NFTs) to perform property transactions. 

Local Hardhat network is used for performing blockchain interactions.

# Run the below commands

```shell
npx hardhat clean
npx hardhat compile
npx hardhat node (in a separate terminal)
npx hardhat run scripts/deploy.js --network localhost
```

# MetaMask initialization

Install MetaMAsk and add Hardhat network below are the hardhat network configuration details,

[Network] -- Hardhat
[RPC-URL] -- http://127.0.0.1:8545/
[Chain-Id] -- 1337
[Currency-symbol] -- USDT

# Enable local server

Run python server in a new terminal to access the project files in the browser.

```shell
python -m http.server
```

Access the project in browser with the URL, http://localhost:8000/
