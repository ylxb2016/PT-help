国内PT形势日益严峻，同时随着越来越多人开始科普介绍国外PT的情况，越来越多的人开始花钱租seedbox、开始玩国外PT站点。

不同于国内PT单一的RSS订阅的下载/刷上传方式，国外PT很多都autodl-irssi的下载方式，这是因为国外PT很多都有官方的IRC服务器，有相应的#announce频道会即时公布网站上的新种子，通过autodl-irssi插件可以自动化的识别#announce频道发出来的消息，可以第一时间下载到网站上的种子，实现第一时间下载/刷上传。基于IRC的autodl脚本会很轻松的击败RSS，有些站点这两者之间的时差有15分钟之多（因为RSS属于被动式的公告，且RSS相对而言较耗费服务器资源）。

而多年以来，由于以下几个原因掌握IRC下载的属于少部分人：

1. 国内用户由于语言上的差异，很多人由于中文教程缺乏畏难退缩，
1. 盒子用户大部分都用的基于linux的seedbox，用的基本都是搭建好的或者自行搭建的autodl-irssi和autodl-rutorrent，linux的操作繁琐又吓走了不少人。
1. autodl-irssi和autodl-rutorrent用在Windows上还需要依赖 cygwin的环境，较繁琐。
1. 国内对于版权打击远不及国外严厉，相比盒子用户国内本地用户居多，大部分人以为步骤繁琐不会去研究这类下载方式。


**由此而有这篇介绍，来尽可能详细的解释如何通过IRC来下载，在Windows下实现IRC自动下载PT资源 。**

---

以下，通过5部分来介绍


