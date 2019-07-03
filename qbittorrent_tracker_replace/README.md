不同于rTorrent，μTorrent，Deluge，Transmission等PT 客户端，Qbittorrent无法批量修改种子的tracker，这样如果重置了自己的passkey或者想更改tracker和修改torrent来实现直接大批量辅种就比较繁琐了。因此这里给大家带来一个qbittorrent tracker批量修改教程。

# 一.qbittorrent 数据文件分析

其数据文件一般位于：  
Windows：`%localappdata%\qBittorrent`  
类Uinx：`~/.local/share/data/qBittorrent`

其中的子文件夹BT_backup就是qBittorrent的关键数据文件，BT_backup文件夹里包括.torrent和.fastresume文件，并且一一对应，torrent和.fastresume文件的命名都根据torrent的info.hash计算出来的.比如1e515db6d6e4759bcdb45b13d2b4f6c4389ba066.torrent和1e515db6d6e4759bcdb45b13d2b4f6c4389ba066.fastresume，这俩个文件对应，名字名字来源于他们的info.hash值1e515db6d6e4759bcdb45b13d2b4f6c4389ba066。

## .torrent
.torrent文件结构等分析不再细说，之前有说过，编码格式为BEncode，想具体了解请参考[【高级辅种教程】教你编辑修改torrent文件](https://github.com/ylxb2016/PT-help)

## .fastresume
.fastresume包含着绝大部分的重要配置信息，比如添加任务时间，活跃时间，DHT是否关闭，限速，保存文件夹位置，tracker服务器地址等等。
通过修改.fastresume可以实现很多功能，比如更换passkey，比如修改文件位置等等。
我们可以用BEncode Editor和torrent-file-editor打开这个文件，如下图所示，就是tracker的地址，修改这里就可以更换你的passkey。

![image](https:/images2.imgbox.com/a9/46/nsVlaG46_o.png)


PS:关于BEncode
> PHP中sandfoxme/bencode ，
> Python的有utdemir/bencoder、jcul/bencode、fuzeman/bencode.py
> utdemir/bencoder，其github页面https://github.com/utdemir/bencoder
> BEncode编码方式以及torrent文件的一些内容 - Leo Chin - 博客园
> https://www.cnblogs.com/hnrainll/archive/2011/07/21/2112793.html
> Bencode编码 - 简书
> https://www.jianshu.com/p/c26de7a04c38
> Bencode编码解析之流程图 - Lixlee的专栏 - CSDN博客
> https://blog.csdn.net/lixeb/article/details/45178033
> Bencode - Wikipedia
> https://en.wikipedia.org/wiki/Bencode

# 二.修改tracker的方法。
不算Qbittorrent在界面里直接修改单个tracke的话，方法有以下6种，原理其实都一样。
1. 文本编辑器
1. sed等文本编辑命令行工具
1. tracker_replace.py脚本
1. qbtchangetracker命令行工具
1. BEncode Editor和torrent-file-editor工具
1. qbittorrent webui api

注意：以下所有操作前，请先备份好文件，复制出来后再进行修改，以防自己操作不慎，酿成大错。
另外，在各个操作系统下，这些文件是一样的，你完全可以从linux下复制出来，然后在Windows下处理好了，再还原回去；或者相反的操作。

## 方法一.文本编辑器——单个修

.fastresume也可以使用普通的记事本打开，比如我们打开25ea1b4c79dc599233333a10852746fa93d734e2.fastresume文件，如下所示，因为其包含了一些特殊的编码，所以文本文档并不能全部显示出来，给人一种乱码的感觉，这个和上图打开是一一对应的，只不过这是原始数据，没有软件替你解析各个含义了，想知道每一个的含义，请仔细阅读说明文档。我们这里只简单说出我们要修改的内容的位置和注意事项。
很容易看到`trackersll15:http://test.com`就是我们需要修改的地方，不过注意的是我们修改的时候务必小心，不要把这里的文件结构给弄坏了，这里的每一个字符都是有特色含义和定义的，我们不可以丢掉：trackers表示trackers服务器地址，ll表示还是双层list结构，15表示http://test.com是15个字符，这里的：必不可少，这里http://test.com就是我们的tracker，一般来说PT的tracker会包含你的passkey的，这里我去掉了。
所以如果我们要修改passkey的话，需要同时修改2个地方，一个是这里的15，另外才是我们真正想修改的tracker地址`http://test.com`。如果我们要修改为`https://please.passthepopcorn.me/1234567898765432123456789/announce`这个包含67个字符的tracker，我们就要把`trackersll15:http://test.com`修改为`trackersll67:https://please.passthepopcorn.me/1234567898765432123456789/announce`

![image](https://images2.imgbox.com/17/b5/9JDTXnb9_o.png)

## 方法二.sed等文本编辑命令行工具——批量修改

方法其实就是后边的原理所在，其他的方法也都是基于此进行的修改。
想批量修改tracker甚至修改保种路径，就可以使用命令行工具来批量修改，
比如可以使用sed命令行工具，不论是linux还是Windows下，我们都可以使用这款神器进行修改，
我们使用如下的命令就可以实现tracker由15字符`http://test\.com`向16字符`http://tjupt.org`的修改。
`sed -i 's!15:http://test\.com!16:http://tjupt.org!g' *.fastresume`

注意这里的`http://test\.com`，因为这个.会和正则表达式里.冲突，所以要进行转义`\`

## 方法三.tracker_replace.py脚本——批量修改
thanks https://github.com/Stat1cV01D/bt_trackers_replacer and  golf7@Orpheus

这是一个基于python的脚本，请按照python 3.5以上版本。

将文件解压后，把BT_backup文件夹放与其中，路径中最好不要包含中文，请勿包含空格。

目录结构如下：
QBITTORRENT
│  libcurl.dll
│  libeay32.dll
│  ssleay32.dll
│  tracker_replace.py
│  transmission-edit.exe
│  zlib.dll│  
├─BT_backup

![img](https://images2.imgbox.com/5e/ea/Qof64mVe_o.png)

用法：

```
python tracker_replace.py "old_tracker_url" "new_tracker_url"
```


比如我们要把`http://test.com`修改为`http://tjupt.org`，那么在cmd或者Poweshell中输入
```
python tracker_replace.py http://test.com http://tjupt.org
```

这样就会把BT_backup文件夹中的.torrent和.fastresume文件的tracker全部修改。

默认情况下`change_torrent = 1`，表示同时修改torrent，如果你不准备修改.torrent的tracker或者是在非Windows环境下使用此脚本，请修改为`change_torrent = 0 `。

## 方法四.qbtchangetracker命令行工具——批量修改
thanks https://github.com/rumanzo/qbtchangetracker

这是一个基于Go语言的脚本，不过作者编译出了Windows下的exe程序，所以在Windows下打开即可使用。程序也已上传到这里了 https://github.com/ylxb2016/PT-help/tree/master/powerful%20tools%20for%20tracker  

将文件解压后，把备份出来的BT_backup文件夹放与其中，路径中最好不要包含中文，请勿包含空格。

目录结构如下：
QBITTORRENT  
│  qbtchangetracker_v1.0_amd64.exe  
├─BT_backup  
 


用法：

```
Usage of qbtchangetracker_v1.0_amd64.exe:
-d, --directory (= "C:\\Users\\xxx\\AppData\\Local\\qBittorrent\\BT_backup\\")
    Destination directory BT_backup (as default)
-n, --newtracker (= "")
    New tracker
-o, --oldtracker (= "")
    Old tracker
```


比如我们要把`http://test.com`修改为`http://tjupt.org`，那么在cmd或者Poweshell中输入
```
qbtchangetracker_v1.0_amd64.exe -d .\BT_backup -o http://test.com  -n http://tjupt.org
```

这样就会把BT_backup文件夹中的.torrent和.fastresume文件的tracker全部修改。

默认情况下直接双击打开此工具或者在cmd中不加参数运行，会处理`%LOCALAPPDATA%\qBittorrent\BT_BACKUP\ `或者`%APPDATA%\uTorrent\`里的文件，交互式提示你输入旧的tracker地址和新的tracker地址。


## 方法五.BEncode Editor和torrent-file-editor工具——单个修改 

我们使用BEncode Editor和torrent-file-editor工具直接打开.torrent和.fastresume文件，然后把tracker直接打开修改为你想修改的即可。

![img](https://images2.imgbox.com/32/19/Jvjxn2wg_o.png)

## 方法六.通过qbittorrent webui api来实现。

qbittorrent webui api功能很强大，qbittorrent webui能实现的功能他都可以通过命令行来实现，  
qbittorrent webui api的说明文档较为详细，具体可见：  
https://github.com/qbittorrent/qBittorrent/wiki/Web-API-Documentation  
需要注意的是，通过qbittorrent webui api操作前，务必先获得登录用的cookies，然后批量使用Edit trackers函数就可以了。  
举例案例可参考rachpt大佬写的一个AutoSeed脚本里的qbittorrent设置，这里我暂时不准备展开了。  
https://github.com/rachpt/AutoSeed/blob/master/qbittorrent.sh  

综上，可以实现批量修改tracker的办法有：sed、tracker_replace.py脚本、qbtchangetracker、qbittorrent webui api。  
