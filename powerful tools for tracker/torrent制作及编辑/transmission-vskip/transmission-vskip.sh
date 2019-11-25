#!/bin/bash

###########################################################################################
################################## User Configuration #####################################
###########################################################################################
# your transmission home directory , please use full path like the on lelow
# end with '/' please
config_dir='/var/lib/transmission/.config/transmission-daemon/'

# [ Optional ]
# Please usr "\t"(tab) as separator !!!
# If your system don't use systemd , change them below , or comment them
# the command to start transmission-daemon
start_cmd='sudo	systemctl	start	transmission'
# the command to shut transmission-daemon down
shutdown_cmd='sudo	systemctl	stop	transmission'
###########################################################################################
###########################################################################################
###########################################################################################

based_tracker=""
tmp_tracker=""
based_torrent=""
resume_torrents=""
resume_files=""
based_file=""
input=""
temp=""
tmp=""
vnr=""
cnr=""
finished=0

print_version() {
	echo "transmission-vskip 1.1"
}

tell_usage() {
	cat << EOF 1>&2
Usage:
  transmission-vskip [TASK_NAME] --base [TRACKER_NAME]

Example:
  transmission-vskip check
  transmission-vskip 'Transformers.The.Last.Knight.2017.2160p.EUR.UHD.BluRay.HEVC.Atmos.TrueHD.7.1-DiY@HDHome' --base hdhome

Options:
  check					check environment to print all WARNINGS
  --base				base on which tracker of task to verify
  -h, --help				print this help page
  -V, --version				print version massage
EOF
}

torrent_to_tracker() {
	func_tmp=""
	func_tracker=""

	input=$IFS ; IFS=$'\t\n'
	func_tmp="$(transmission-show	"$config_dir"torrents/"$1")"
	IFS="$input"
	func_tracker="$(echo "$func_tmp" | grep -n '  Tier #1' | awk -F ':' '{print $1}')"
	func_tracker=$(($func_tracker+1))
	func_tracker="$(echo "$func_tmp" | awk NR==$func_tracker)"
	func_tracker="$(echo "$func_tracker" | awk -F '/' '{print $3}')"
	if	[ -z "$(echo "$func_tracker" | awk -F '.' '{print $3}')" ];then
		func_tracker="$(echo "$func_tracker" | awk -F '.' '{print $1}')"
	else
		func_tracker="$(echo "$func_tracker" | awk -F '.' '{print $2}')"
	fi
	echo "$func_tracker"
}

torrent_translater() {
	if	[ -z "$1" ];then
		tell_usage
		exit 1
# Add / Replace your Abbreviation below like the first one below
#	elif	[ "$1"x == "lpt"x ];then
#		based_tracker='loveprivatetracker'
#	elif	[ "$1"x == ""x ];then
#		based_tracker=''
#	elif	[ "$1"x == ""x ];then
#		based_tracker=''
	else
		based_tracker="$1"
	fi
}

start_transmission() {
	if	[ -z "$start_cmd" ];then
		exit 0
	fi
	read -sp ":: Restart transmission-daemon? [Y/n] " input < /dev/tty ; echo ""
	if	[ -z "$input" ];then
		input='y'
	elif	[ "${#input}" -gt 1 ];then
		input=`echo "$input" | cut -c 1`
	fi

	tmp=""
	if	[ "$input" == 'y' ] || [ "$input" == 'Y' ];then
		$start_cmd && tmp="$(ps -A | grep transmission-da)"
		if	[ -z "$tmp" ];then
			echo "FATAL error: failed to start transmission-daemon , please check your \$start_cmd !!!" 1>&2
			exit 1
		fi
	else
		echo "exiting ..."
		exit 0
		fi
}

check_and_system() {
	if	[ $1 == 'check' ];then
		temp=0
	elif	[ $1 == 'system' ];then
		exit 1
	fi
}

