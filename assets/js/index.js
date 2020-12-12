window.onload = function(e){
    $("#buildingtable").html(loadBuildingTable());
    $("#unitbasetable").html(loadUnitBaseTable());
    $("#unitmeleetable").html(loadUnitMeleeTable());

    $("#global-reset").on("click", function(e){
        document.querySelectorAll(".btn").forEach(btn => {
            if (btn != this && (btn.classList.contains("building") || btn.classList.contains("unitbase") || btn.classList.contains("unitmelee"))){
                btn.click();
            }
        })
    });

    $("#btnCrusader").on("click", function(){
        $(this).toggleClass("btn-success");
        $("#btnExtreme").toggleClass("btn-success");
    });

    $("#btnExtreme").on("click", function(){
        $(this).toggleClass("btn-success");
        $("#btnCrusader").toggleClass("btn-success");
    });

    $("#download").on("click", function(){
        let buildingConfig = {};
        for (let i = 0; i < Object.keys(buildingValues).length; i++){
            let name = Object.keys(buildingValues)[i];
            let building = buildingValues[name];
            let value = building["value"]();
            if (!($.isEmptyObject(value))){
                buildingConfig[name] = value;
            }
        }

        let unitBaseConfig = {};
        for (let i = 0; i < Object.keys(unitBaseValues).length; i++){
            let name = Object.keys(unitBaseValues)[i];
            let unit = unitBaseValues[name];
            let value = unit["value"]();
            if (!($.isEmptyObject(value))){
                unitBaseConfig[name] = value;
            }
        }

        let unitMeleeConfig = {};
        for (let i = 0; i < Object.keys(unitMeleeValues).length; i++){
            let attackerName = Object.keys(unitBaseValues)[i];
            let currentConfig = {};

            for (let j = 0; j < Object.keys(unitMeleeValues[attackerName]).length; j++){
                let defenderName = Object.keys(unitMeleeValues[attackerName])[j];
                let value = unitMeleeValues[attackerName][defenderName]["value"]();
                if (!($.isEmptyObject(value))){
                    currentConfig[defenderName] = value;
                }
            }
            if (!($.isEmptyObject(currentConfig))){
                if (unitMeleeConfig == undefined){
                    unitMeleeConfig = {};
                }
                unitMeleeConfig[attackerName] = currentConfig;
            }
        }


        let downloadConfig = {}
        if (!($.isEmptyObject(buildingConfig))){
            downloadConfig["buildings"] = buildingConfig;
        }

        if (!($.isEmptyObject(unitBaseConfig))){
            downloadConfig["units"] = {};
            for (let i = 0; i < Object.keys(unitBaseConfig).length; i++){
                let name = Object.keys(unitBaseConfig)[i];
                downloadConfig["units"] = unitBaseConfig;
            }
            
        }

        if (!($.isEmptyObject(unitMeleeConfig))){
            for (let i = 0; i < Object.keys(unitMeleeConfig).length; i++){
                let attacker = Object.keys(unitMeleeConfig)[i];
                if (downloadConfig["units"][attacker] == undefined){
                    downloadConfig["units"][attacker] = {};
                }
                if (downloadConfig["units"][attacker]["damage"] == undefined){
                    downloadConfig["units"][attacker]["damage"] = {};
                }

                for (var defender in unitMeleeConfig[attacker]){
                    downloadConfig["units"][attacker]["damage"][defender] = unitMeleeConfig[attacker][defender]["damage"];
                }
            }
        }
        console.log(downloadConfig);
    });
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  function arrayFunctionEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
  
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
  
    for (var i = 0; i < a.length; ++i) {
      if (a[i]() !== b[i]()) return false;
    }
    return true;
  }