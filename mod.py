import copy
import json
import os

import assets
from assets.data import building_names, building_cost_base, building_health_base
from assets.data import unit_names, unit_health_base, unit_arrow_dmg_base, unit_stone_dmg_base, unit_xbow_dmg_base, unit_melee_dmg_base


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


    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        for cfg in config:
            if cfg == "buildings":
                buildings = config[cfg]

                for key in buildings:
                    current_building = buildings[key]

                    if "cost" in current_building.keys():
                        address = get_building_cost_address(key)
                        if str(address) not in uninstall:
                            uninstall[str(address)] = read(shc, address, 4)
                        for cost in current_building["cost"]:
                            #write(shc, address, cost, 4)
                            address += 4

                    if "health" in current_building.keys():
                        address = get_building_health_address(key)
                        if str(address) not in uninstall:
                            uninstall[str(address)] = read(shc, address, 4)
                        #write(shc, address, current_building["health"], 4)


            elif cfg == "units":
                units = config[cfg]

                for key in units:
                    current_unit = units[key]

                    if "health" in current_unit.keys():
                        address = get_unit_health_address(key)
                        if str(address) not in uninstall:
                            uninstall[str(address)] = read(shc, address, 4)
                        #write(shc, address, current_unit["health"], 4)

                    if "arrowDamage" in current_unit.keys():
                        address = get_unit_arrow_dmg_address(key)
                        if str(address) not in uninstall:
                            uninstall[str(address)] = read(shc, address, 4)
                        #write(shc, address, current_unit["health"], 4)

                    if "xbowDamage" in current_unit.keys():
                        address = get_unit_xbow_dmg_address(key)
                        if str(address) not in uninstall:
                            uninstall[str(address)] = read(shc, address, 4)
                        #write(shc, address, current_unit["health"], 4)

                    if "arrowDamage" in current_unit.keys():
                        address = get_unit_arrow_dmg_address(key)
                        if str(address) not in uninstall:
                            uninstall[str(address)] = read(shc, address, 4)
                        #write(shc, address, current_unit["health"], 4)
                    
                    if "meleeDamageVs" in current_unit.keys():
                        for defender in current_unit["meleeDamageVs"]:
                            address = get_unit_melee_dmg_address(key, defender)
                            if str(address) not in uninstall:
                                uninstall[str(address)] = read(shc, address, 4)
                            #write(shc, address, current_unit["health"], 4)


            elif cfg == "goods":
                pass

            elif cfg == "other":
                pass

    with open("uninstall.json", "w") as f:                
        json.dump(uninstall, f, indent=4)

    print([hex(int(x)) for x in uninstall])


def uninstall():
    pass


def get_building_cost_address(building_name):
    index = building_names.index(building_name)
    if index == -1:
        raise Exception("Invalid building name")
    return building_cost_base +  index * 4

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


def read(shc, address, size):
    shc.seek(0)
    shc.seek(address)
    return int.from_bytes(shc.read(size), byteorder='little')


def write(shc, address, value, size):
    shc.seek(0)
    shc.seek(address)
    shc.write(int(value).to_bytes(size, byteorder='little'))



if __name__ == "__main__":
    import sys
    
    with open("config.json", "r") as f:
        config = json.load(f)
    
    install()

    # for cfg in config:
    #     print(config[cfg])

    # if len(sys.argv) > 1 and sys.argv[1] == "uninstall":
    #     uninstall()
    # else:
    #     install()
