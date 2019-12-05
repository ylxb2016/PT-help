#!/usr/bin/env python2
#
# Find and replace tracker urls in a Deluge torrents.state

import os
import sys
import platform
import shutil
import cPickle

orig_tracker_url = raw_input('Tracker URL: ')
new_tracker_url = raw_input('New tracker URL (leave empty to remove): ')

if platform.system() in ('Windows', 'Microsoft'):
    state_file_path = os.path.join(os.environ.get('APPDATA'), 'deluge', 'state', 'torrents.state')
    deluge_dir = os.path.join(os.environ['ProgramFiles'], 'Deluge')
    if os.path.isdir(deluge_dir):
        sys.path.append(deluge_dir)
        for item in os.listdir(deluge_dir):
            if item.endswith(('.egg', '.zip')):
                sys.path.append(os.path.join(deluge_dir, item))
else:
    state_file_path = os.path.expanduser('~/.config/deluge/state/torrents.state')

print("State file: %s" % state_file_path)
if not orig_tracker_url:
    print('No tracker URL to search for, exiting...')
    exit()

if new_tracker_url:
    print("Replace '%s' with '%s'" % (orig_tracker_url, new_tracker_url))
else:
    print("Remove tracker '%s'" % orig_tracker_url)

if not raw_input('Continue? (y/n) ') in 'yY':
    exit()

state_file = open(state_file_path, 'rb')
state = cPickle.load(state_file)
state_file.close()

state_modified = False
for torrent in state.torrents:
    for idx, tracker in enumerate(torrent.trackers[:]):
        if tracker['url'] == orig_tracker_url:
            if new_tracker_url:
                torrent.trackers[idx]['url'] = new_tracker_url
            else:
                torrent.trackers.remove(tracker)
            state_modified = True


if state_modified:
    shutil.copyfile(state_file_path, state_file_path + '.old')
    state_file = open(state_file_path, 'wb')
    cPickle.dump(state, state_file)
    state_file.close()
    print("State Updated")
else:
    print("Nothing to do")
