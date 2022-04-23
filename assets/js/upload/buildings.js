export function loadBuildings(uploadConfig) {
    var uploadBuildings = uploadConfig["buildings"];
    if (uploadBuildings) {
        Object.keys(uploadBuildings).forEach(function(buildingName){
            const buildingIndex = getBuildingIndex(buildingName);
            if (buildingIndex === -1) {
                const errMsg = "Invalid config, unrecognized building specified: " + buildingName;
                alert(errMsg);
                throw Error(errMsg);
            }
            const currentBuildingConfig = uploadBuildings[buildingName];
            if (currentBuildingConfig["health"] !== undefined) {
                const currentBuildingHealth = getBuildingHealthElement(buildingIndex);
                const health = parseInt(currentBuildingConfig["health"]);
                
                if (health === NaN){
                    const errMsg = "Invalid building health for " + buildingName + " . Expected a number";
                    alert(errMsg);
                    throw Error(errMsg);
                }
                currentBuildingHealth.value = health;
            }

            if (currentBuildingConfig["cost"] !== undefined) {
                const currentBuildingCost = currentBuildingConfig["cost"];
                if (currentBuildingCost.length != 5) {
                    const errMsg = "Invalid building cost for " + buildingName + " . Expected array of 5 numbers";
                    alert(errMsg);
                    throw Error(errMsg);
                }
                applyBuildingCostToElement(buildingIndex, 0, 'wood', currentBuildingCost);
                applyBuildingCostToElement(buildingIndex, 1, 'stone', currentBuildingCost);
                applyBuildingCostToElement(buildingIndex, 2, 'iron', currentBuildingCost);
                applyBuildingCostToElement(buildingIndex, 3, 'pitch', currentBuildingCost);
                applyBuildingCostToElement(buildingIndex, 4, 'gold', currentBuildingCost);
            }
        });
    }
}


function applyBuildingCostToElement(buildingIndex, costIndex, costName, currentBuildingCost) {
    const costElement = $(`#buildingtable td:nth-child(${costIndex+3}) input`)[buildingIndex]
    const cost = parseInt(currentBuildingCost[costIndex]);
    if (cost === NaN) {
        const errMsg = `Invalid ${costName} cost for " + buildingName + " . Expected a number`;
        alert(errMsg);
        throw Error(errMsg);
    }
    costElement.value = cost;
}

function getBuildingHealthElement(buildingIndex) {
    return $("#buildingtable td:nth-child(2) input")[buildingIndex]
}

function getBuildingIndex(buildingName) {
    return Array.prototype.findIndex.call($("#buildingtable td:first-child"), x => x.textContent === buildingName)
}