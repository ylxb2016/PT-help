接上话，
在接下来的一段时间里，我将会对以下内容进行一些简单的介绍，我接触Usenet的时间肯定比不过电脑前的各位，有些说错，理解错的，还请大家不吝赐教，供大家参考，以期抛砖引玉。

1. Usenet起源，特点及作用
1. Usenet服务商简单介绍
1. Usenet下载实战之PreDB信息源
1. Usenet下载实战之NZB搜索引擎
1. Usenet下载实战之下载工具介绍

---

之前介绍了Usenet服务商，PreDB信息源，NZB搜索引擎，也把需要的nzb文件下载下来了，万事俱备，只欠东风————Usenet下载工具

Usenet下载需要要有专门的工具，不是咱们常见的IDM,FDM,迅雷，Aria2等等http或者p2p下载工具，Usenet使用Network News Transfer Protocol (NNTP) 协议，需要有专门的工具去下载。
Usenet下载工具有很多，有免费的也有收费的，有通用也有专属的。
之前或许大家对Usenet为什么需要服务商感到奇怪，这里大家就知道了，Usenet阅读器或者说Usenet下载工具是需要登录账户才可以使用的，你需要在这里填入服务商的地址，账户和密码。

常用的Usenet下载工具有以下这些：  
收费客户端  
newsbin http://www.newsbin.com/freetrial.php   
专用客户端  
GetNZB http://getnzb.com/usenet-newsreader/  

免费客户端  

GrabIt https://www.shemes.com/index.php?p=download  
SABnzbd https://sabnzbd.org/downloads  
NZBGet https://nzbget.net/  
NZBDrive http://www.nzbdrive.com/  
binbar https://bin.bar/download  


以下逐个做个简单的介绍，便于大家选择适合自己的客户端。

# 1.GrabIt  
安装过程直接下一步，一路到底即可。
安装完成后，打开客户端开始配置，点击add server添加服务商，按照服务商给你的服务器网址、端口、账户、密码填入此处完成连接。

