# Auction dApp

This decentralized application (dApp) enables users to create and participate in blockchain-based auctions. It is built with **React** for the frontend and **Solidity** for smart contract logic. **MetaMask** is used to connect users to the Ethereum blockchain and **Web3.js** handles the interaction between the app and the smart contracts. To use this application, the user must have a MetaMask account installed in their browser.

## Features

- Create auctions with:
  - Minimum duration
  - Recipient address for funds
  - Secret code (e.g., PDF link, QR or password) revealed only to the winner
- Place bids if:
  - The auction is still active
  - The bid is higher than the current highest
- Bids are locked as long as they are the highest
- Withdraw funds if outbid
- End auction (only the creator can do this after the set duration)
- Reveal the secret code to the winning bidder
- Check:
  - Auction end time
  - Recipient address
  - Highest bid and bidder address
- View personal bid history (auctions you participated in, your bid amounts and timestamps)

## Technologies and Tools Used

- **React.js** — Frontend interface for building UI components  
- **Solidity** — Programming language for writing smart contracts on Ethereum  
- **Web3.js** — JavaScript library for interacting with the Ethereum blockchain  
- **MetaMask** — Wallet used to manage Ethereum accounts and sign blockchain transactions

## Components

- **Main** — The landing page of the application
- **AuctionDetailsModal** — Displays auction details
- **AuctionList** — Shows a list of available auctions
- **CreateAuctionModal** — Form for creating new auctions
- **BidHistory** — Shows the connected user's bids across all auctions
- **BidHistoryPage** — Dedicated page showing the user’s bidding history

## Smart Contracts

- **Auction.sol** — Handles bidding logic, bid history, winner payout and secret code delivery. Includes support for bid withdrawals and accessing bids by user
- **AuctionFactory.sol** — Deploys new auctions and stores references to all created auctions
- **Auction.json / AuctionFactory.json** — ABI files used by Web3.js to connect the frontend with the smart contracts

## Installation / How to Run

To run this project locally:

1. Clone the repository:
   
   #### `git clone https://github.com/AdrianaV1999/auction-dapp.git`

2. Navigate into the project folder:

   #### `cd auction-dapp`

3. Install dependencies:
   
   #### `npm install`

4. Start the development server:
   
   #### `npm start`

This app is configured to run on the **Sepolia** test network. Make sure to switch MetaMask to the correct network.

---

This project shows applied work with Web3 integration, smart contract deployment and building a decentralized app using frontend technologies.
