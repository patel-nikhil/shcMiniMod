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

                    if "stoneDamage" in current_unit.keys():
                        address = get_unit_stone_dmg_address(key)
                        if str(address) not in uninstall[str(size)]:
                            uninstall[str(size)][str(address)] = read(shc, address, size)
                        write(shc, address, current_unit["stoneDamage"], size)
                    
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

                    if change["description"] == "tax_reset" or change["description"] == "assassin_rally_speed":
                        if not("other" in uninstall):
                            uninstall["other"] = {}

                        

                        if change["description"] == "tax_reset" and change["value"] == True:
                            uninstall["other"]["tax_reset"] = copy.deepcopy(change)
                            install_tax_change()
                            continue
                        if change["description"] == "assassin_rally_speed":
                            uninstall["other"]["assassin_rally_speed"] = copy.deepcopy(change)
                            speed = change["value"]
                            speed = speed & 0xF
                            assassin_rally_aob = [0x66, 0xBA, speed, 0x00, 0x90, 0x90, 0x90]
                            shc.seek(0)
                            shc.seek(0x174A60)
                            for elem in assassin_rally_aob:
                                shc.write((elem).to_bytes(1, byteorder='little'))
                            continue

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
                    try:
                        write(shc, int(key), uninstall[size][key], int(size)) 
                    except:
                        if "tax_reset" in uninstall[size]:
                            uninstall_tax_change()
                        if "assassin_rally_speed" in uninstall[size]:
                            assassin_rally_aob = [0x66, 0x8B, 0x96, 0x88, 0xD3, 0x45, 0x01]
                            shc.seek(0)
                            shc.seek(0x174A60)
                            for elem in assassin_rally_aob:
                                shc.write((elem).to_bytes(1, byteorder='little'))
                        break



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



def install_tax_change():

    original_section_count = None
    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x11E", 16))
        original_section_count = int.from_bytes(shc.read(1), byteorder='little')
    
    if original_section_count != 5:
        import ctypes
        ctypes.windll.user32.MessageBoxW(0, "Error UCP not installed, tax_reset change failed", "Tax change install error", 0)
        sys.exit()

    SIZE = 0x8000

    # Increase image size to accommodate for extra code
    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x168", 16))
        shc.write((0x2B90000).to_bytes(4, byteorder='little'))

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x2B9", 16))
        shc.write((0x70).to_bytes(1, byteorder='little'))

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x2C1", 16))
        shc.write((0x70).to_bytes(1, byteorder='little'))


    # Reset tax on < 1 popularity
    tax_instructions = [
        0x3D, 0x64, 0x00, 0x00, 0x00,
        0x7F, 0x12,
        0x83, 0xBC, 0x3E, 0x88, 0x56, 0x0C, 0x00, 0x03,
        0x7E, 0x08,
        0xC6, 0x84, 0x3E, 0x88, 0x56, 0x0C, 0x00, 0x03,
        0x89, 0x84, 0x3E, 0xB4, 0x38, 0x0C, 0x00,
        0xE9, 0x09, 0xCB, 0x4C, 0xFD #45BB2E
    ]

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x7BE000", 16))
        for elem in tax_instructions:
            shc.write(int(str(elem)).to_bytes(1, byteorder='little'))

    position = 0x2F8F000 - 0x45bb2c

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x5BB27", 16))
        shc.write(int("0xE9", 16).to_bytes(1, byteorder='little'))
        shc.write((position).to_bytes(4, byteorder='little'))
        shc.write((0x90).to_bytes(1, byteorder='little'))
        shc.write((0x90).to_bytes(1, byteorder='little'))


    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x7BE025", 16))
        for i in range(0xB):
            shc.write((0x90).to_bytes(1, byteorder='little'))


    # Zero-out tax gold on < 1 popularity
    zero_tax_instructions = [
        0x66, 0x83, 0xBB, 0xA8, 0x72, 0x0C, 0x00, 0x64,
        0x7D, 0x0C,
        0x83, 0x3E, 0x3,
        0x7E, 0x07,
        0xB8, 0x03, 0x00, 0x00, 0x00,
        0x7F, 0x02,
        0x8B, 0x06,
        0x83, 0xF8, 0x03,

        0xE9, 0x60, 0xD1, 0x4C, 0xFD, #45C1B0
    ]

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x7BE030", 16))
        for elem in zero_tax_instructions:
            shc.write(int(str(elem)).to_bytes(1, byteorder='little'))

    position = 0x2F8F030 - 0x45C1B0

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x5C1AB", 16))
        shc.write(int("0xE9", 16).to_bytes(1, byteorder='little'))
        shc.write((position).to_bytes(4, byteorder='little'))

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x7BE050", 16))
        for i in range(0xFB0):
            shc.write((0x90).to_bytes(1, byteorder='little'))




def uninstall_tax_change():
    # Reset image size to original ucp section size
    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x168", 16))
        shc.write((0x2F8E000).to_bytes(4, byteorder='little'))

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x2B9", 16))
        shc.write((0x50).to_bytes(1, byteorder='little'))

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x2C1", 16))
        shc.write((0x50).to_bytes(1, byteorder='little'))
    

    # Undo tax reset change
    original_tax_reset_instructions = [0x89, 0x84, 0x3E, 0xB4, 0x38, 0x0C, 0x00]

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x5BB27", 16))
        for elem in original_tax_reset_instructions:
            shc.write(int(str(elem)).to_bytes(1, byteorder='little'))

    original_tax_gold_instructions = [0x8B, 0x06, 0x83, 0xF8, 0x03]

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x5C1AB", 16))
        for elem in original_tax_gold_instructions:
            shc.write(int(str(elem)).to_bytes(1, byteorder='little'))


if __name__ == "__main__":
    import sys
    
    with open("config.json", "r") as f:
        config = json.load(f)

    if len(sys.argv) > 1 and sys.argv[1] == "uninstall":
        uninstall()
    else:
        install()
