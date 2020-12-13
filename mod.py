import copy
import json
import os

import assets
from assets.data import building_names, building_cost_base, building_health_base
from assets.data import unit_names, unit_health_base, unit_arrow_dmg_base, unit_stone_dmg_base, unit_xbow_dmg_base, unit_melee_dmg_base
from assets.data import resource_names, resource_buy_base, resource_sell_base

def install():

    with open("config.json", "r") as f:
        config = json.load(f)

    if os.path.isfile("uninstall.json"):
        with open("uninstall.json", "r") as f:
            try:
                uninstall = json.load(f)
            except json.JSONDecodeError:
                uninstall = {}
    else:
        uninstall = {}

    print(uninstall)

    if "4" not in uninstall:
        uninstall["4"] = {}

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        for cfg in config:

            if cfg == "buildings":
                buildings = config[cfg]
                size = 4

                for key in buildings:
                    current_building = buildings[key]

                    if "cost" in current_building.keys():
                        address = get_building_cost_address(key)

                        for cost in current_building["cost"]:
                            if str(address) not in uninstall[str(size)]:
                                uninstall[str(size)][str(address)] = read(shc, address, size)
                            write(shc, address, cost, size)
                            address += size

                    if "health" in current_building.keys():
                        address = get_building_health_address(key)
                        if str(address) not in uninstall[str(size)]:
                            uninstall[str(size)][str(address)] = read(shc, address, size)
                        write(shc, address, current_building["health"], size)


            elif cfg == "units":
                units = config[cfg]
                size = 4

                for key in units:
                    current_unit = units[key]

                    if "health" in current_unit.keys():
                        address = get_unit_health_address(key)
                        if str(address) not in uninstall[str(size)]:
                            uninstall[str(size)][str(address)] = read(shc, address, size)
                        write(shc, address, current_unit["health"], size)

                    if "arrowDamage" in current_unit.keys():
                        address = get_unit_arrow_dmg_address(key)
                        if str(address) not in uninstall[str(size)]:
                            uninstall[str(size)][str(address)] = read(shc, address, size)
                        write(shc, address, current_unit["arrowDamage"], size)

                    if "xbowDamage" in current_unit.keys():
                        address = get_unit_xbow_dmg_address(key)
                        if str(address) not in uninstall[str(size)]:
                            uninstall[str(size)][str(address)] = read(shc, address, size)
                        write(shc, address, current_unit["xbowDamage"], size)

                    if "arrowDamage" in current_unit.keys():
                        address = get_unit_arrow_dmg_address(key)
                        if str(address) not in uninstall[str(size)]:
                            uninstall[str(size)][str(address)] = read(shc, address, size)
                        write(shc, address, current_unit["arrowDamage"], size)
                    
                    if "meleeDamageVs" in current_unit.keys():
                        for defender in current_unit["meleeDamageVs"]:
                            address = get_unit_melee_dmg_address(key, defender)
                            if str(address) not in uninstall[str(size)]:
                                uninstall[str(size)][str(address)] = read(shc, address, size)
                            write(shc, address, current_unit["meleeDamageVs"][defender], size)


            elif cfg == "resources":
                resources = config[cfg]

                for key in resources:
                    current_resource = resources[key]

                    if "buy" in current_resource.keys():
                        address = get_resource_buy_address(key)
                        if str(address) not in uninstall[str(size)]:
                            uninstall[str(size)][str(address)] = read(shc, address, size)
                        write(shc, address, current_resource["buy"], size)

                    if "sell" in current_resource.keys():
                        address = get_resource_sell_address(key)
                        if str(address) not in uninstall[str(size)]:
                            uninstall[str(size)][str(address)] = read(shc, address, size)
                        write(shc, address, current_resource["sell"], size)


            elif cfg == "other":
                subconfig = config[cfg]

                for change in subconfig:
                    address = int(change["address"], 16)
                    size = change["size"]

                    if str(size) not in uninstall:
                        uninstall[str(size)] = {}

                    if type(change["value"]) != list:
                        if str(address) not in uninstall[str(size)]:
                            uninstall[str(size)][str(address)] = read(shc, address, size)
                        write(shc, address, change["value"], size)

                    elif type(change["value"]) == list:
                        for item in change["value"]:
                            if str(address) not in uninstall[str(size)]:
                                uninstall[str(size)][str(address)] = read(shc, address, size)
                            write(shc, address, item, size)
                            address += size


    with open("uninstall.json", "w") as f:                
        json.dump(uninstall, f, indent=4)

    # print([hex(int(x)) for x in uninstall])


def uninstall():
    if os.path.isfile("uninstall.json"):
        with open("uninstall.json", "r") as f:
            try:
                uninstall = json.load(f)
            except json.JSONDecodeError:
                return
        
        with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
            for size in uninstall:
                for key in uninstall[size]:
                    write(shc, int(key), uninstall[size][key], int(size))



def get_building_cost_address(building_name):
    index = building_names.index(building_name)
    if index == -1:
        raise Exception("Invalid building name")
    return building_cost_base +  index * 20

def get_building_health_address(building_name):
    index = building_names.index(building_name)
    if index == -1:
        raise Exception("Invalid building name")
    return building_health_base +  index * 4

def get_unit_health_address(unit_name):
    index = unit_names.index(unit_name)
    if index == -1:
        raise Exception("Invalid unit name")
    return unit_health_base +  index * 4

def get_unit_arrow_dmg_address(unit_name):
    index = unit_names.index(unit_name)
    if index == -1:
        raise Exception("Invalid unit name")
    return unit_arrow_dmg_base +  index * 4

def get_unit_xbow_dmg_address(unit_name):
    index = unit_names.index(unit_name)
    if index == -1:
        raise Exception("Invalid unit name")
    return unit_xbow_dmg_base +  index * 4

def get_unit_stone_dmg_address(unit_name):
    index = unit_names.index(unit_name)
    if index == -1:
        raise Exception("Invalid unit name")
    return unit_stone_dmg_base +  index * 4

def get_unit_melee_dmg_address(attacker_name, defender_name):
    attacker_index = unit_names.index(attacker_name)
    defender_index = unit_names.index(defender_name)
    if attacker_index == -1:
        raise Exception("Invalid unit name")
    if defender_index == -1:
        raise Exception("Invalid unit name")
    return unit_melee_dmg_base + defender_index * 4 + attacker_index * 16 + attacker_index * (len(unit_names) - 1) * 4

def get_resource_buy_address(resource_name):
    index = resource_names.index(resource_name)
    if index == -1:
        raise Exception("Invalid resource name")
    return resource_buy_base +  index * 4

def get_resource_sell_address(resource_name):
    index = resource_names.index(resource_name)
    if index == -1:
        raise Exception("Invalid resource name")
    return resource_sell_base +  index * 4



def read(shc, address, size):
    shc.seek(0)
    shc.seek(address)
    return int.from_bytes(shc.read(size), byteorder='little')


def write(shc, address, value, size):
    shc.seek(0)
    shc.seek(address)
    shc.write(int(value).to_bytes(size, byteorder='little'))
    # print(size, address, value)


if __name__ == "__main__":
    import sys
    
    with open("config.json", "r") as f:
        config = json.load(f)

    if len(sys.argv) > 1 and sys.argv[1] == "uninstall":
        uninstall()
    else:
        install()
