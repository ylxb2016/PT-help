说来惭愧，好久没有写PT相关教程了。
鸽了好久，近期准备动手写完这个教程。

=========================================

**多年以来Transmission官方版无法跳过校验，这可苦了众多NAS用户，更苦了那些不会或者懒得去修改源代码版本的Transmission。
方便大家可以手动跳过Transmission的校验，不用去安装所谓“魔改版”的“违规”Transmission，也可以节省更多的时间，在这里教大家一个手动的，“傻瓜式”的跳校验教程。**

在接下来的时间，主要分为以下几点展开说明：
1. [太长不看版](#1.太长不看版)
1. [Transmission配置文件说明](#2.Transmission配置文件说明)
1. [校验相关文件的含义](#3.校验相关文件的含义)
1. [如何跳过校验](#4.如何跳过校验)
1. [注意事项](#5.注意事项)
1. [扩展说明](#6.扩展说明)

# 1.太长不看版

1. 关闭Transmission客户端。
1. 打开Transmission配置文件夹，将待辅种的torrent==修改好文件名==复制到*torrent文件夹*下。
1. 打开Transmission配置文件夹下的resume文件夹，复制一份其中的对应相同资源的resume文件，并将其修改为==与上一步torrent同名==。
1. 重启Transmission客户端。

# 2.Transmission配置文件说明

不同系统不同安装方式，Transmission配置文件夹路径不同。
一般来说，
Windows下官方安装包安装后，Transmission配置文件夹为`%localappdata%/transmission`  
Centos 7采用yum安装后，Transmission配置文件夹为`/var/lib/transmission`  
Linux源代码编译安装后，Transmission配置文件夹为`/usr/local/transmission/`  
以上的几个文件夹也是需要重点备份的文件，备份好这些文件，当你重装系统的时候，便可以无损迁移，无需再进行繁琐的添加种子以及费时费力的校验数据。

Transmission配置文件夹一般包含有以下内容：
> Resume  
> Torrents  
> settings.json  
> blocklists  
> cache  

**Resume**是用来跳过校验或者叫快速校验的文件夹，里边都是*.resume的文件，这是用来标记校验结果/下载进度的重要文件。  
**Torrents**是用来存放种子的文件夹，每当你添加一个新种子时，都会自动复制到这里一份，切莫删除，里边都是*.torrent的文件。  
**settings.json**是Transmission的配置文件，对于Transmission的所有设置均一文本的形式存储在这里，Transmission的设置可以在GUI/WEB-UI里修改，也可以在这里手动修改。  
**blocklists**是用来存放黑名单，也可以用来过滤ipv4或ipv6.  
**cache**则是缓存文件，不必留意。


# 3.校验相关文件的含义

上述配置文件中resume和torrent文件的命名格式均为  
`torrent的info.name`==.==`info.hash的前16位`  
如`The.Legend.of.Hei.2019.1080p.WEB-DL.H264.AAC-TJUPT.mp4.ccb5a4555a5906f1.torrent`，  
其中`The.Legend.of.Hei.2019.1080p.WEB-DL.H264.AAC-TJUPT.mp4`是这个种子的名字`info.name`，用其他软件加载该种子时显示的名字就是这个，也可以用BEncode等编辑器查看，  
而后半部分的`ccb5a4555a5906f1`是这个种子40位`info.hash`:ccb5a4555a5906f1bc15b13ce73ea4f8b0e17e50的前16位。

多说这句这里的40位info.hash，看过之前教程的应该会有所了解，查看这个info.hash方法多多：  
1. 在Transmission客户端对应种子的属性里即可看到。  
2. 使用torrent-file-editor可以看到  
3. 使用transmission-show, torf-cli ,dottorrent-cli, lstor等等cli工具可以显示Torrent信息中的hash.  

torrent除了文件命名之外没什么需要说的，这里再说说.resume文件

以`The.Legend.of.Hei.2019.1080p.WEB-DL.H264.AAC-TJUPT.mp4.ccb5a4555a5906f1.resume`为例进行说明，则是其文本内容：
> d13:activity-datei0e10:added-datei1573986515e18:bandwidth-priorityi0e7:corrupti0e11:destination3:J:/3:dndli0ee9:done-datei0e10:downloadedi0e24:downloading-time-secondsi610e10:idle-limitd10:idle-limiti30e9:idle-modei0ee9:max-peersi50e4:name54:The.Legend.of.Hei.2019.1080p.WEB-DL.H264.AAC-TJUPT.mp46:pausedi0e8:priorityli0ee8:progressd6:blocks4:none12:time-checkedli1573986515eee11:ratio-limitd11:ratio-limit8:2.00000010:ratio-modei0ee20:seeding-time-secondsi0e16:speed-limit-downd9:speed-Bpsi100000e22:use-global-speed-limiti1e15:use-speed-limiti0ee14:speed-limit-upd9:speed-Bpsi100000e22:use-global-speed-limiti1e15:use-speed-limiti0ee8:uploadedi0ee


这个文件的编码格式为BEncode，这里不再细说,有兴趣的可以看  
[tracker批量修改教程](https://github.com/ylxb2016/PT-help/blob/master/qbittorrent%20tracker%E6%89%B9%E9%87%8F%E4%BF%AE%E6%94%B9%E6%95%99%E7%A8%8B.md)   
[【高级辅种教程】教你编辑修改torrent文件](https://github.com/ylxb2016/PT-help)

如果你足够熟练，完全可以直接阅读，手动编辑这个文本，当然了我更建议你用BEncode Editor或者torrent-file-editor这类GUI编辑器。

这个文件所含选项众多，限于篇幅，就不展开讲了，有机会的话，我单开一贴进行讲解。  
与校验相关的主要有以下几个选项：  
> destination  
> dnd  
> name  
> paused  
> priority  
> progress/blocks  
> progress/have  



其中，  
**destination**用来记录种子对于的资源的实际下载路径。  
**dnd**表示此torrent内有多少个文件，0表示下载，1表示不下载；有多少个文件，这里就会显示多少个0/1。  
**name**表示这个种子的info.name名称，以加载torrent后显示的为准。  
**paused**表示种子的下载状态，0表示任务开始，1表示任务暂停。  
**priority**表示种子内各文件的不同优先级，其中0表示普通，1表示高，-1表示低。同样，有多少个文件，这里就会显示多少个0/1/-1(默认显示为0，也就是说普通优先级)。  
**progress/blocks以及progress/have**代表目前的下载进度，刚添加进新种时blocks为none而无have一项，而下载完毕校验通过后blocks为all，have亦为all，表示下载完成，拥有所有区块。  


# 4.如何跳过校验

读懂上边校验相关文件的含义后，那么跳过校验就简单的多了，其实就是：
> 1.关闭Transmission客户端；  
> 2.将符合命名规范的torrent复制到第一步说的配置文件夹下的Torrents文件夹中；  
> 3.将符合命名及内容规范的resume文件复制到第一步说的配置文件夹下的resume文件夹中；  
> 4.重新打开Transmission客户端。  

那么问题来，如何创建或者修改一份符合命名及内容规范的resume文件呢？

方法有以下三种：

**1.** 如果Transmission客户端已经有之前在其他PT站下载并校验过的该资源的种子，直接复制粘贴，修改文件名即可(即修改后半段中的16位hash)，内容不用修改。  
这也是上边的“太长不看版”的方法。

1. 关闭Transmission客户端。
1. 打开Transmission配置文件夹，将待辅种的torrent==修改好文件名==复制到*torrent文件夹*下。
1. 打开Transmission配置文件夹下的resume文件夹，复制一份其中的对应相同资源的resume文件，并将其修改为==与上一步torrent同名==。
1. 重启Transmission客户端。

**2.** 如果之前没有下载过这个资源，那么可以如下图这样，添加种子进去并选择正确的目标文件夹，取消“添加后开始”的勾选，添加进去后，种子会处于暂停状态。稍等片刻resume文件夹中便会生成对应的.resume文件，此时也可以关闭Transmission客户端，马上就会生对应的.resume文件。  

![img1](https://i.ibb.co/0jhvhMb/TR-0.png)  

![img2](https://i.ibb.co/jgSv2WY/TR-3.png)

将.resume文件用BEncode Editor或者torrent-file-editor打开后，

![img3](https://i.ibb.co/zmTL46w/TR-1.png)  

在确保资源路径以及任务名正确(匹配)的前提下，将paused修改为0，将progress.blocks修改为all，创建progress.have并赋值all.
前后对比效果图如下：  

![img4](https://i.ibb.co/2cCGryc/TR-2.png)

**3.** 也可以直接将以下文本复制到txt中，并保存为
`The.Legend.of.Hei.2019.1080p.WEB-DL.H264.AAC-TJUPT.mp4.ccb5a4555a5906f1.resume`

> d13:activity-datei0e10:added-datei1573986515e18:bandwidth-priorityi0e7:corrupti0e11:destination3:J:/3:dndli0ee9:done-datei0e10:downloadedi0e24:downloading-time-secondsi610e10:idle-limitd10:idle-limiti30e9:idle-modei0ee9:max-peersi50e4:name54:The.Legend.of.Hei.2019.1080p.WEB-DL.H264.AAC-TJUPT.mp46:pausedi0e8:priorityli0ee8:progressd6:blocks4:none12:time-checkedli1573986515eee11:ratio-limitd11:ratio-limit8:2.00000010:ratio-modei0ee20:seeding-time-secondsi0e16:speed-limit-downd9:speed-Bpsi100000e22:use-global-speed-limiti1e15:use-speed-limiti0ee14:speed-limit-upd9:speed-Bpsi100000e22:use-global-speed-limiti1e15:use-speed-limiti0ee8:uploadedi0ee

将以下几项根据自己的实际需求进行修改即可，修改方式同方法二
> destination  
> dnd  
> name  
> paused  
> priority  
> progress/blocks  
> progress/have  


# 5.注意事项

1. 修改前务必备份好Transmission配置文件夹。
2. 修改前建议关闭Transmission客户端。
3. 建议使用BEncode Editor或者torrent-file-editor这类GUI编辑器进行编辑，其中torrent-file-editor可以直接显示torrent 的info.hash。
4. 步骤3中的resume文本仅可用来修改只包含一个文件的种子，如若torrent文件里包含多个文件，请手动在dnd和priority下增加对应数量的整型(Integer)，赋值为0即可。
5. 务必确保destination和name正确，已经对应的torrent和resume文件的文件名正确。
6. 新添加进Transmission客户端torrent后，生成的resume中progress.time-checked值全为0，与实际情况不符，但不用修改，后边会自动修复的。
7. 基于以上的原理，技术大佬们可以很容易的做出对应的批量脚本，欢迎大佬们。

# 6.扩展说明

关于详尽的resume文件的所有参数的分析，有待下回分解。


## 感谢大家的耐心阅读，转载请注明做作者及来源，DXV5 完成于2019年11月17日.