![GrabIt](https://images2.imgbox.com/9b/59/G4cli5Vz_o.png)

现在就可以开始订阅了，这个就类似于微信公众号，可以订阅（subscribe）好多新闻组的来离线阅读其中的文章，或者去下载其中的二进制文件，因为每个组里帖子或者标题都有很多，所以订阅的多了的话，需要等待教长一段时间来同步。如下图左侧是已订阅的新闻组，蓝色是同步完列表的小组

![GrabIt-2](https://images2.imgbox.com/30/31/WFAWAr3J_o.png)

其中cn开头的就是一些国内的新闻组，对过去感兴趣的可以去看看，当年国人的一些旧帖。这里双击标题就可以开始下载，也可以使用shift或者ctrl组合键来实现多个选择，就会把这个帖子以.txt的格式下载下来，下载的路径可以从顶部的“Download folder”中看到;下载二进制文件也是一样的道理。另外旁边那个是“Extract Folder”自动解压文件夹，之前说过scene的文件基本都是rar分卷，那么usenet下载客户端一般都可以自动帮你解压到这里，很是方便。想发帖的话，可以点那个Post按钮，但是要绑定自己的邮箱，需要注意的发帖规则。至于更新新闻组，移除新闻组，搜索等等大家一看就会了，就不再赘述。

[![GrabIt-3](https://images2.imgbox.com/01/a0/sA7fvkP0_o.png)](http://imgbox.com/sA7fvkP0)

那么接着我们用之前下载到的codex-astroneer.update.v1.0.13.nzb文件，来下载我们想要的codex-astroneer.update.v1.0.13文件，如下图所示，先切换右侧的标签到Batch，然后点击NZB导入（NZB Import），点击确定后便开始了下载，速度还可以1M/s左右。

PS：也可以将nzb文件关联，这样在资源管理器中双击nzb文件即可开始下载。

[![img](https://images2.imgbox.com/18/85/sSfXBs9f_o.png)](http://imgbox.com/sSfXBs9f)

[![img](https://images2.imgbox.com/b6/06/WIKnrDfw_o.png)](http://imgbox.com/WIKnrDfw)

想看更详细的步骤可以看http://www.ruanyifeng.com/blog/2008/02/newsgroups_the_ultimate_p2p_alternative.html

# 2.NZBGet

https://nzbget.net/  
http://nzbget.net/documentation  
https://github.com/nzbget/nzbget  
不同于GrabIt这个比较传统的新闻阅读器，NZBGet无法阅读新闻组的帖子，只能通过nzb文件来下载二进制文件，但是其功能要强大很多，而且开源在Github上，一直在持续更新。
NZBGet是一个二进制下载程序，它根据nzb文件中给出的信息从Usenet下载文件。

NZBGet是用C ++编写的，以其卓越的性能和效率而闻名。

NZBGet几乎可以在所有设备上运行 - 经典PC，NAS，媒体播放器，SAT接收器，路由器等。提供Windows，macOS，Linux，FreeBSD和Android的预编译二进制程序文件；而对于其他平台，程序可以从源代码编译。

NZBGet提供的是一个WebUI通过浏览器来控制，这意味你可以在局域网内、甚至远程来实现控制。此工具甚是强大，可以限速，可以添加计划任务，可以添加rss订阅，自动检验，自动par2修复自动解压，添加脚本，邮件通知，日志等等，自动化功能很强。

安装完成后，默认会打开127.0.0.1:6789/ 端口可以自行修改，更具体的配置可以看http://nzbget.net/documentation ，
第一步我们先添加服务器地址和账户、密码等信息，记得保存设置。

[![image](https://images2.imgbox.com/8b/f0/5ZazQZDE_o.png)](http://imgbox.com/5ZazQZDE)

然后将之前下载好的nzb文件添加进去，开始下载，

[![image](https://images2.imgbox.com/82/97/h5YCBD3e_o.png)](http://imgbox.com/h5YCBD3e)

下载完成

[![image](https://images2.imgbox.com/bd/99/hEVHIbAw_o.png)](http://imgbox.com/hEVHIbAw)

# 3.SABnzbd  
https://sabnzbd.org/downloads  
https://github.com/sabnzbd/sabnzbd  
https://sabnzbd.org/wiki/    

SABnzbd和上一个NZBGet很类似，也是开源支持，不断更新，但是基于Python编写的，也是只能用来下载，不能查看非二进制文件的帖子。

**==但是其最大的亮点在于，支持中文！强烈建议新手使用这个==**

SABnzbd支持 Windows, macOS, Unix and NAS 等多个系统平台，也是WebUI，通过浏览器来控制，这意味你可以在局域网内、甚至远程来实现控制。此工具可以限速，可以添加计划任务，可以添加rss订阅，自动检验，自动par2修复自动解压，添加脚本，邮件通知，日志等等，自动化功能很强。除此之外还可以和 Sonarr, Sickrage, Radarr,Headphones等这些强大的软件进行配合。

这是SABnzbd的中文界面， http://127.0.0.1:8080/sabnzbd/

[![image](https://images2.imgbox.com/ac/01/2BOPTn3E_o.png)](http://imgbox.com/2BOPTn3E)

这是添加服务器信息和账户，密码

[![image](https://images2.imgbox.com/99/a4/HwyXVmi2_o.png)](http://imgbox.com/HwyXVmi2)


这是添加.nzb文件进行下载

[![image](https://images2.imgbox.com/61/c3/rgZ4W2SQ_o.png)](http://imgbox.com/rgZ4W2SQ)

这是下载完成后的状态界面

[![image](https://images2.imgbox.com/e0/eb/y5RfL0P6_o.png)
](http://imgbox.com/y5RfL0P6)

# 4.NZBDrive

http://www.nzbdrive.com/

NZBDrive是最简单的一个NZB下载客户端，只有下载的功能，没有其他的高级功能，可以和NZBking搜索引擎配合使用。

这是配置界面，很简洁。导入nzb文件

[![image](https://images2.imgbox.com/8f/cf/gmLGpvOV_o.png)](http://imgbox.com/gmLGpvOV)


这是需要注意的一个地方，它默认会在资源管理器添加一个虚拟盘符，我默认是N盘，可以修改。大家如果发现自己电脑多了一个盘符还点不开，不要惊慌。

[![image](https://images2.imgbox.com/84/7b/e1x7KqgH_o.png)](http://imgbox.com/e1x7KqgH)


# 5.BinBar

https://bin.bar/wiki

BinBar也是一个蛮简洁的下载客户端，同样没有阅读帖子的功能，只能下载和搜索。

这是配置服务器和账户，记得确定前点击测试一下。

[![image](https://images2.imgbox.com/c8/c2/bBy4G9dJ_o.png)](http://imgbox.com/bBy4G9dJ)

这是搜索nzb的功能，相比其他搜索引擎还是有些功能不足，无法预览很多信息。

[![image](https://images2.imgbox.com/ba/e7/plW8SGhV_o.png)](http://imgbox.com/plW8SGhV)

nzb文件拖动到页面上，即可打开或者说导入并开始下载。

[![image](https://images2.imgbox.com/56/10/H8etxIHx_o.png)](http://imgbox.com/H8etxIHx)

# 完结


经过几个帖子给大家简单做了一下Usenet新闻组入门介绍，希望对大家有所帮助，多一个资源下载的选择渠道。



2019-3-19 22:36:35  
【欢迎转载，但转载请注意礼节，注明出处和作者】