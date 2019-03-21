import glob
import os
import re
import sys
import subprocess




# Original Source from: https://github.com/Stat1cV01D/bt_trackers_replacer
# Converted to Python 3.0 by golf7

# Make sure qbittorrent is fully shut down before starting
# Take a backup of the BT_backup folder (Windows is C:\Users\<user>\AppData\Local\qBittorrent)

# Usage:
# python tracker_replace.py "old_tracker_url" "new_tracker_url"

# Torrents and .fastresume files should be in a subdirectory named BT_backup in the same directory as the python script
# ex:
# /tracker_replace.py
# /BT_backup/asdfasdf.fastresume
# /BT_backup/asdfasdf.torrent

# TAKE A FULL BACKUP OF YOUR BT_backup folder before starting

# To also change the torrent files, you must have the transmission-edit.exe and all the associated dlls in the same folder as this script.  Also "change_torrent" must be set as 1
#   transmission-edit.exe can be installed as part of the command line tools through the transmission installer
change_torrent = 1

# I take no responsibility if you do not take a backup of your entire BT_backup folder, as this will seriously ruin your current torrents if you mess up



trackers_section_exp = re.compile('trackersll(\d+:.*)ee\d+:')
tracker_len_exp = re.compile('(el)?(\d+):')

print ('Simple tool to replace tracker info in *.fastresume files v0.1 - Python 3')

uc_path = os.path.dirname(os.path.realpath(__file__))
print ("Working Directory: " + uc_path)


if len(sys.argv) != 3:
    print ('Usage: ' + sys.argv[0] + ' <old tracker> <new tracker> ')
    print ('*.fastresume and *.torrent files must be in BT_backup folder beside the script')
    
    sys.exit(1)

old_text = sys.argv[1]
new_text = sys.argv[2]

os.chdir('BT_backup')

for file in glob.glob('*.fastresume'):
    with open(file, 'rb') as f:
        data = f.read()

    if old_text not in str(data):
        print ('Skippping ' + file)
        continue

    print ('Found item in ' + file)
    trackers_section = re.search(trackers_section_exp, str(data))
    if not trackers_section:
        continue
    trackers = trackers_section.group(1)

    tracker_list = []
    i = 0
    while i < len(trackers):
        len_found = re.search(tracker_len_exp, trackers[i:])
        tracker_len = int(len_found.group(2))
        i += len_found.end()
        tracker = trackers[i:i+tracker_len]
        if tracker.find(old_text) != -1:
            new_tracker = tracker.replace(old_text, new_text)
            print ('    Replacing ' + tracker + ' with ' + new_tracker)
            tracker = new_tracker
        tracker_list.append(str(len(tracker)) + ':' + tracker)
        i += tracker_len

    data = data.replace(bytes(trackers, 'utf-8'), bytes('el'.join(tracker_list), 'utf-8'))
    with open(file, 'wb') as f:
        f.write(data)

    # Now lets change it in the torrent itself
    # print ("replacing old with new in torrent file now")

    if (change_torrent == 1) :
        print ("Running: " + uc_path + "\\transmission-edit.exe" + " -r " + old_text + " " + new_text + " " + uc_path + "\\BT_backup\\" + file.replace("fastresume", "torrent"))
        proc = subprocess.check_output(uc_path + "\\transmission-edit.exe" + " -r " + old_text + " " + new_text + " " + uc_path + "\\BT_backup\\" + file.replace("fastresume", "torrent"))
        print ("    " + str(proc))