pragma solidity ^0.4.23;

contract COMP3335{
    struct File {
        address owner;
        bytes32 hash;
        mapping(address => boolean) sharing;
    }
    
    mapping(address => File);
}