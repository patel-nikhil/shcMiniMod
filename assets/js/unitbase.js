unitBaseValues = {}

function loadUnitBaseTable(unitBaseStats){
    var cellBorderStyle = "solid thin #000000";
    var tableHeaderBorder = "solid #000000";

    var table = document.createElement("table");
    var header = document.createElement("thead");
    var header_row = document.createElement("tr");

    var cell = document.createElement("th");
    cell.scope = "col";
    cell.style.border = tableHeaderBorder;
    cell.innerText = "Unit";
    cell.style.verticalAlign = "bottom";
    header_row.appendChild(cell);


    var cell = document.createElement("th");
    cell.scope = "col";
    cell.style.border = tableHeaderBorder;
    cell.innerText = "Health";
    header_row.appendChild(cell);

    var cell = document.createElement("th");
    cell.scope = "col";
    cell.style.border = tableHeaderBorder;
    cell.innerText = "Arrow Damage";
    header_row.appendChild(cell);

    var cell = document.createElement("th");
    cell.scope = "col";
    cell.style.border = tableHeaderBorder;
    cell.innerText = "Xbow Damage";
    header_row.appendChild(cell);

    var cell = document.createElement("th");
    cell.scope = "col";
    cell.style.border = tableHeaderBorder;
    cell.innerText = "Stone Damage";
    header_row.appendChild(cell);


    header.appendChild(header_row);
    table.appendChild(header);

    var body = document.createElement("tbody");
    for (let i = 0; i < unitBaseStats.length; i++){
        let unitName = unitBaseStats[i]["description"];

        let row = document.createElement("tr");
        let cell = document.createElement("td");
        cell.scope = "row";    
        cell.style.border = cellBorderStyle;
        cell.innerText = unitName;
        row.append(cell);

        /* unit hp input */
        cell = document.createElement("td");
        cell.scope = "row";
        cell.style.border = cellBorderStyle;

        let inputHealth = document.createElement("input");
        inputHealth.placeholder = unitBaseStats[i]["health"];
        inputHealth.value = unitBaseStats[i]["health"];
        inputHealth.type = "number";
        inputHealth.min = 0;
        inputHealth.max = 4294967295;
        inputHealth.style.textAlign = "center";
        cell.append(inputHealth);

        var button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-info");
        button.innerText = "Reset";
        button.classList.add("unitbase");
        button.style.marginLeft = "10px";
        button.addEventListener("click", function(e){
            inputHealth.value = inputHealth.placeholder;
        });
        cell.append(button);
        row.append(cell);


        /* unit arrow damage input */
        cell = document.createElement("td");
        cell.scope = "row";
        cell.style.border = cellBorderStyle;

        let inputArrow = document.createElement("input");
        inputArrow.placeholder = unitBaseStats[i]["arrow_damage"];
        inputArrow.value = unitBaseStats[i]["arrow_damage"];
        inputArrow.type = "number";
        inputArrow.min = 0;
        inputArrow.max = 4294967295;
        inputArrow.style.textAlign = "center";
        cell.append(inputArrow);

        var button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-info");
        button.innerText = "Reset";
        button.classList.add("unitbase");
        button.style.marginLeft = "10px";
        button.addEventListener("click", function(e){
            inputArrow.value = inputArrow.placeholder;
        });
        cell.append(button);
        row.append(cell);


        /* unit xbow damage input */
        cell = document.createElement("td");
        cell.scope = "row";
        cell.style.border = cellBorderStyle;

        let inputXbow = document.createElement("input");
        inputXbow.placeholder = unitBaseStats[i]["xbow_damage"];
        inputXbow.value = unitBaseStats[i]["xbow_damage"];
        inputXbow.type = "number";
        inputXbow.min = 0;
        inputXbow.max = 4294967295;
        inputXbow.style.textAlign = "center";
        cell.append(inputXbow);

        var button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-info");
        button.innerText = "Reset";
        button.classList.add("unitbase");
        button.style.marginLeft = "10px";
        button.addEventListener("click", function(e){
            inputXbow.value = inputXbow.placeholder;
        });
        cell.append(button);
        row.append(cell);


        /* unit arrow damage input */
        cell = document.createElement("td");
        cell.scope = "row";
        cell.style.border = cellBorderStyle;

        let inputStone = document.createElement("input");
        inputStone.placeholder = unitBaseStats[i]["stone_damage"];
        inputStone.value = unitBaseStats[i]["stone_damage"];
        inputStone.type = "number";
        inputStone.min = 0;
        inputStone.max = 4294967295;
        inputStone.style.textAlign = "center";
        cell.append(inputStone);

        var button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-info");
        button.innerText = "Reset";
        button.classList.add("unitbase");
        button.style.marginLeft = "10px";
        button.addEventListener("click", function(e){
            inputStone.value = inputStone.placeholder;
        });
        cell.append(button);
        row.append(cell);


        /* Define unit value retriever */
        unitBaseValues[unitName] = {};
        unitBaseValues[unitName]["originalHealth"] = () => inputHealth.placeholder;
        unitBaseValues[unitName]["health"] = () => inputHealth.value;
        unitBaseValues[unitName]["originalArrowDamage"] = () => inputArrow.placeholder;
        unitBaseValues[unitName]["arrowDamage"] = () => inputArrow.value;
        unitBaseValues[unitName]["originalXbowDamage"] = () => inputXbow.placeholder;
        unitBaseValues[unitName]["xbowDamage"] = () => inputXbow.value;
        unitBaseValues[unitName]["originalStoneDamage"] = () => inputStone.placeholder;
        unitBaseValues[unitName]["stoneDamage"] = () => inputStone.value;
        
        unitBaseValues[unitName]["value"] = () => {
            let value = {};
            if (unitBaseValues[unitName]["originalHealth"]() != unitBaseValues[unitName]["health"]()){
                value["health"] = unitBaseValues[unitName]["health"]();
            }
            if (unitBaseValues[unitName]["originalArrowDamage"]() != unitBaseValues[unitName]["arrowDamage"]()){
                value["arrowDamage"] = unitBaseValues[unitName]["arrowDamage"]();
            }
            if (unitBaseValues[unitName]["originalXbowDamage"]() != unitBaseValues[unitName]["xbowDamage"]()){
                value["xbowDamage"] = unitBaseValues[unitName]["xbowDamage"]();
            }
            if (unitBaseValues[unitName]["originalStoneDamage"]() != unitBaseValues[unitName]["stoneDamage"]()){
                value["stoneDamage"] = unitBaseValues[unitName]["stoneDamage"]();
            }
            return value;
        };
        body.append(row);
    }
    table.append(body);
    return table;
}

$("#unitbasecontrols").html(loadFilter());
function loadFilter(){
    var container = document.createElement("div");
    container.style.paddingTop = "20px";
    

    var input = document.createElement("input");
    input.placeholder = "Search";
    input.classList.add("form-control");
    input.id = "unitbasefilter";
    input.type = "text";
    input.style.display = "inline-block";
    input.style.width = "150px";
    container.append(input);

    var button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-info");
    button.style.display = "inline-block";
    button.innerText = "Clear filter";
    button.id = "unitbasefilterclear";
    container.append(button);

    var button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-warning");
    button.style.display = "inline-block";
    button.innerText = "Reset all";
    button.style.marginLeft = "20px";
    button.addEventListener("click", function(e){
        document.querySelectorAll(".btn").forEach(btn => {
            if (btn != this && btn.classList.contains("unitbase")){
                btn.click();
            }
        })
    });
    container.append(button);
    return container;
}

$("#unitbasefilter").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#unitbasetable tbody tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

$("#unitbasefilterclear").on("click", function() {
    $("#unitbasefilter").val("");
    $("#unitbasetable tbody tr").filter(function() {
        $(this).show();
    });
});