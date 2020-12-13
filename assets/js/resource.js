resources = [
    {
        "description": "Wood",
        "buy": 20,
        "sell": 5
    },
    {
        "description": "Hop",
        "buy": 75,
        "sell": 40
    },
    {
        "description": "Stone",
        "buy": 70,
        "sell": 35
    },
    {
        "description": "Blank1",
        "buy": 0,
        "sell": 0
    },
    {
        "description": "Iron",
        "buy": 225,
        "sell": 115
    },
    {
        "description": "Pitch",
        "buy": 100,
        "sell": 50
    },
    {
        "description": "Blank2",
        "buy": 0,
        "sell": 0
    },
    {
        "description": "Wheat",
        "buy": 115,
        "sell": 40
    },
    {
        "description": "Bread",
        "buy": 40,
        "sell": 20
    },
    {
        "description": "Cheese",
        "buy": 40,
        "sell": 20
    },
    {
        "description": "Meat",
        "buy": 40,
        "sell": 20
    },
    {
        "description": "Fruit",
        "buy": 40,
        "sell": 20
    },
    {
        "description": "Beer",
        "buy": 100,
        "sell": 50
    },
    {
        "description": "Blank3",
        "buy": 0,
        "sell": 0
    },
    {
        "description": "Flour",
        "buy": 160,
        "sell": 50
    },
    {
        "description": "Bow",
        "buy": 155,
        "sell": 75
    },
    {
        "description": "Xbow",
        "buy": 290,
        "sell": 150
    },
    {
        "description": "Spear",
        "buy": 100,
        "sell": 50
    },
    {
        "description": "Pike",
        "buy": 180,
        "sell": 90
    },
    {
        "description": "Mace",
        "buy": 290,
        "sell": 150
    },
    {
        "description": "Sword",
        "buy": 290,
        "sell": 150
    },
    {
        "description": "Leather",
        "buy": 125,
        "sell": 60
    },
    {
        "description": "Armor",
        "buy": 290,
        "sell": 150
    }
];

resourceValues = {}

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
        row.dataHook = resources[i]["description"];

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
        resourceBuy.placeholder = resources[i]["buy"];
        resourceBuy.value = resources[i]["buy"];
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
        resourceSell.placeholder = resources[i]["sell"];
        resourceSell.value = resources[i]["sell"];
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
            resourceSell.value = resourceSell.placeholder;
        });
        cell.append(button);
        row.append(cell);

        /* Define building value retriever */
        let resourceName = resources[i]["description"];
        resourceValues[resourceName] = {};
        resourceValues[resourceName]["originalBuy"] = () => resourceBuy.placeholder;
        resourceValues[resourceName]["buy"] = () => resourceBuy.value;
        resourceValues[resourceName]["originalSell"] = () => resourceSell.placeholder;
        resourceValues[resourceName]["sell"] = () => resourceSell.value;

        resourceValues[resourceName]["value"] = () => {
            let value = {};
            if (resourceValues[resourceName]["originalBuy"]() != resourceValues[resourceName]["buy"]()){
                value["buy"] = resourceValues[resourceName]["buy"]();
            }
            if (resourceValues[resourceName]["originalSell"]() != resourceValues[resourceName]["sell"]()){
                value["sell"] = resourceValues[resourceName]["sell"]();
            }
            return value;
        };

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
        $(this).toggle($(this).text().replace(new RegExp("Reset", 'g'), "").toLowerCase().indexOf(value) > -1)
    });
});

$("#resourcefilterclear").on("click", function() {
    $("#resourcefilter").val("");
    $("#resourcetable tbody tr").filter(function() {
        $(this).show();
    });
});