1. [概念介绍](#一.概念介绍) 
1. [准备工作](#二.准备工作)   
1. [安装步骤](#三.安装步骤)  
1. [配置步骤](#四.配置步骤)   
1. [注意事项](#五.注意事项) 


---

# 一.概念介绍


1. IRC
1. IRSSI
1. ChatZilla
1. Autodl


## 1.IRC  
IRC（Internet Relay Chat的缩写，“因特网中继聊天”）是一种透过网络的即时聊天方式。其主要用于群体聊天，但同样也可以用于个人对个人的聊天。IRC使用的服务器端口有6667（明文传输，如irc://irc.freenode.net）、6697（SSL加密传输，如ircs://irc.freenode.net:6697）等。芬兰人雅尔可·欧伊卡利宁（Jarkko Oikarinen）于1988年8月创造了IRC来取代一个叫做MUT的程序。
IRC因为比较古老，不能像QQ群聊那样有很多功能，不能传图片，不能发表情，不能远程协助，但是通过给频道添加聊天机器人(bot)或者增加插件可以实现很多有趣的功能，远比QQ群强大的多！
IRC就是一款古老而依然活跃的互联网多人聊天平台,由于便于搭建不用受限于第三方平台，所以众多国外PT站点都会有自己的官方IRC频道，方便处理网站相关事宜以及便于用户之间互相沟通，在IRC上沟通自然也不怕类似于腾讯这种服务商去监听聊天记录。  
### 常用IRC客户端


1. **HexChat**支持Windows、Linux、OSX平台，并且开放源代码，免费且使用较为方便，若只用来聊天**强烈推荐**此款软件。
1. **mIRC**曾被认为是Windows操作系统下最受欢迎、应用最广的IRC客户端软件，虽然收费但有破解版，有较多配套脚本。
1. **ChatZilla**是Mozilla浏览器下的IRC客户端程序，基于JavaScript和XUL语言编写的，这个就是本文将要介绍的重点。
1. **Irssi**类UNIX系统下命令行界面的IRC客户端，常常与Screen一起搭配使用，这个就是之前众多盒子用户最常用的autodl-irssi的重要依赖。
1. **WeeChat**也是一款类UNIX系统下的CLI界面的IRC客户端。


有意进一步了解的同学，请看相关学习链接：
> [http://www.irchelp.org/faq/new2irc.html](http://www.irchelp.org/faq/new2irc.html)  
> [https://baike.baidu.com/item/IRC/10410?fr=aladdin](https://baike.baidu.com/item/IRC/10410?fr=aladdin)  
> [https://www.mirc.com/help.html](https://www.mirc.com/help.html)  
> [http://chatzilla.rdmsoft.com/](http://chatzilla.rdmsoft.com/)  
  
## **2.IRSSI**
IRSSI 是一款优秀的命令行下的 IRC 客户端，支持常见的操作系统，包括Windows、Mac OSX，Debian、RHEL等系统。  
Irssi是Timo Sirainen用C语言写的一个文本用户界面的IRC客户端程序，她的发布遵循GPL（GNU General Public License）。  
IRSSI相比有不少读者会熟悉一些，因为绝大部分的盒子用户会用到autodl-irssi，而IRSSI作为一款IRC聊天工具是autodl-irssi必不可缺的组件，autodl-irssi可以透过IRSSI上得IRC消息做出下载torrent种子或者其他操作，而autodl-rutorrent则是rtorrent配合autodl-irssi下载的一个rutorrentWebUI插件。  
可惜的是IRSSI 并没有原生的Windows GUI工具，这也限制了autodl-irssi在Windows下的使用。  
有意进一步了解的同学，请看相关学习链接：  

> [https://cloud.tencent.com/developer/article/1374975](https://cloud.tencent.com/developer/article/1374975)  
> [https://www.cnblogs.com/tsdxdx/p/7291877.html](https://www.cnblogs.com/tsdxdx/p/7291877.html)  
> [https://blog.csdn.net/qq_36561697/article/details/80978645](https://blog.csdn.net/qq_36561697/article/details/80978645)  
> [https://irssi.org/](https://irssi.org/)  
> [https://autodl-community.github.io/autodl-irssi/installation/](https://autodl-community.github.io/autodl-irssi/installation/)  
> [https://github.com/autodl-community/autodl-rutorrent/wiki](https://github.com/autodl-community/autodl-rutorrent/wiki)  
> 

## **3.ChatZilla**
[ChatZilla](http://chatzilla.hacksrus.com/)是一个跨平台的IRC客户端，可作为[独立程序使用](http://chatzilla.rdmsoft.com/xulrunner/)，可作为[SeaMonkey](http://www.seamonkey-project.org/)的内置组件使用，也可作为[Firefox的扩展](https://addons.mozilla.org/en-US/firefox/addon/chatzilla/)。    
ChatZilla程序本身十分轻巧，同时由于它是基于Mozilla网络浏览器，所以ChatZilla是跨平台的，可以支持多操作系统下的使用。ChatZilla支持大部IRC客户端软件的特性，如可以同时连接多个IRC服务器，支持UTF-8等等。ChatZilla支持JavaScript作为脚本语言。 ChatZilla可以作为Firefox,Mozilla,SeaMonkey网络浏览器的插件使用。   
ChatZilla和IRSSI类似，都是IRC聊天客户端，不同的地方在于ChatZilla支持在Windows下使用，可以配合火狐浏览器或者单单独使用，最关键的是有Autodl-Chatzilla插件的支持，可以实现自动下载PT资源 。
 
有意进一步了解的同学，请看相关学习链接：  

> [http://chatzilla.rdmsoft.com/](http://chatzilla.rdmsoft.com/)  
> [http://chatzilla.rdmsoft.com/xulrunner/](http://chatzilla.rdmsoft.com/xulrunner/)  
> **[http://chatzilla.hacksrus.com/faq/](http://chatzilla.hacksrus.com/faq/)**  
> [http://chatzilla.rdmsoft.com/plugins/](http://chatzilla.rdmsoft.com/plugins/)  
> [http://james-ross.co.uk/mozilla/chatzilla/links](http://james-ross.co.uk/mozilla/chatzilla/links)  
> [http://czplugins.mozdev.org/](http://czplugins.mozdev.org/)  
> [http://chatzilla.hacksrus.com/intro](http://chatzilla.hacksrus.com/intro)  
> 

## **4.Autodl**
Autodl是咱们实现自动下载PT资源 的目的，这也是最终的软件，之前的软件都是使用这个自动化工具的前提和依赖。  

autodl工具的目的就是可以通过IRC消息，辅以种子的passkey，authkey等信息，来构造下载torrent的直接链接（Download Link）实现模拟人工下载torrent的效果.  

常用的autodl工具有：  

[autodl-irssi](https://github.com/autodl-community/autodl-irssi)  
[autodl-rutorrent](https://github.com/autodl-community/autodl-rutorrent)  
autodl-chatzilla  [GunsAkimbo/autodl-chatzilla](https://github.com/GunsAkimbo/autodl-chatzilla)和[MangoScango/autodl-chatzilla](https://github.com/MangoScango/autodl-chatzilla)  
[IRC Torrent Auto Downloader](https://sourceforge.net/projects/autodl/)  



---

# **二.准备工作**

**安装Chatzilla ：[ChatZilla 0.9.92 (Windows .zip)](http://chatzilla.rdmsoft.com/xulrunner/download/chatzilla-0.9.92.en-US.win32.zip) 或者[ChatZilla 0.9.92 (安装版)](http://chatzilla.rdmsoft.com/xulrunner/download/chatzilla-0.9.92.en-US.win32.installer.msi) 或者下载[SeaMonkey](http://www.seamonkey-project.org/)以及配套[ChatZilla插件](https://addons.thunderbird.net/seamonkey/downloads/latest/chatzilla/addon-16-latest.xpi?src=search)  
安装Autodl-Chatzilla ：[https://sourceforge.net/projects/autodl-chatzilla/files/latest/download](https://sourceforge.net/projects/autodl-chatzilla/files/latest/download)  
准备好utorrent、qbittorrent、transmission等支持监控文件夹中torrent的BT客户端  
PT站点账号**  

目前支持以下站点，后续也可以到这里[autodl-trackers](https://github.com/autodl-community/autodl-trackers)添加

> AnimeBytes,Anthelion,AtomicHD,Awesome-HD,BaconBits,BeyondHD,BIT-HDTV,BitHUmen,BITLEECHERS,BitMeTV,BrokenStones,BTN,ChronicTracker,CloneBits,DanishBits,Decibelios,DEEPBASSNiNE,Digital-Hive,DK-Scene,Empornium,ExtremeBits,Fano,filelist.ro,FSC,FTN,FunFile,Fuzer,GazelleGames,Gks,goem,HardBay,HD4Free,HDAccess,HD-Bits.ro,HDCenter,HDME.eu,HD-Space,HD-Torrents,Hebits,HoundDawgs,HQBits,Immortalseed,Infinity-T,inPeril,iPlay,IPTorrents,JPopsuki,Karagarga,Kidsbits,Mac-Torrents,Morethan.tv,mutracker,My Anonamouse,MyXZ,nCore,Nebulance,NextGen,NorBits,Nordic Releases,NordicBits,Orpheus,PassThePopcorn,PiSexy,Pixel-HD,PolishSource,PolishTracker,PornBay,PreToMe,PsyTorrents,PTFiles,PTN,PussyTorrents,Reassu.me,Redacted,RevolutionTT,SceneAxx,SceneBits,SceneFZ,SceneHD,SDBits.org,SnatchThat,Sparvar,Sport-Scene,StarBits,SuperBits,SWARM,Takeabyte-Nordic,TGN,TheCafe,TheDVDClub,Torrent Shack,TorrentBytes,TorrentCrate,TorrentDay,Torrentech,TorrentGigs,TorrentLeech,TorrentSeeds,TorrentVault,TranceTraffic,TTi,TTsWeb,TuneTraxx,Tv TORRENTs ro,UHDBits,UKNova,UltimateGamerClub,Waffles,WoP,x264,XSpeeds,32PAGES,AceHD,ACEtorrents,Acid-Lounge,AlphaRatio


---


# **三.安装步骤**
以Chatzilla独立程序安装为例：


**1.** 下载[ChatZilla 0.9.92 (Windows .zip)](http://chatzilla.rdmsoft.com/xulrunner/download/chatzilla-0.9.92.en-US.win32.zip)，并解压，打开里边的chatzilla.exe，（如果是使用SeaMonkey或者火狐浏览器，请安装插件后并找到快捷方式打开）

![[http://imgbox.com/N5Q6NdDr](http://imgbox.com/N5Q6NdDr)](https://images2.imgbox.com/c0/a3/N5Q6NdDr_o.png) 

**2.** 在ChatZilla最底下的命令行中, 输入 `/pref profilePath`
 然后回车. 窗口里就会显示你的ChatZilla 应用的工作路径;这个路径是安装autodl插件的必需品.比如：`C:\Users\Taylor\AppData\Roaming\ChatZilla\Profiles\81h4lln3.default\chatzilla`

![[http://imgbox.com/U8slkZ68](http://imgbox.com/U8slkZ68)](https://images2.imgbox.com/6c/b0/U8slkZ68_o.png) 

**3.** 打开上边的`C:\Users\Taylor\AppData\Roaming\ChatZilla\Profiles\81h4lln3.default\chatzilla`文件夹，打开其中的`scripts`文件夹，将下载下来的`Autodl-Chatzilla` ：[https://sourceforge.net/projects/autodl/files/latest/download](https://sourceforge.net/projects/autodl/files/latest/download)解压到其中，截图如下

![[http://imgbox.com/17ZXqSl7](http://imgbox.com/17ZXqSl7)](https://images2.imgbox.com/62/ae/17ZXqSl7_o.png) 

打开那个scripts下的autodl文件夹里会发现一个文件叫`init.js` ，然后还会有个文件夹file伴随一个`Readme.txt`文件，这里边有英文的安装说明。

![[http://imgbox.com/dOIwuuQx](http://imgbox.com/dOIwuuQx)](https://images2.imgbox.com/dc/5a/dOIwuuQx_o.png) 

**4.** 完全退出ChatZilla,然后重新启动ChatZilla.在 ChatZilla, 如果窗口里有显示`Initializing autodl v2.12` 那么一般就是正确安装了（截图版本偏老了）. 如果你没法看见 Auto Downloader菜单, 那么autodownloader是被关闭了. 输入`/enable-plugin autodl` 重新打开.

![[http://imgbox.com/0zU1lR5O](http://imgbox.com/0zU1lR5O)](https://images2.imgbox.com/50/97/0zU1lR5O_o.png) 

安装完成，接下来就是配置过程了。



---

# **四.配置步骤**

配置分为以下几步

1. 手动添加IRC站点并加入对应的#announce 频道
1. 修改主菜单中Auto Downloader菜单下的trackers选项，将对应站点的passkey，authkey等信息补存进去。
1. 修改主菜单中Auto Downloader菜单下的Filters过滤器选项，可以添加自己的订阅条件。
1. 修改主菜单中Auto Downloader菜单下的Preferences设置选项，设置解析IRC消息后作出的对应动作（action）


接下来以Torrentleech为例进行配置，这里有一个TL官方的英文wiki可以参考[http://wiki.torrentleech.org/doku.php/autodl.irssi](http://wiki.torrentleech.org/doku.php/autodl.irssi)
**1.** 首先通过菜单里的IRC来连接到对应IRC服务器，如图所示。

![[http://imgbox.com/kuUCcI9d](http://imgbox.com/kuUCcI9d)](https://images2.imgbox.com/f5/cf/kuUCcI9d_o.png) 

也可以使用命令行进行连接，使用/server或者 /attach命令来添加你希望连接的站点，然后回车，如 /server irc.torrentleech.org:7011

![[http://imgbox.com/WRTr16Ky](http://imgbox.com/WRTr16Ky)](https://images2.imgbox.com/6f/e1/WRTr16Ky_o.png) 

**2.** 连接到对应得IRC服务器后，我们就需要加入对应的#announce 频道。

对于TL这类PT站点，一般都是需要认证过后才可以加入到#announce 频道及一些其他沟通用的频道。

Chatzilla默认会将你的电脑的用户名作为你的昵称（nick），可以通过点击你的昵称来修改自己的昵称，如图所示，也可以通过/nick MyIRCname 类似的命令来修改昵称，因为有的服务器会验证你的用户名。

![[http://imgbox.com/hNa85l3u](http://imgbox.com/hNa85l3u)](https://images2.imgbox.com/c5/e9/hNa85l3u_o.png) 

第一次进来IRC服务器后，会提示你没有在IRC服务器上注册，此时输入`/msg nickserv register 验证用密码  重置用邮箱`的命令即可注册成功，这样的话，别人就没法占用你的这个IRC的昵称ID了，下次你登录进来的时候输入`/msg NickServ IDENTIFY 验证用密码`即可验证成功，然后你才拥有这个昵称ID的使用权。

![[http://imgbox.com/gFXItWtg](http://imgbox.com/gFXItWtg)](https://images2.imgbox.com/e8/68/gFXItWtg_o.png) 

接下来，我们要加入指定的频道，一般来说可以通过`/join #XXX-announce`这样的命令加入频道，但对于TL你需要输入`/msg TL-Monkey !invite ********`,这样才会通过TL的机器人的认证，被邀请到`#announce 频道`；其中`*****`表示profile页的ditProfile里的IRC Key，如图所示。

![[http://imgbox.com/DE1sgI5z](http://imgbox.com/DE1sgI5z)](https://images2.imgbox.com/a4/2b/DE1sgI5z_o.png) 

**3.** 修改主菜单中Auto Downloader菜单下的trackers选项，将对应站点的passkey，authkey等信息补存进去。
如图所示，Enabled表示已启用该站点，rsskey填入刚才网址即可自动提取，Delay延迟时间就选择5秒或者更多，太快下载种子的话，网站没有反应过来，会导致下载不下载torrent种子，强制HTTPs下载建议勾选上。

![[http://imgbox.com/FzJdtz2d](http://imgbox.com/FzJdtz2d)](https://images2.imgbox.com/93/1b/FzJdtz2d_o.png) 

**4.** 修改主菜单中Auto Downloader菜单下的Filters过滤器选项，可以添加自己的订阅条件。

点击New新建一个过滤条件，Enabled表示启用这个过滤条件，DIsplay name表示过滤条件的别名，Match relesase表示要搜索或订阅的关键词（比如你要第一时间订阅到权利的游戏剧集，你就可以在这里填写关键词），Except releases表示要排除的关键词，Match sites是必选项，这里选择要适配的一个或某几个站点，这里选择tl，下边分别表示最小和最大体积。如果只是为了测试的话，只把Match sites勾选上TL即可，其他留空。

![[http://imgbox.com/vnW0BoTd](http://imgbox.com/vnW0BoTd)](https://images2.imgbox.com/0d/12/vnW0BoTd_o.png) 

想更为精确的控制过滤器的条件，就可以选择旁边的几个选项卡，比如  
TV/Movies，可以更精确的过滤剧集名，季，集，分辨率，编码方式，压制源，发布年份等；  
Music选项卡可以更精确的过滤专辑年份，作曲者，专辑名，音频格式，比特率，媒介，标签，是否scene 0day资源，是否包含抓轨log，是否有cue列表；  
Advanced选项卡可以更精确的过滤资源分类，分类排除，置顶发布者，排除指定发布者，排除站点，最大pretime
而Action选项卡则是设置解析IRC消息后作出的对应动作（action），详细见下边的解释。这里可以根据不同站点配置不同策略或路径，如果留空的话，就会按照下边的配置进行解析操作。  

![[http://imgbox.com/WSlSMazB](http://imgbox.com/WSlSMazB)](https://images2.imgbox.com/64/3a/WSlSMazB_o.png) 
![[http://imgbox.com/67hzCdYt](http://imgbox.com/67hzCdYt)](https://images2.imgbox.com/92/50/67hzCdYt_o.png) 
![[http://imgbox.com/qWWSM2bA](http://imgbox.com/qWWSM2bA)](https://images2.imgbox.com/6a/53/qWWSM2bA_o.png)

**5.** 修改主菜单中Auto Downloader菜单下的Preferences设置选项，设置解析IRC消息后作出的对应动作（action）
Preferences设置选项可以对 Autodl-Chatzilla插件进行综合性的设置，如图所示，

![[http://imgbox.com/LFJLfEVn](http://imgbox.com/LFJLfEVn)](https://images2.imgbox.com/a6/95/LFJLfEVn_o.png) 

General选项卡，可以设置临时下载文件夹，最大保存种子数目，是否保存下载历史，是否下载重复的资源，是否自动更新

![[http://imgbox.com/omIwhwfp](http://imgbox.com/omIwhwfp)](https://images2.imgbox.com/03/f0/omIwhwfp_o.png) 

Action选项卡则是设置解析IRC消息后作出的对应动作（action），目前支持以下5种动作：

- 保种种子到指定的监控文件夹（Save to Watch Folder）
- 通过 utorrent的webui界面进行下载（utorrent WebUI Upload）
- 将种子文件通过ftp上传（FTP Upload）
- 运行指定程序（Run Program）
- 保存到动态文件夹中（Save to Dynamic Folder）


**1.保种种子到指定的监控文件夹（Save to Watch Folder）**

这个功能是最常用的，将torrent监控文件夹路径填入此处即可，并在utorrent等BT客户端的监控文件夹（或者叫“自动载入Torrent于”）填入一样的路径，当有torrent被解析到后，会保存到该文件夹中，而utorrent等客户端会定时的监控这个文件夹，一但有torrent加入，便会加载到utorrent中，完成下载。需要注意的是，这里由于一些bug的原因，部分版本的Windows可能无法通过Browser来选择路径，只能手动输入或者粘贴完整的路径，如`D:\IRC`

![[http://imgbox.com/omIwhwfp](http://imgbox.com/omIwhwfp)](https://images2.imgbox.com/03/f0/omIwhwfp_o.png) 
![[http://imgbox.com/0udiBb16](http://imgbox.com/0udiBb16)](https://images2.imgbox.com/7e/fc/0udiBb16_o.png) 

**2.通过 utorrent的webui界面进行下载（utorrent WebUI Upload）**
此插件对于webui的支持，目前仅仅限于utorrent，需要自行打开utorrent里的webui控制，并在WebUI选项卡中填入IP，端口，用户名和密码。

![[http://imgbox.com/T3bSDrdJ](http://imgbox.com/T3bSDrdJ)](https://images2.imgbox.com/b3/13/T3bSDrdJ_o.png) 

**3.将种子文件通过ftp上传（FTP Upload）**
此插件可以自动将下载下来的torrent文件上传到指定的远程服务器的ftp文件夹中，在FTP选项卡中填土FTP的ip，端口，用户名和密码即可。如果远程的这个文件夹时某个BT客户端的监控文件夹，那么就可以实现自动下载了。

**4.运行指定程序（Run Program）**
Autodl-Chatzilla插件可以在torrent下载完成后根据你的需求加上参数运行运行指定的程序，如这里命令（Command)填入`C:\Program Files (x86)\uTorrent\uTorrent.exe`,在参数（Argument）里填入`$(TorrentPathName)` 也可以实现自动下载文件。

![[http://imgbox.com/mIaN4qjE](http://imgbox.com/mIaN4qjE)](https://images2.imgbox.com/8c/d1/mIaN4qjE_o.png) 

当然了，用处不止这一种，你还可以自己编写脚本或者shell来运行自己的程序，实现更高级别的自定义下载，而这里的参数（Argument）支持以下这些：[https://autodl-community.github.io/autodl-irssi/configuration/actions/#macros](https://autodl-community.github.io/autodl-irssi/configuration/actions/#macros)
```
$(year) - Current year.
$(month) - Current month.
$(day) - Current day.
$(hour) - Current hour.
$(minute) - Current minute.
$(second) - Current second.
$(milli) - Current millisecond.
$(FilterName) - Name of matched filter.
$(Site) - Tracker type from the tracker file.
$(Tracker) - The long tracker name from the tracker file.
$(TrackerShort) - The short tracker name from the tracker file.
$(TorrentPathName) - The path to the .torrent file (unix path if you're using cygwin).
$(WinTorrentPathName) - The windows path to the .torrent file.
$(InfoHash) - The info hash of the torrent file.
$(TYear) - Torrent release year.
$(Name1), $(Artist), $(Show), $(Movie) - Equivalent to the shows/artist value.
$(Name2), $(Album) - Equivalent to the album value.
$(Category)
$(TorrentName)
$(Uploader)
$(TorrentSize)
$(PreTime)
$(TorrentUrl)
$(TorrentSslUrl)
$(Season)
$(Season2) - Two digit season number.
$(Episode)
$(Episode2) - Two digit episode number.
$(Resolution)
$(Source)
$(Encoder)
$(Container)
$(Format)
$(Bitrate)
$(Media)
$(Tags)
$(Scene)
$(ReleaseGroup)
$(Log)
$(Cue)
```

**5.保存到动态文件夹中（Save to Dynamic Folder）**

保存到动态文件夹中（Save to Dynamic Folder）功能指的是将下载的文件依据自己写的参数保存到不同的文件夹中，并不是将torrent种子文件保存到不同的文件夹中。

如图所示，在初始文件夹（Base Folder）中填入一个路径，如`D:\PT\2019`，在动态文件夹（Dynamic Folder Name）中填入参数，参数定义可以参考上边的那个，如这里填入`$(month)$(day)`，

![[http://imgbox.com/rDnjHqwB](http://imgbox.com/rDnjHqwB)](https://images2.imgbox.com/67/da/rDnjHqwB_o.png) 

此时还没有完成，还需要到Programs选项卡中填入`utorrent.exe`的路径以及`rar.exe`的路径，同样需要手动输入，Browser浏览的话可能会报错。

![[http://imgbox.com/iSKRIaxQ](http://imgbox.com/iSKRIaxQ)](https://images2.imgbox.com/f9/1d/iSKRIaxQ_o.png)

这样设置下来后，utorrent会将每天下载的文件保存到对应的日期的文件夹中。



---

**经过以上步骤，已完成下载**

![[http://imgbox.com/Qle702e4](http://imgbox.com/Qle702e4)](https://images2.imgbox.com/0c/3c/Qle702e4_o.png) 


---

# **五.注意事项**

接下来说一些注意事项，或者可能遇到的问题。 

**1.** Chatzilla程序的主菜单里的Preferences设置选项有通用设置也有针对某个IRC服务器，甚至频道的设置，可以试设置是否走代Proxy理，设置启动脚本等，还可以自动输入命令来实现自动通过认证以及加入频道，如图所示。  

![[http://imgbox.com/gTyTUCAq](http://imgbox.com/gTyTUCAq)](https://images2.imgbox.com/36/86/gTyTUCAq_o.png) 

**2.** 自动加入某个IRC服务器有2种方法，一种是在Preferences设置选项有通用设置的list里加入 `/server irc.torrentleech.org:7011`这样类似的命令，还有一种就是点击该IRC服务器选项卡勾选`Open This Network at Startup

![[http://imgbox.com/wWu2n9WX](http://imgbox.com/wWu2n9WX)](https://images2.imgbox.com/3e/28/wWu2n9WX_o.png) 

**3.** Autodl-Chatzilla由于一些bug的原因，部分版本的Windows可能无法通过Browser来选择路径，只能手动输入或者粘贴完整的路径。

**4.** 如果是不使用Chatzilla独立程序，而用SeaMonkey或者火狐浏览器，请安装插件后并找到快捷方式打开。支持SeaMonkey最新版，但不支持火狐浏览器最新版，火狐浏览器最多支持到56版本。

此为火狐浏览器版本插件：https://addons.thunderbird.net/en-us/firefox/addon/chatzilla/?src=hp-dl-mostpopular  

Version 0.9.93
Released Nov. 8, 2016  347.2 KiB
Works with Firefox 38.0 - 56.*, SeaMonkey 2.35 - *

**5.** 步骤其实很简单，只是为了让大家了解的更多一些，才写这么详细。

**感谢大家的耐心阅读，转载请注明做作者及来源，DXV5 完成于2019年7月2日.**

