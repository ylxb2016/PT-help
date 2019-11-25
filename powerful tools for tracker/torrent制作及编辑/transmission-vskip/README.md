## transmission-vskip
transmission-vskip is a shell script for skipping hash verification when using transmission-cli . It is very useful for seeding identical big torrents on different trackers .

![Preview](https://github.com/1ndeed/transmission-vskip/blob/master/Demontration.png)

## Simple to Use:
transmission-vskip is based on shell script . Creat a symbolic link at `/usr/bin/` . Then configure at most 3 lines for it . Then it is ready to work .

## Installation:
download transmission-vskip.sh to your current directory and:

    $ sudo mv ./transmission-vskip/transmission-vskip.sh /etc/  
    $ sudo chmod +x /etc/transmission-vskip.sh  
    $ sudo ln -s /etc/transmission-vskip.sh /usr/bin/transmission-vskip  
    $ sudo vim /etc/transmission-vskip.sh  

## Configuration:
Open the file you downloaded , you should see `User Configuration` part between `line 3 and 19` .  
* "config_dir" is the location of your `transmission-daemon configuration directory` . Usually in `~/.config/transmission-daemon/` .  
It contains "torrents" and "resume" files . Using `full path` is recommended . End with `'/'` please .  
* "start_cmd" and "shutdown_cmd" are commands for shutting down and start transmission-daemon . Please `use Tab as separators` .  
If your system use `systemd` and you use systemd to active transmission-daemon , you don't have to modify these two ;  
If your system don't use systemd , change it in your way . Just make sure you have the permission ;  
If you don't nedd this function , add '#' in the front of these two lines to disable them .  


## Ready to Run:
before you run it , using `check` to check if there is any obstructs is recommended .  

    $ transmission-vskip check  

## Example:
Lets say you have Completed downloading a 100GB video file from `website A` . Then you noticed `website B` and `website C` have the `same torrent` . After you `added two new torrents to transmission` . You can do this to skip hash verification:  

    $ sudo transmission-vskip 'Transformers.The.Last.Knight.2017.2160p.EUR.UHD.BluRay.HEVC.Atmos.TrueHD.7.1-DiY' --base 'website A'  

## Tips:
* You can add `abbreviation` for your trackers between line 79 and 84 .  
* Always use `' '` to add the task name to avoid special symbol issues .  
* You can write `alias vskip='transmission-vskip'` into ~/.bashrc .  
* The first argument is `task name` instead of torrent name , transmission-skip only skip verification for the tasks have the same task name .  

## Issues:
* While skipping verification , transmission-daemon must be stopped . After restart transmission-daemon , It is normal for some torrents to report errors . But don't worry , errors usually would disappear in 10 min .  
* Sometimes "systemctl stop transmission" doesn't work with no respond . Open htop on other terminal , find transmission-daemon , and kill all of them:  
```
$ sudo htop  
```
