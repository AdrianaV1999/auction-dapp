// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Auction {
    address payable public beneficiary; // Adresa primaoca
    uint public auctionEndTime; // Vreme trajanja u sekundama
    string private secretMessage; 

    address public highestBidder; 
    uint public highestBid;

    mapping(address => uint) pendingReturns;
    bool ended;

    struct Bid {
    address bidder;
    uint amount;
    uint timestamp;
    }

    Bid[] public bidHistory;
    mapping(address => Bid[]) public bidsByAddress;

    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    error AuctionAlreadyEnded();
    error BidNotHighEnough(uint highestBid);
    error AuctionNotYetEnded();
    error AuctionEndAlreadyCalled();

    constructor(
        uint biddingTime,
        address payable beneficiaryAddress,
        string memory secret
    ) payable {
        beneficiary = beneficiaryAddress;
        auctionEndTime = block.timestamp + biddingTime;
        secretMessage = secret;
    }

    function bid() external payable {
        if (ended)
            revert AuctionAlreadyEnded();

        if (msg.value <= highestBid)
            revert BidNotHighEnough(highestBid);

        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
        }

        highestBidder = msg.sender;
        highestBid = msg.value;

    Bid memory newBid = Bid({
            bidder: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        });

        bidHistory.push(newBid);
        bidsByAddress[msg.sender].push(newBid);
       

        emit HighestBidIncreased(msg.sender, msg.value);
    }

    function withdraw() external returns (bool) {
        uint amount = pendingReturns[msg.sender];
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;

            if (!payable(msg.sender).send(amount)) {
                pendingReturns[msg.sender] = amount;
                return false;
            }
        }
        return true;
    }

    function auctionEnd() external {
        if (block.timestamp < auctionEndTime)
            revert AuctionNotYetEnded();
        if (ended)
            revert AuctionEndAlreadyCalled();

        ended = true;
        emit AuctionEnded(highestBidder, highestBid);

        beneficiary.transfer(highestBid);
    }

    function getSecretMessage() external view returns (string memory) {
        require(ended, "The auction has not ended yet.");
        require(msg.sender == highestBidder, "Only the auction winner can access the secret code.");
        return secretMessage;
    }
    function getBidsByAddress(address user) public view returns (Bid[] memory) {
        return bidsByAddress[user];
    }

    
}