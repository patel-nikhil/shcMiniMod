resources = [
    {
        "description": "Wood",
        "Buy": 20,
        "Sell": 5
    },
    {
        "description": "Hop",
        "Buy": 75,
        "Sell": 40
    },
    {
        "description": "Stone",
        "Buy": 70,
        "Sell": 35
    },
    {
        "description": "Blank1",
        "Buy": 0,
        "Sell": 0
    },
    {
        "description": "Iron",
        "Buy": 225,
        "Sell": 115
    },
    {
        "description": "Pitch",
        "Buy": 100,
        "Sell": 50
    },
    {
        "description": "Blank2",
        "Buy": 0,
        "Sell": 0
    },
    {
        "description": "Wheat",
        "Buy": 115,
        "Sell": 40
    },
    {
        "description": "Bread",
        "Buy": 40,
        "Sell": 20
    },
    {
        "description": "Cheese",
        "Buy": 40,
        "Sell": 20
    },
    {
        "description": "Meat",
        "Buy": 40,
        "Sell": 20
    },
    {
        "description": "Fruit",
        "Buy": 40,
        "Sell": 20
    },
    {
        "description": "Beer",
        "Buy": 100,
        "Sell": 50
    },
    {
        "description": "Blank3",
        "Buy": 0,
        "Sell": 0
    },
    {
        "description": "Flour",
        "Buy": 160,
        "Sell": 50
    },
    {
        "description": "Bow",
        "Buy": 155,
        "Sell": 75
    },
    {
        "description": "Xbow",
        "Buy": 290,
        "Sell": 150
    },
    {
        "description": "Spear",
        "Buy": 100,
        "Sell": 50
    },
    {
        "description": "Pike",
        "Buy": 180,
        "Sell": 90
    },
    {
        "description": "Mace",
        "Buy": 290,
        "Sell": 150
    },
    {
        "description": "Sword",
        "Buy": 290,
        "Sell": 150
    },
    {
        "description": "Leather",
        "Buy": 125,
        "Sell": 60
    },
    {
        "description": "Armor",
        "Buy": 290,
        "Sell": 150
    }
];

function loadResourceTable(){
    var cellBorderStyle = "solid thin #000000";
    var tableHeaderBorder = "solid #000000";

    var table = document.createElement("table");
    var header = document.createElement("thead");
    var header_row = document.createElement("tr");

    var cell = document.createElement("th");
    cell.scope = "col";
    cell.style.border = tableHeaderBorder;
    cell.innerText = "Resources";
    cell.style.verticalAlign = "bottom";
    header_row.appendChild(cell);


    var cell = document.createElement("th");
    cell.scope = "col";
    cell.style.border = tableHeaderBorder;
    cell.innerText = "Buy";
    header_row.appendChild(cell);

    var cell = document.createElement("th");
    cell.scope = "col";
    cell.style.border = tableHeaderBorder;
    cell.innerText = "Sell";
    header_row.appendChild(cell);

    header.appendChild(header_row);
    table.appendChild(header);

    var body = document.createElement("tbody");
    for (let i = 0; i < resources.length; i++){
        let row = document.createElement("tr");
        let cell = document.createElement("td");
        cell.scope = "row";    
        cell.style.border = cellBorderStyle;
        cell.innerText = resources[i]["description"];
        row.append(cell);
        

        /* resource buy input */
        cell = document.createElement("td");
        cell.scope = "row";
        cell.style.border = cellBorderStyle;

        let resourceBuy = document.createElement("input");
        resourceBuy.placeholder = resources[i]["Buy"];
        resourceBuy.value = resources[i]["Buy"];
        resourceBuy.type = "number";
        resourceBuy.min = 0;
        resourceBuy.max = 4294967295;
        resourceBuy.style.textAlign = "center";
        cell.append(resourceBuy);

        var button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-info");
        button.innerText = "Reset";
        button.classList.add("resource");
        button.style.marginLeft = "10px";
        button.addEventListener("click", function(e){
            resourceBuy.value = resourceBuy.placeholder;
        });
        cell.append(button);
        row.append(cell);


        /* resource sell input */
        cell = document.createElement("td");
        cell.scope = "row";
        cell.style.border = cellBorderStyle;

        let resourceSell = document.createElement("input");
        resourceSell.placeholder = resources[i]["Sell"];
        resourceSell.value = resources[i]["Sell"];
        resourceSell.type = "number";
        resourceSell.min = 0;
        resourceSell.max = 4294967295;
        resourceSell.style.textAlign = "center";
        cell.append(resourceSell);

        var button = document.createElement("button");
        button.classList.add("btn");
        button.classList.add("btn-info");
        button.innerText = "Reset";
        button.classList.add("resource");
        button.style.marginLeft = "10px";
        button.addEventListener("click", function(e){
            resourceBuy.value = resourceBuy.placeholder;
        });
        cell.append(button);
        row.append(cell);

        body.append(row);
    }
    table.append(body);
    return table;
}

$("#resourcecontrols").html(loadFilter());
function loadFilter(){
    var container = document.createElement("div");
    container.style.paddingTop = "20px";
    

    var input = document.createElement("input");
    input.placeholder = "Search";
    input.classList.add("form-control");
    input.id = "resourcefilter";
    input.type = "text";
    input.style.display = "inline-block";
    input.style.width = "150px";
    container.append(input);

    var button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-info");
    button.style.display = "inline-block";
    button.innerText = "Clear filter";
    button.id = "resourcefilterclear";
    container.append(button);

    var button = document.createElement("button");
    button.classList.add("btn");
    button.classList.add("btn-warning");
    button.style.display = "inline-block";
    button.innerText = "Reset all";
    button.style.marginLeft = "20px";
    button.addEventListener("click", function(e){
        document.querySelectorAll(".btn").forEach(btn => {
            if (btn != this && btn.classList.contains("resource")){
                btn.click();
            }
        })
    });
    container.append(button);
    return container;
}

$("#resourcefilter").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#resourcetable tbody tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

$("#resourcefilterclear").on("click", function() {
    $("#resourcefilter").val("");
    $("#resourcetable tbody tr").filter(function() {
        $(this).show();
    });
});