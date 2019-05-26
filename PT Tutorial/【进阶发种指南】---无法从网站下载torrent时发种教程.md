正常的发种流程是：
- 1.使用utorrent等软件制作种子.torrent文件
- 2.将种子.torrent文件上传到PT站上，并按照PT站要求规范话主副标题及内容
- 3.从PT站下载包含自己专属passkey的.torrent文件
- 4.将下载下来的.torrent文件加载到utorrent等文件中，选择文件对应的路径，勾选跳过校验并点击开始做种

但是，有时由于网络的问题，有不少用户无法完成第三步，也就是无法从PT站下载下来.torrent文件，这样的话就没法正常做种了。

按照以下教程操作后的发种流程是：

- 1.使用dottorrent-gui制作种子.torrent文件
- 2.将种子.torrent文件上传到PT站上，并按照PT站要求规范话主副标题及内容
- 3.将第一步制作得到的.torrent文件加载到utorrent等文件中，选择文件对应的路径，勾选跳过校验并点击开始做种

那么接下来的这个教程，通过直接制作出和第三步下载下来一模一样的种子的方式，来规避网络问题导致的无法下载torrent的问题。



简单来说就是制作或者修改torrent的tracker字段和info.source字段，要实现这个有很多方式。
有兴趣进一步了解的可以看https://github.com/ylxb2016/PT-help 

我们现在用到的是dottorrent-gui这个神器。

- 1.首先下载[dottorrent-gui](https://github.com/kz26/dottorrent-gui)这个神器。
- 2.将dottorrent-gui解压，路径中不要包含中文。
- 3.打开dottorrent-gui.exe，参照下图进行设置或填写

![image](https://images2.imgbox.com/e4/f5/sXRxftKN_o.png)

需要注意的是：  
（1）Input path表示文件路径，如果是单独的文件就勾选“File”，如果是文件夹就勾选“Diretory”  
（2）Tracker URLs这里填入包含你的passkey完整的tracker地址，passkey有2种获取方式一种是在utorrent里点击之前已经在做种中的种子的属性，查看地址；另外一种是手动构造，格式为`https://pter.club/announce.php?passkey=3121321321231212132132`，而这里的passkey可以去这里查看`https://pter.club/usercp.php`  
（3）Source就是这个关键之处了，这里要填入`[pter.club] ＰＴ之友俱乐部`，务必完整填入，这里有个空格，不要遗漏。  
- 4.点击Create，完成制作.torrent文件。  

**再重复一下，此时的发种流程：**

- 1.使用dottorrent-gui制作种子.torrent文件
- 2.将种子.torrent文件上传到PT站上，并按照PT站要求规范话主副标题及内容
- 3.将第一步制作得到的.torrent文件加载到utorrent等文件中，选择文件对应的路径，勾选跳过校验并点击开始做种

==注：第2、3步互换也可以，无所谓前后==

一般来说，tracker可能会提示此种子未注册，那么完成后需要等待一会，等服务器完成此种子的注册或者你可以手动刷新tracker。