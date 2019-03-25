
接上话，在接下来的一段时间里，我将会对以下内容进行一些简单的介绍，我接触Usenet的时间肯定比不过电脑前的各位，有些说错，理解错的，还请大家不吝赐教，供大家参考，以期抛砖引玉。

1. Usenet起源，特点及作用
1. Usenet服务商简单介绍
1. Usenet下载实战之PreDB信息源
1. Usenet下载实战之NZB搜索引擎
1. senet下载实战之下载工具介绍

---

假设你已经有了服务商，可以接入新闻组了，那么我们开始usenet下载实战操作。

usenet下载一般有2种方式，一个是直接搜索文件，另外一个是通过下载.nzb文件。  
最常见的就是通过NZB文件来下载，在usenet的实际下载中离不开NZB文件。.nzb其实是类似于.torrent的一个文件，里边包含了下载地址，它是一个xml格式的文本文件，甚至你可以使用记事本之类的软件打开它看看。有了NZB文件后，你就可以直接在新闻组下载软件中导入nzb文件，就可以开始下载了。

如果你想下载来自scene上的rls，那么在你直接搜索或者寻找nzb文件之前，你还需要去搜索确定scene上有没有这个rls，那个小组的，还想看看它的其他信息，比如nfo,这样的话你就需要到PreDB信息源上来查询来自scene上的rls。  

# 1.PreDB网站
一般常用的PreDB信息源有这几个网站，不是每一个scene的pre都会出现在每一个PREDB网站的，所以多收集几个总是没坏处的
> http://predb.me/  
> https://predb.org/  
> https://pre.corrupt-net.org/  
> https://predb.pw/index.php  
> http://pre.c-burns.co.uk/pre.php  
> https://trace.corrupt-net.org/live.php  
> https://www.srrdb.com/  
> https://www.xrel.to/home.html  
> https://crackwatch.com/  
> https://scenenotice.org/  

