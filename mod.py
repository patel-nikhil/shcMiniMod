import copy
import json
import os

def install():

    with open("config.json", "r") as f:
        config = json.load(f)


    backup = []

    if os.path.isfile("uninstall.json"):
        with open("uninstall.json", "r") as f:
            try:
                uninstall = json.load(f)
            except json.JSONDecodeError:
                uninstall = []
    else:
        uninstall = []

    print(uninstall)

    with open("uninstall.json", "w") as f:
        with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
            for cfg in config:
                if cfg["description"] == "tax_reset" or cfg["description"] == "assassin_rally_speed":
                    uninstall.append(copy.deepcopy(cfg))
                    continue

                shc.seek(0)
                shc.seek(int(cfg["address"], 16))
                if cfg["description"] not in [x["description"] for x in uninstall if type(x) == dict and "description" in x.keys()]:
                    uninstall.append(copy.deepcopy(cfg))
                    if type(cfg["value"]) == list:
                        uninstall[-1]["value"] = []
                        for i in range(len(cfg["value"])):
                            uninstall[-1]["value"].append(hex(int.from_bytes(shc.read(cfg["size"]), byteorder='little')))
                    else:
                        uninstall[-1]["value"] = hex(int.from_bytes(shc.read(cfg["size"]), byteorder='little'))


            f.write(json.dumps(uninstall, indent=4))
                


            for cfg in config:
                if cfg["description"] == "tax_reset" and cfg["value"] == True:
                    install_tax_change()
                    continue
                if cfg["description"] == "assassin_rally_speed":
                    speed = cfg["value"]
                    speed = speed & 0xF
                    assassin_rally_aob = [0x66, 0xBA, speed, 0x00, 0x90, 0x90, 0x90]
                    shc.seek(0)
                    shc.seek(0x174A60)
                    for elem in assassin_rally_aob:
                        shc.write((elem).to_bytes(1, byteorder='little'))
                    continue


                shc.seek(0)
                shc.seek(int(cfg["address"], 16))
                if type(cfg["value"]) == list:
                    for i in range(len(cfg["value"])):
                        shc.write(int(cfg["value"][i]).to_bytes(int(cfg["size"]), byteorder='little'))
                else:
                    shc.write(int(cfg["value"]).to_bytes(int(cfg["size"]), byteorder='little'))


def uninstall():
    if os.path.isfile("uninstall.json"):
        with open("uninstall.json", "r") as f:
            try:
                uninstall = json.load(f)
            except json.JSONDecodeError:
                return
            
            with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
                for cfg in uninstall:
                    if cfg["description"] == "tax_reset" and cfg["value"] == True:
                        uninstall_tax_change()
                        continue

                    if cfg["description"] == "assassin_rally_speed":
                        assassin_rally_aob = [0x66, 0x8B, 0x96, 0x88, 0xD3, 0x45, 0x01]
                        shc.seek(0)
                        shc.seek(0x174A60)
                        for elem in assassin_rally_aob:
                            shc.write((elem).to_bytes(1, byteorder='little'))
                        continue

                    shc.seek(0)
                    shc.seek(int(cfg["address"], 16))
                    if type(cfg["value"]) == list:
                        for i in range(len(cfg["value"])):
                            shc.write(int(cfg["value"][i], 16).to_bytes(int(cfg["size"]), byteorder='little'))
                    else:
                        shc.write(int(cfg["value"], 16).to_bytes(int(cfg["size"]), byteorder='little'))

    if os.path.isfile("uninstall.json"):
        os.remove("uninstall.json")


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
        shc.write((0x2F70000).to_bytes(4, byteorder='little'))

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x2B9", 16))
        shc.write((0x80).to_bytes(1, byteorder='little'))

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x2C1", 16))
        shc.write((0x80).to_bytes(1, byteorder='little'))




    # Reset tax on < 1 popularity
    tax_instructions = [
        0x3D, 0x64, 0x00, 0x00, 0x00,
        0x7F, 0x12,
        0x83, 0xBC, 0x3E, 0x88, 0x56, 0x0C, 0x00, 0x03,
        0x7E, 0x08,
        0xC6, 0x84, 0x3E, 0x88, 0x56, 0x0C, 0x00, 0x03,
        0x89, 0x84, 0x3E, 0xB4, 0x38, 0x0C, 0x00,
        0xE9, 0x09, 0xBB, 0x4E, 0xFD
    ]

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x79F000", 16))
        for elem in tax_instructions:
            shc.write(int(str(elem)).to_bytes(1, byteorder='little'))

    position = 0x2F70000 - 0x45bb2c

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x5BB27", 16))
        shc.write(int("0xE9", 16).to_bytes(1, byteorder='little'))
        shc.write((position).to_bytes(4, byteorder='little'))
        shc.write((0x90).to_bytes(1, byteorder='little'))
        shc.write((0x90).to_bytes(1, byteorder='little'))


    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x79F025", 16))
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
        # FD0EC16F
        0xE9, 0x60, 0xC1, 0x4E, 0xFD,
    ]

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x79F030", 16))
        for elem in zero_tax_instructions:
            shc.write(int(str(elem)).to_bytes(1, byteorder='little'))

    position = 0x2F70030 - 0x45C1B0

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x5C1AB", 16))
        shc.write(int("0xE9", 16).to_bytes(1, byteorder='little'))
        shc.write((position).to_bytes(4, byteorder='little'))

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x79F050", 16))
        for i in range(0xFB0):
            shc.write((90).to_bytes(1, byteorder='little'))




def uninstall_tax_change():
    # Reset image size to original ucp section size
    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x168", 16))
        shc.write((0x2F60000).to_bytes(4, byteorder='little'))

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x2B9", 16))
        shc.write((0x70).to_bytes(1, byteorder='little'))

    with open(os.path.join(os.path.dirname(os.getcwd()), "Stronghold_Crusader_Extreme.exe"), "r+b") as shc:
        shc.seek(0)
        shc.seek(int("0x2C1", 16))
        shc.write((0x70).to_bytes(1, byteorder='little'))
    

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
    
    if len(sys.argv) > 1 and sys.argv[1] == "uninstall":
        uninstall()
    else:
        install()
