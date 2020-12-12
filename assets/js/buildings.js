buildingValues = {}

function loadBuildingTable(buildingcosts, goods){
    var cellBorderStyle = "solid thin #000000";
    var tableHeaderBorder = "solid #000000";

    var table = document.createElement("table");
    var header = document.createElement("thead");
    var header_row = document.createElement("tr");

    var cell = document.createElement("th");
    cell.scope = "col";
    cell.style.border = tableHeaderBorder;
    cell.innerText = "Building";
    cell.style.verticalAlign = "bottom";
    header_row.appendChild(cell);

    cell = document.createElement("th");
    cell.scope = "col";
    cell.style.border = tableHeaderBorder;
    cell.innerText = "Health";
    cell.style.verticalAlign = "bottom";
    header_row.appendChild(cell);


    for (var i = 0; i < goods.length; i++){
        var cell = document.createElement("th");
        cell.scope = "col";
        cell.style.border = tableHeaderBorder;
        cell.innerText = goods[i];
        header_row.appendChild(cell);
    }
    header.appendChild(header_row);
    table.appendChild(header);

    var body = document.createElement("tbody");
    for (let i = 0; i < buildingcosts.length; i++){
        let buildingName = buildingcosts[i]["description"];

        let row = document.createElement("tr");
        let cell = document.createElement("td");
        cell.scope = "row";    
        cell.style.border = cellBorderStyle;
        cell.innerText = buildingName;
        row.append(cell);

        /* Add building health cell */
        cell = document.createElement("td");
        cell.scope = "row";
        cell.style.border = cellBorderStyle;

        let input = document.createElement("input");
        input.placeholder = buildingcosts[i]["health"]
        input.value = buildingcosts[i]["health"];
        input.type = "number";
        input.min = 0;
        input.max = 4294967295;
        input.style.textAlign = "center";
        cell.appendChild(input);

        var button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-info");
        button.classList.add("building");
        button.innerText = "Reset";
        button.style.marginLeft = "10px";
        button.addEventListener("click", function(e){
            input.value = input.placeholder;
        });
        cell.append(button);
        row.append(cell);

        /* Define building value retriever */
        buildingValues[buildingName] = {};
        buildingValues[buildingName]["originalHealth"] = () => input.placeholder;
        buildingValues[buildingName]["health"] = () => input.value;
        buildingValues[buildingName]["originalCost"] = [];
        buildingValues[buildingName]["cost"] = [];

        /* Add building cost cells */
        for (let j = 0; j < buildingcosts[i]["cost"].length; j++){
            cell = document.createElement("td");
            cell.scope = "row";
            cell.style.border = cellBorderStyle;

            let input = document.createElement("input");
            input.placeholder = buildingcosts[i]["cost"][j];
            input.value = buildingcosts[i]["cost"][j];
            input.type = "number";
            input.min = 0;
            input.max = 4294967295;
            input.style.textAlign = "center";
            cell.appendChild(input);

            var button = document.createElement("button");
            button.classList.add("btn");
            button.classList.add("btn-info");
            button.classList.add("building");
            button.innerText = "Reset";
            button.style.marginLeft = "10px";
            button.addEventListener("click", function(e){
                input.value = input.placeholder;
            });
            cell.append(button);
            row.append(cell);

            buildingValues[buildingName]["originalCost"].push(() => input.placeholder);
            buildingValues[buildingName]["cost"].push(() => input.value);
        }
        body.append(row);
        buildingValues[buildingName]["isChanged"] = () => {
            return !(arrayFunctionEqual(buildingValues[buildingName]["originalCost"], buildingValues[buildingName]["cost"]) &&
            buildingValues[buildingName]["originalHealth"]() == buildingValues[buildingName]["health"]());
        };
    }
    table.append(body);
    return table;
}

$("#buildingcontrols").html(loadFilter());
function loadFilter(){
    var container = document.createElement("div");
    container.style.paddingTop = "20px";
    

    var input = document.createElement("input");
    input.placeholder = "Search";
    input.classList.add("form-control");
    input.id = "buildingfilter";
    input.type = "text";
    input.style.display = "inline-block";
    input.style.width = "150px";
    container.append(input);

    var button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-info");
    button.style.display = "inline-block";
    button.innerText = "Clear filter";
    button.id = "buildingfilterclear";
    container.append(button);

    var button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-warning");
    button.style.display = "inline-block";
    button.innerText = "Reset all";
    button.style.marginLeft = "20px";
    button.addEventListener("click", function(e){
        document.querySelectorAll(".btn").forEach(btn => {
            if (btn != this && btn.classList.contains("building")){
                btn.click();
            }
        })
    });
    container.append(button);
    return container;
}

$("#buildingfilter").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#buildingtable tbody tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

$("#buildingfilterclear").on("click", function() {
    $("#buildingfilter").val("");
    $("#buildingtable tbody tr").filter(function() {
        $(this).show();
    });
});