# 2.PreDB使用举例  
下边就以DH站点旗下的一个网站https://trace.corrupt-net.org/live.php  为例，
![PreDB使用举例](https://images2.imgbox.com/49/bd/0Rdmm4VG_o.png)  
从图中可以看到DH最快，在TS站pre后的8.16秒就出了种，而紧跟其后的是RTT,pretime 8.91s，比DH慢了0.75s，第三是AR，13.45s,比第一名DH差了5.29s，其他的站点相比大家都会看了。
> Mohawk.Girls.S04E03.720p.HDTV.x264-aAF
> 
> Release Date.....: 2019-03-06
> Video Resolution.: 1280x720
> Video Bitrate....: 2 983 Kbps
> Video Framerate..: 23.976
> Length...........: 00:21:59.968
> Size.............: 540 MiB
> 
> Big Up all scene massive!

也可以在DH或者其他站点的IRC上查询，比如在DH的IRC服务器irc.corrupt-net.org上的#Tracer.Search频道，输入
```
!trace Mohawk.Girls.S04E03.720p.HDTV.x264-aAF
```
可以得到
> [TV-X264] Mohawk.Girls.S04E03.720p.HDTV.x264-aAF [15h 30mi 13s] [W: DH 8.16s AP] [F: RTT AR AL XS FLro TBy TB TL TS IPT]  

我们也同样可以得到上边所知道的信息。

当然了IRC的命令不止一个，还有很多，比如
> 
>  Tracer Commands  
>  !trace [<release>] [type: |group: |lang: |up:] [-pm] - Get races stats for a release.  
>  !tdupe [<release>] [type: |group: |lang: |last:] - Get races stats for last 10 releases.  
>  !mostraced [<release>] [type: |group: |lang: |last:] [-h|-d|-w|-m|-y|-t] [-s]  - Get most raced releases.  
>  !sites - List sites.  
>  !site <site> [release: |type: |group: |lang:] [-s] [-pm] - Get site stats.  
>  !stats [release: |type: |site: |place: |races: |group: |lang: |last:] [-h|-d|-w|-m|-y|-t] [-a|-r|-p] [-s] [-c] [-l] [-pm] - Races stats.  
>  !sitetml Site1 Site2 [SiteX...] [release: |type: |site: |place: |races: |group: |lang:] [-h|-d|-w|-m|-y] [-a|-r|-p] [-s] [-c] [-l] - Timeline stats.  
>  !sitecmp Site1 Site2 [SiteX...] [release: |type: |order: |group: |lang:] [-h|-d|-w|-m|-y|-t] [-s] - Compare sites.  
>  !rank [release: |type: |site: |group: |lang:] [-h|-d|-w|-m|-y|-t] [-s] - Get site ranks calculated based on a number of factors.  
>  !last [x] [release: |type: |site: |group: |lang:] [-s] - Get last x races.  
>  !db - Get DB info.  
>  !alias - View help on creating aliases for these commands.  
>  Groups  
>  release: - Group by release (eg. release:One.Tree.Hill.S07|One.Tree.Hill.S08).  
>  type: - Group by type (eg. type:TV-XVID|TV-X264).  
>  site: - Group by site.  
>  place: - Group by place.  
>  races: - Group by minimum number of races.  
>  group: - Group by release group.  
>  lang: - Group by release language.  
>  order: - Order results by speed, points, races or place.  
>  last: - Trace dupe results limit (max 50).  
>  up: - View the previous result (eg. up:2 previous 2nd result).  
>  *You can negate by using a minus sign in front of a group. (e.g. -lang:de|fr)  
>  Switches  
>  -h|-hour - Limit by Hour.  
>  -d|-day - Limit by Day.  
>  -w|-week - Limit by Week.  
>  -m|-month - Limit by Month.  
>  -y|-year - Limit by Year.  
>  -t|-total - Limit by Total  
>  -a|-average - Limit by average speed.  
>  -r|-races - Limit by total number of races.  
>  -p|-points - Limit by total number of points.  
>  -s|-spam - Include spam releases.  
>  -c|-chart - View stats as a chart.  
>  -l|-link - Get command results link only.  
>  -pm - PM full race results.  
>   

# 3.PreDB网站特色介绍

一般的搜索上边几个网站都可以，现在说一下他们里另有特色的地方。

## 3.1 https://www.srrdb.com/
srrdb这个网站很是强大，它不仅仅是一个PreDB站点，不仅可以看到rls的时间，还可以看到这个rls里包含的具体文件列表，sfv校验文件，rls对应的nfo文件，以及分卷压缩包解压后里边的list，甚至包括一些0day PT上的torrent里不会有的一些补充文件，比如一些scene组在释放出bluray encode却没有放出原盘，他会把原盘的图片发上去，证明自己的确是有原盘，通过原盘压制的；比如https://www.srrdb.com/release/details/10.0.Earthquake.2014.1080p.BluRay.x264-MELiTE  
![IMG](https://www.srrdb.com/download/file/10.0.Earthquake.2014.1080p.BluRay.x264-MELiTE/Proof/m-100earthquake-1080p-proof.jpg)

最最重要的是，srrdb上有大量的人工以及脚本自动上传的.srr和.srs文件，会告诉你是否压缩，哪个版本。这个文件很是强大，可以实现ReScene功能，把已经解压的scene文件逆向打包回去scene的格式，这个可不是看起来的分卷打包那么简单，因为rar在不同时间不同平台不同参数压缩出来的文件几乎不可能有一模一样的CRC值。这细说的话，又是另外的事了。


## 3.2 https://predb.pw/  

这个网站也蛮类似于上边的srrdb，可以显示很多信息，比如nfo文件，sfv文件以及关联的url网址，也会有srr文件信息。

如：https://predb.pw/view.php?id=ZGZKLzYyTDdxemNBM29KSERXWVl4RTRUdVJ0ZExYNXNwMDZhaXlSRTFmRT0=

[SFV高清大图](http://imgbox.com/NmoOKQAH)

![IMG](https://thumbs2.imgbox.com/e6/cc/NmoOKQAH_t.png) 

[NFO高清大图](http://imgbox.com/aoyEIcqj)

![IMG](https://thumbs2.imgbox.com/04/b3/aoyEIcqj_t.png)

## 3.3 http://predb.me/
这个网站没法看trace，可以自定义搜索，只能用来搜索是否有这个rls，可以根据小组查看，会显示体积多大有多少个文件，但不会显示具体的文件列表，另外比较特殊的就是他关联了 https://www.limetorrents.info   和  [url]http://nzbindex.nl[/url]  2个搜索引擎，可以用来搜索bt torrent和usenet上的该资源，也是比较方便。

---

示例链接：

https://www.srrdb.com/release/details/ASTRONEER.Update.v1.0.13-CODEX  
https://predb.pw/view.php?id=L3ljWmh1ZHZ3bmxXNm1TeGpxWnBoaHpmREhacENYNnFiSk5Jc0UrV3diWT0=  
http://predb.me/?search=ASTRONEER.Update.v1.0.13-CODEX  
https://www.limetorrents.info/ASTRONEER-Update-v1-0-13-CODEX-torrent-12403778.html  
http://nzbindex.nl/search/?q=ASTRONEER.Update.v1.0.13-CODEX  