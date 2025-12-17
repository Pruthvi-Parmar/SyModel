// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ModelRegistry
/// @notice Stores AI model metadata on Polygon after the model file is uploaded to Walrus.
contract ModelRegistry {
    struct Model {
        address uploader;
        uint256 uploadedAt;
        string blobId;
        string objectId;
        string name;
        string description;
        string modelType;
        string tagsCsv;
        string framework;
        string pricingMode;
        uint256 pricePerHour;
    }

    Model[] private _models;
    // keccak256(blobId) => modelIndex + 1
    mapping(bytes32 => uint256) private _indexPlusOneByBlobId;

    event ModelRegistered(
        uint256 indexed modelIndex,
        address indexed uploader,
        string blobId,
        string objectId,
        string name
    );

    function totalModels() external view returns (uint256) {
        return _models.length;
    }

    function modelExists(string calldata blobId) external view returns (bool) {
        return _indexPlusOneByBlobId[_blobKey(blobId)] != 0;
    }

    function getAllModels() external view returns (Model[] memory) {
        return _models;
    }

    function getModelByBlobId(string calldata blobId) external view returns (Model memory) {
        uint256 idxPlusOne = _indexPlusOneByBlobId[_blobKey(blobId)];
        require(idxPlusOne != 0, "MODEL_NOT_FOUND");
        return _models[idxPlusOne - 1];
    }

    function registerModel(
        string calldata blobId,
        string calldata objectId,
        string calldata name,
        string calldata description,
        string calldata modelType,
        string calldata tagsCsv,
        string calldata framework,
        string calldata pricingMode,
        uint256 pricePerHour
    ) external returns (uint256 modelIndex) {
        require(bytes(blobId).length != 0, "BLOB_ID_REQUIRED");
        require(bytes(name).length != 0, "NAME_REQUIRED");

        bytes32 key = _blobKey(blobId);
        require(_indexPlusOneByBlobId[key] == 0, "MODEL_ALREADY_EXISTS");

        _models.push(
            Model({
                uploader: msg.sender,
                uploadedAt: block.timestamp,
                blobId: blobId,
                objectId: objectId,
                name: name,
                description: description,
                modelType: modelType,
                tagsCsv: tagsCsv,
                framework: framework,
                pricingMode: pricingMode,
                pricePerHour: pricePerHour
            })
        );

        modelIndex = _models.length - 1;
        _indexPlusOneByBlobId[key] = modelIndex + 1;

        emit ModelRegistered(modelIndex, msg.sender, blobId, objectId, name);
    }

    function _blobKey(string calldata blobId) private pure returns (bytes32) {
        return keccak256(bytes(blobId));
    }
}


