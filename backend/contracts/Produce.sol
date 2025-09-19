// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// This is a simple smart contract to track the lifecycle of agricultural produce.
// It's designed for speed and simplicity for the hackathon.
contract ProduceTracker {

    // A struct to hold the details of each batch of produce.
    struct Produce {
        uint id;
        string name;
        address owner;
        string[] history; // A log of all actions for this produce
    }

    // A mapping from the produce ID to the Produce struct.
    mapping(uint => Produce) public produceItems;
    uint public produceCount; // A counter to ensure unique IDs

    // Event to be emitted when a new produce is registered.
    event ProduceRegistered(
        uint id,
        string name,
        address owner
    );

    // Event to be emitted when ownership is transferred.
    event OwnershipTransferred(
        uint id,
        address from,
        address to
    );

    /**
     * @dev Registers a new batch of produce.
     * @param _name The name of the produce (e.g., "Organic Potatoes").
     */
    function registerProduce(string memory _name) public {
        produceCount++;
        address initialOwner = msg.sender;
        string memory initialHistory = string(abi.encodePacked("Registered by Farmer at address ", addressToString(initialOwner)));

        produceItems[produceCount] = Produce(produceCount, _name, initialOwner, new string[](0));
        produceItems[produceCount].history.push(initialHistory);

        emit ProduceRegistered(produceCount, _name, initialOwner);
    }

    /**
     * @dev Transfers ownership of a produce batch.
     * @param _id The ID of the produce to transfer.
     * @param _newOwner The address of the new owner (e.g., Distributor).
     */
    function transferOwnership(uint _id, address _newOwner) public {
        require(_id > 0 && _id <= produceCount, "Produce batch does not exist.");
        require(produceItems[_id].owner == msg.sender, "You are not the owner of this batch.");

        address oldOwner = produceItems[_id].owner;
        produceItems[_id].owner = _newOwner;

        string memory transferHistory = string(abi.encodePacked("Transferred to new owner at address ", addressToString(_newOwner)));
        produceItems[_id].history.push(transferHistory);

        emit OwnershipTransferred(_id, oldOwner, _newOwner);
    }

    /**
     * @dev Retrieves the full history of a produce batch.
     * @param _id The ID of the produce.
     * @return A string array containing the history log.
     */
    function getProduceHistory(uint _id) public view returns (string[] memory) {
        require(_id > 0 && _id <= produceCount, "Produce batch does not exist.");
        return produceItems[_id].history;
    }
    
    /**
     * @dev Helper function to convert an address to a string.
     * Solidity doesn't have a native way to do this.
     */
    function addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint(uint8(value[i + 12] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(value[i + 12] & 0x0f))];
        }
        return string(str);
    }
}
