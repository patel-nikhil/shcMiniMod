export function loadUnitBase(uploadConfig) {
    var uploadUnits = uploadConfig["units"];
    if (uploadUnits) {
        Object.keys(uploadUnits).forEach(function(unitName){
            const unitIndex = getUnitIndex(unitName);
            if (unitIndex === -1) {
                const errMsg = "Invalid config, unrecognized unit specified: " + unitName;
                alert(errMsg);
                throw Error(errMsg);
            }
            const currentUnitConfig = uploadUnits[unitName];
            if (currentUnitConfig["health"] !== undefined) {
                const currentUnitHealth = getUnitHealthElement(unitIndex);
                const health = parseInt(currentUnitConfig["health"]);
                
                if (health === NaN){
                    const errMsg = "Invalid unit health for " + unitName + " . Expected a number";
                    alert(errMsg);
                    throw Error(errMsg);
                }
                currentUnitHealth.value = health;
            }


            if (currentUnitConfig["arrowDamage"] !== undefined) {
                const currentUnitArrow = getUnitArrowElement(unitIndex);
                const arrow = parseInt(currentUnitConfig["arrowDamage"]);
                
                if (arrow === NaN){
                    const errMsg = "Invalid unit arrowDamage for " + unitName + " . Expected a number";
                    alert(errMsg);
                    throw Error(errMsg);
                }
                currentUnitArrow.value = arrow;
            }

            if (currentUnitConfig["xbowDamage"] !== undefined) {
                const currentUnitXbow = getUnitXbowElement(unitIndex);
                const xbow = parseInt(currentUnitConfig["xbowDamage"]);
                
                if (xbow === NaN){
                    const errMsg = "Invalid unit xbowDamage for " + unitName + " . Expected a number";
                    alert(errMsg);
                    throw Error(errMsg);
                }
                currentUnitXbow.value = xbow;
            }

            if (currentUnitConfig["stoneDamage"] !== undefined) {
                const currentUnitStone = getUnitStoneElement(unitIndex);
                const stone = parseInt(currentUnitConfig["stoneDamage"]);
                
                if (stone === NaN){
                    const errMsg = "Invalid unit stoneDamage for " + unitName + " . Expected a number";
                    alert(errMsg);
                    throw Error(errMsg);
                }
                currentUnitStone.value = stone;
            }
        });
    }
}


function getUnitHealthElement(unitIndex) {
    return $("#unitbasetable td:nth-child(2) input")[unitIndex]
}

function getUnitArrowElement(unitIndex) {
    return $("#unitbasetable td:nth-child(3) input")[unitIndex]
}

function getUnitXbowElement(unitIndex) {
    return $("#unitbasetable td:nth-child(4) input")[unitIndex]
}

function getUnitStoneElement(unitIndex) {
    return $("#unitbasetable td:nth-child(5) input")[unitIndex]
}

function getUnitIndex(unitName) {
    return Array.prototype.findIndex.call($("#unitbasetable td:first-child"), x => x.textContent === unitName)
}