environment_check() {
	temp=1
####################################### Checking ##########################################
############################################### whether you have installed transmission-cli
	if	[ -z "$(transmission-show -V 2>&1 | grep 'transmission-show')" ];then
		echo "WARNING: you haven't installed transmission-cli , transmission-show is missiong !!!" 1>&2
		check_and_system "$1"
	fi
	if	[ -z "$(transmission-daemon -V 2>&1 | grep 'transmission-daemon')" ];then
		echo "WARNING: you haven't installed transmission-cli , transmission-daemon is missiong !!!" 1>&2
		check_and_system "$1"
	fi
################################################################################ */torrents
	input=$IFS ; IFS=$'\t\n'
	if	test	-d	"$config_dir"torrents	;then
		if	[ "$(whoami)"x != 'root'x ];then
			vnr="$(ls	-ld	"$config_dir"torrents/	|	awk	'{print $3}')"
			IFS=$input
			if	[ "$vnr"x != "$(whoami)"x ];then
				echo "WARNING: current user doesn't own "$config_dir"torrents/" 1>&2
				check_and_system "$1"
			fi
		fi
	else
		IFS=$input
		echo "WARNINHG: "$config_dir"torrents/ doesn't exist , please check your \$config_dir !!!" 1>&2
		check_and_system "$1"
	fi
################################################################################## */resume
	input=$IFS ; IFS=$'\t\n'
	if	test	-d	"$config_dir"resume	;then
		if	[ "$(whoami)"x != 'root'x ];then
			cnr="$(ls	-ld	"$config_dir"resume/	|	awk	'{print $3}')"
			IFS=$input
			if	[ "$cnr"x != "$(whoami)"x ];then
				echo "WARNING: current user doesn't own "$config_dir"resume/" 1>&2
				check_and_system "$1"
			fi
		fi
	else
		IFS=$input
		echo "WARNINHG: "$config_dir"resume/ doesn't exist , please check your \$config_dir !!!" 1>&2
		check_and_system "$1"
	fi
	IFS=$input
####################################################### whether transmission-daemon is down
tmp="$(ps -A | grep transmission-da)"
if	[ -n "$tmp" ];then
	if	[ -z "$shutdown_cmd" ] || [ -n "$shutdown_cmd" -a "$1"x == 'check'x ];then
		echo "WARNING: please shudown transmission-daemon  !!!" 1>&2
		check_and_system "$1"
	elif	[ -n "$shutdown_cmd" ] && [ "$1" == 'system' ];then
		echo -e ">>>\tTransmission-daemon is still running:\n$tmp"
		read -sp ":: Shutdown transmission-daemon? [Y/n] " input  < /dev/tty ; echo ""
		if	[ -z "$input" ];then
			input='y'
		elif	[ "${#input}" -gt 1 ];then
			input=`echo "$input" | cut -c 1`
		fi

		if	[ "$input" == 'y' ] || [ "$input" == 'Y' ];then
			$shutdown_cmd && tmp="$(ps -A | grep transmission-da)"
			if	[ -n "$tmp" ];then
				echo "FATAL error: failed to shutdown transmission-daemon , please check your \$shutdown_cmd !!!" 1>&2
				exit 1
			fi
		else
			echo "exiting ..."
			exit 0
		fi
	fi
fi
############################################################### whether there is no mistake
if	[ $1 == 'check' ] && [ $temp == 1 ];then
	echo -e ">>>\tEverything is fine , ready to run !!!"
fi
###########################################################################################
}

exist_test() {
	if	[ ! -f "$1" ];then
		if	[ "$2"x == 'based'x ];then
			echo "FATAL error: based .resume file missing !!!" 1>&2
			exit 1
		fi
		echo -e "WARNING: the file below doesn't exist !!!\n\t$1"
		read -sp ':: Do you want to proceed ? [Y/n] ' input < /dev/tty ; echo ""
		if	[ -z "$input" ];then
			input='y'
		elif	[ "${#input}" -gt 1 ];then
			input=`echo "$input" | cut -c 1`
		fi
		if	[ "$input" != 'y' ] && [ "$input" != 'Y' ];then
			echo 'exiting ...'
			exit 0
		fi
	fi
}
###########################################################################################
######################################## Main #############################################
###########################################################################################
######################################################################### Check Environment
if	[ "$#" == 3 ] && [ "$2"x == '--base'x ];then
	environment_check system
	torrent_translater "$3"
