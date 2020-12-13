function loadBuildingCostTable(buildingcosts, goods){
    var cellBorderStyle = "solid thin #000000";
    var tableHeaderBorder = "solid #000000";

    var table = document.createElement("table");
    var header = document.createElement("thead");
    var header_row = document.createElement("tr");

    var cell = document.createElement("th");
    cell.scope = "col";
    cell.style.border = tableHeaderBorder;
    cell.innerText = "Buildings";
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
        let row = document.createElement("tr");
        let cell = document.createElement("td");
        cell.scope = "row";    
        cell.style.border = cellBorderStyle;
        cell.innerText = buildingcosts[i]["description"];
        row.append(cell);
        for (let j = 0; j < buildingcosts[i]["value"].length; j++){
            cell = document.createElement("td");
            cell.scope = "row";
            cell.style.border = cellBorderStyle;

            let input = document.createElement("input");
            input.placeholder = buildingcosts[i]["value"][j];
            input.value = buildingcosts[i]["value"][j];
            input.type = "number";
            input.min = 0;
            input.max = 4294967295;
            input.style.textAlign = "center";
            cell.appendChild(input);

            var button = document.createElement("button");
            button.classList.add("btn");
            button.classList.add("btn-info");
            button.classList.add("bcost");
            button.innerText = "Reset";
            button.style.marginLeft = "10px";
            button.addEventListener("click", function(e){
                input.value = input.placeholder;
            });
            cell.append(button);
            row.append(cell);
        }
        body.append(row);
    }
    table.append(body);
    return table;
}

$("#buildingcostcontrols").html(loadFilter());
function loadFilter(){
    var container = document.createElement("div");
    container.style.paddingTop = "20px";
    

    var input = document.createElement("input");
    input.placeholder = "Search";
    input.classList.add("form-control");
    input.id = "buildingcostfilter";
    input.type = "text";
    input.style.display = "inline-block";
    input.style.width = "150px";
    container.append(input);

    var button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-info");
    button.style.display = "inline-block";
    button.innerText = "Clear filter";
    button.id = "buildingcostfilterclear";
    container.append(button);

    var button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-warning");
    button.style.display = "inline-block";
    button.innerText = "Reset all";
    button.style.marginLeft = "20px";
    button.addEventListener("click", function(e){
        document.querySelectorAll(".btn").forEach(btn => {
            if (btn != this && btn.classList.contains("bcost")){
                btn.click();
            }
        })
    });
    container.append(button);
    return container;
}

$("#buildingcostfilter").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#buildingcosttable tbody tr").filter(function() {
        $(this).toggle($(this).text().replace(new RegExp("Reset", 'g'), "").toLowerCase().indexOf(value) > -1)
    });
});

$("#buildingcostfilterclear").on("click", function() {
    $("#buildingcostfilter").val("");
    $("#buildingcosttable tbody tr").filter(function() {
        $(this).show();
    });
});