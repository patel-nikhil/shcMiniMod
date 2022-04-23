export function loadResources(uploadConfig) {
    var uploadResources = uploadConfig["resources"];
    if (uploadResources) {
        Object.keys(uploadResources).forEach(function(resourceName){
            const resourceIndex = getResourceIndex(resourceName);
            if (resourceIndex === -1) {
                const errMsg = "Invalid config, unrecognized resource specified: " + resourceName;
                alert(errMsg);
                throw Error(errMsg);
            }
            const currentResourceConfig = uploadResources[resourceName];
            if (currentResourceConfig["buy"] !== undefined) {
                const currentResourceBuy = getResourceBuyElement(resourceIndex);
                const buyCost = parseInt(currentResourceConfig["buy"]);
                
                if (buyCost === NaN){
                    const errMsg = "Invalid resource buy cost for " + resourceName + " . Expected a number";
                    alert(errMsg);
                    throw Error(errMsg);
                }
                currentResourceBuy.value = buyCost;
            }


            if (currentResourceConfig["sell"] !== undefined) {
                const currentResourceSell = getResourceSellElement(resourceIndex);
                const sellCost = parseInt(currentResourceConfig["sell"]);
                
                if (sellCost === NaN){
                    const errMsg = "Invalid resource sell cost for " + resourceName + " . Expected a number";
                    alert(errMsg);
                    throw Error(errMsg);
                }
                currentResourceSell.value = sellCost;
            }
        });
    }
}



function getResourceBuyElement(resourceIndex) {
    return $("#resourcetable td:nth-child(2) input")[resourceIndex]
}

function getResourceSellElement(resourceIndex) {
    return $("#resourcetable td:nth-child(3) input")[resourceIndex]
}

function getResourceIndex(resourceName) {
    return Array.prototype.findIndex.call($("#resourcetable td:first-child"), x => x.textContent === resourceName)
}