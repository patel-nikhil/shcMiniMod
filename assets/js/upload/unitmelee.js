export function loadUnitMelee(uploadConfig) {
    var uploadUnits = uploadConfig["units"];
    if (uploadUnits) {
        Object.keys(uploadUnits).forEach(function(attackerName){
            const attackerIndex = getUnitIndex(attackerName);
            if (attackerIndex === -1) {
                const errMsg = "Invalid config, unrecognized attacking unit specified: " + attackerName;
                alert(errMsg);
                throw Error(errMsg);
            }

            const unitMeleeConfig = uploadUnits[attackerName]["meleeDamageVs"];
            if (unitMeleeConfig) {
                Object.keys(unitMeleeConfig).forEach(function(defenderName){
                    const defenderIndex = getUnitIndex(defenderName);
                    if (defenderIndex === -1) {
                        const errMsg = "Invalid config, unrecognized attacking unit specified: " + defenderName;
                        alert(errMsg);
                        throw Error(errMsg);
                    }

                    const damageValue = parseInt(unitMeleeConfig[defenderName]);
                    if (damageValue === NaN){
                        const errMsg = "Invalid unit melee for attacker " + attackerName + " and defender " + defenderName + ". Expected a number";
                        alert(errMsg);
                        throw Error(errMsg);
                    }

                    const currentUnitMeleeElement = getUnitMeleeElement(attackerIndex, defenderIndex);
                    currentUnitMeleeElement.value = damageValue;
                });  
            }          
        });
    }
}


function getUnitMeleeElement(attackerIndex, defenderIndex) {
    return $(`#unitmeleetable tr:nth-child(${attackerIndex + 1}) input`)[defenderIndex];
}

function getUnitIndex(unitName) {
    return Array.prototype.findIndex.call($("#unitmeleetable td:first-child"), x => x.textContent === unitName);
}