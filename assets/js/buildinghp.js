function loadHpTable(buildinghps){
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


    var cell = document.createElement("th");
    cell.scope = "col";
    cell.style.border = tableHeaderBorder;
    cell.innerText = "Health";
    header_row.appendChild(cell);

    var cell = document.createElement("th");
    cell.scope = "col";
    cell.style.border = tableHeaderBorder;
    cell.innerText = "Original Health";
    header_row.appendChild(cell);
    header.appendChild(header_row);
    table.appendChild(header);

    var body = document.createElement("tbody");
    for (let i = 0; i < buildinghps.length; i++){
        let row = document.createElement("tr");
        let cell = document.createElement("td");
        cell.scope = "row";    
        cell.style.border = cellBorderStyle;
        cell.innerText = buildinghps[i]["description"];
        row.append(cell);

        /* Building hp input */
        cell = document.createElement("td");
        cell.scope = "row";
        cell.style.border = cellBorderStyle;

        let input = document.createElement("input");
        input.placeholder = buildinghps[i]["value"];
        input.value = buildinghps[i]["value"];
        input.type = "number";
        input.min = 0;
        input.max = 4294967295;
        input.style.textAlign = "center";
        cell.append(input);

        var button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-info");
        button.innerText = "Reset";
        button.classList.add("bhp");
        button.style.marginLeft = "10px";
        button.addEventListener("click", function(e){
            input.value = input.placeholder;
        });
        cell.append(button);
        row.append(cell);

        /* Building hp original value */
        cell = document.createElement("td");
        cell.scope = "row";
        cell.style.border = cellBorderStyle;
        cell.style.verticalAlign = "middle";

        let original = document.createElement("div");
        original.placeholder = buildinghps[i]["value"];
        original.innerText = buildinghps[i]["value"];
        original.style.textAlign = "center";
        cell.append(original);
        row.append(cell);


        body.append(row);
    }
    table.append(body);
    return table;
}

$("#buildinghpcontrols").html(loadFilter());
function loadFilter(){
    var container = document.createElement("div");
    container.style.paddingTop = "20px";
    

    var input = document.createElement("input");
    input.placeholder = "Search";
    input.classList.add("form-control");
    input.id = "buildinghpfilter";
    input.type = "text";
    input.style.display = "inline-block";
    input.style.width = "150px";
    container.append(input);

    var button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-info");
    button.style.display = "inline-block";
    button.innerText = "Clear filter";
    button.id = "buildinghpfilterclear";
    container.append(button);

    var button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-warning");
    button.style.display = "inline-block";
    button.innerText = "Reset all";
    button.style.marginLeft = "20px";
    button.addEventListener("click", function(e){
        document.querySelectorAll(".btn").forEach(btn => {
            if (btn != this && btn.classList.contains("bhp")){
                btn.click();
            }
        })
    });
    container.append(button);
    return container;
}

$("#buildinghpfilter").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#buildinghptable tbody tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

$("#buildinghpfilterclear").on("click", function() {
    $("#buildinghpfilter").val("");
    $("#buildinghptable tbody tr").filter(function() {
        $(this).show();
    });
});