elif	[ "$#" == 1 ] && [ "$1"x == '-h'x -o "$1"x == '--help'x ];then
	tell_usage
	exit 0
elif	[ "$#" == 1 ] && [ "$1"x == '-V'x -o "$1"x == '--version'x ];then
	print_version
	exit 0
elif	[ "$#" == 1 ] && [ "$1"x == 'check'x ];then
	environment_check check
	exit 0
else
	tell_usage
	exit 1
fi
############################################################### Calculate the torrents name
cd "$config_dir"
cd torrents
tmp=`ls -l "$1"* | tr -s ' ' | cut -d ' ' -f 9-`
while read LINE
do
	if [ "$(torrent_to_tracker "$LINE")" != "$based_tracker" ];then
		if	[ -z "$resume_torrents" ];then
			resume_torrents="$LINE"
		else
			resume_torrents="$(echo "$LINE" ; echo "$resume_torrents")"
		fi
	else
		based_torrent="$LINE"
	fi
done <<< "$tmp"
if	[ -z "$resume_torrents" ];then
	echo 'FATAL error: failed to calculate matches, please check the task name !!!' 1>&2
	exit 1
fi
if	[ -z "$based_torrent" ];then
	echo 'FATAL error: failed to match the base torrent, please check your tracker !!!' 1>&2
	exit 1
fi
#################################### Torrents Found !!! ###################################
echo '>>> Torrents Found:'
while read LINE
do
	echo -e "\t$LINE"
done <<< "$resume_torrents"
echo -e ">\t$based_torrent"
############################################################### Calculate resume files name
cd ../resume
while read LINE
do
	if [ -z "$resume_files" ];then
		resume_files="$(echo "$LINE" | awk -F '.' -v OFS='.' '{$NF="resume";print $0}')"
	else
		LINE="$(echo "$LINE" | awk -F '.' -v OFS='.' '{$NF="resume";print $0}')"
		resume_files="$(echo "$LINE" ; echo "$resume_files")"
	fi
done <<< "$resume_torrents"
based_file="$(echo "$based_torrent" | awk -F '.' -v OFS='.' '{$NF="resume";print $0}')"
while read LINE
do
	exist_test "$LINE"
done <<< "$resume_files"
exist_test "$based_file" 'based'
################################## Resume Files List !!! ##################################
echo '>>> Resume Files List:'
while read LINE
do
	echo -e "\t$LINE"
done <<< "$resume_files"
echo -e ">\t$based_file"
######################################## Run !!! ##########################################
cnr=1
vnr="$(echo "$resume_files" | awk 'END{print NR}')"
while read LINE
do
	tmp="cp '$based_file' '$LINE'"
	temp="$(torrent_to_tracker "${LINE%??????}torrent")"
	echo -e ">>>\tRuning for $temp ($cnr/$vnr)\n#\t$tmp" ; cnr=$(($cnr+1))
	read -sp ':: Proceed with the command ? [Y/n] ' input < /dev/tty ; echo ""
	if	[ -z "$input" ];then
		input='y'
	elif	[ "${#input}" -gt 1 ];then
		input=`echo "$input" | cut -c 1`
	fi
	tmp="cp	$based_file	$LINE"
	if	[ "$input" == 'y' ] || [ "$input" == 'Y' ];then
		temp=$IFS ; IFS=$'\t'	;	$tmp	;	tmp="$?"	;	IFS=$temp
		if	[ "$tmp" != 0 ];then
			echo "FATAL error: couldn't complete file copy !!!" 1>&2
			exit 1
		else
			finished=$(($finished+1))
		fi
	else
		:
	fi
done <<< "$resume_files"

if	[ "$finished" == 0 ];then
	echo "no resume file has updated ..." 1>&2
	start_transmission
	exit 0
else
	echo -e ">>>\tSuccessfully updated ($finished/$vnr) !!!"
	cd "$config_dir"
	chown -hR transmission:transmission torrents
	chown -hR transmission:transmission resume
	start_transmission
	exit 0
fi
