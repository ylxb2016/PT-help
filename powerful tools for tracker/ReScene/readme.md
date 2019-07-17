本文题目：**【原创】重建Scene资源 - ReScene工具的使用教程**

之前[介绍PreDB网站](https://github.com/ylxb2016/PT-help/blob/master/PT%20Tutorial/Usenet%E6%96%B0%E9%97%BB%E7%BB%84%E5%85%A5%E9%97%A8%E4%BB%8B%E7%BB%8D/%E3%80%90Usenet%E6%96%B0%E9%97%BB%E7%BB%84%E5%85%A5%E9%97%A8%E4%BB%8B%E7%BB%8D%E3%80%91%20%E4%B8%89.Usenet%E4%B8%8B%E8%BD%BD%E5%AE%9E%E6%88%98%E4%B9%8BPreDB%E4%BF%A1%E6%81%AF%E6%BA%90.md)的时候曾经提起过srrdb这个网站，也提起过ReScene功能，一直搁置没有去写这方面的教程，恰好昨天754问起部分ReScene事宜，回忆了一番，想来还是写出来的号，毕竟自己终究是会忘记的，写出来也便于回忆，更便于有兴趣的人去操作。

下文将对Rescene功能展开介绍，主要是对SrrDB网站上英文教程的一些解释和补存说明以及一些遇到的坑。

---

以下将从以下几点展开说明

1. ReScene适用情况
1. ReScene操作原理
1. 准备工作
1. 各软件作用介绍
1. 操作步骤
1. 注意事项

# 一.ReScene适用情况

Scene流传出来的文件都是有标准的，一般都是rar的分卷压缩包，但是流传到部分PT站点或者公网其他地方，为了便于使用就会选择解压出来，这样对于使用的人无可厚非，毕竟跟方便了。但是对于一些人需要要获取到从scene流传出来的原始模样的格式。

## 1.收藏.

有不少人对于Scene有执念，会选择收藏Scene版本的资源，或者为了补档某些资源，这样的话，就需要把解压出来的比如.ISO等格式重新压缩为原来的rar分卷格式，这时就可以用ReScene来重建nfo,sfv和rar分卷，甚至Sample文件都可以用它恢复！

这也是本篇教程出现的出发点，某收藏scene资源的大佬提出了这个需求。

## 2.辅种/发种.

还有一些人玩一些0day PT站点为了去辅种，在A站点下载到了某资源，想去B站点直接辅种，结果发现A站点的资源是解压过后的格式，这样的话他想辅种就需要得到这个资源的scene原始格式。还有的人玩一些只允许scene格式的站点，为了去发种，就不得不将已解压的文件重构回原来的格式。


# 二.ReScene操作原理

把已经解压的scene文件逆向打包回去scene的格式，这个可不是看起来的分卷打包那么简单，因为rar在不同时间不同平台不同参数压缩出来的文件几乎不可能有一模一样的CRC值。
我们得到的RAR文件的数据可以简单分为两部分：一部分是我们需要的数据，另一部分是创建该RAR文件时的描述性数据（创建日期，属性，使用的rar版本，恢复记录，注释等等）。我们解压后，得到了第一部分就是“我们需要的数据”，第二部分的数据就已经丢失了，所以如果没有备份过之前的那部分数据，是不可能无中生有，复原到scene release的形式的。

举例来说
比如这是一个RAR文件的数据  
`hvfDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDrt `  
其中D的表示存储在RAR文件中的数据。而其他字符表示其他数据块。  
如果我们要解包RAR，这时候就得到了：  
`DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD`

想从下边这个数据直接得到上边的，显然不可能的；但是，如果我们在解压RAR之前对元数据进行了备份，并将其命名为.srr文件，它的数据像这样：  
`hvf`==X==`rt`  
这里的X表示我们解压出来的的数据，其余数块的复制方式与原始文件中的完全相同。现在，如果我们想重新创建一开始的RAR，我们所要做的就是将==X==替换为文件数据（D'），这样我们就复原完成了，得到了一开始的
`hvfDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDrt`

**简单来讲ReScene是基于一个.srr文件进行处理的，这个srr文件是基于scene release文件生成的，srr文件包含了nfo和sfv文件（sfv文件尤其重要，里面包含了重建rar分包所需的源始CRC校验值），srr文件也可以存储一些其他的小文件，便于最后的复原工作。**

==PS:== 可以使用srr命令行工具生成.srr文件，可以上传到[srrDB](https://www.srrdb.com/)网站上，这里也有一些scene爱好者和Usenet用户使用pyScene Auto工具自动大量上传了srr文件。

# 三.准备工作

## 1.Python 2.6, 2.7, or 3 
下载地址：https://www.python.org/downloads/

这个是python环境，必须要安装好并配置好环境变量，安装请自行百度实现。

## 2.pyReScene
 
注：0.4以上版本方可处理压缩的RAR

下载地址：https://bitbucket.org/Gfy/pyrescene/downloads/  
pyReScene-0.7-w32.zip : https://bitbucket.org/Gfy/pyrescene/downloads/pyReScene-0.7-w32.zip  
pyReScene-0.7.zip : https://bitbucket.org/Gfy/pyrescene/downloads/pyReScene-0.7.zip  

==这是主力软件，就是通过这个软件实现ReScene.==

## 3.srrGUI  
http://rescene.wikidot.com/downloads#toc24  
srrGUI v1.2.1   
下载地址：http://rescene.wdfiles.com/local--files/downloads/srrgui-1.2.1.zip

==**这是一个GUI界面工具，便于操作。**==

## 4.所有版本的RAR安装包
下载地址：http://rescene.wikidot.com/rar-versions#toc1  
合集地址：http://www.mediafire.com/?m66l9uyahug5g  

**所有版本的RAR安装包是为了从中提取出不同版本的rar.exe**

## 5.待ReScene的已解压的文件
## 6.对应的srr文件
可以从srrDB网站上下载srr文件


# 四.各软件作用介绍

pyrescene软件里有3个形式的版本，分别是
```
pyReScene-0.7-py3-none-any.whl 这个是pip安装方式用的
pyReScene-0.7.zip 这个是.py脚本形式的，pyReScene-0.7\bin\windows路径下也有.bat格式的（只是个快捷方式）
pyReScene-0.7-w32.zip 这个是经过exe封装的
```
用处什么的基本都一样的，大家根据自己的喜好进行选择。

pyrescene软件里以下这些工具：
```
srr_extract_srs.py  
srr_merge.py  
srr_sort.py  
srs.py  
srs_bad.py  
srs_batch.py  
srs_size.py  
preprardir.py  
pyrescene.py  
retag.py  
srr.py  
```


现在对其中的一些脚本命令行工具做一个简介，便于大家使用。  
根据你选择的以上3个不同版本，这里的命令有可能是srr，srr.py ，srr.exe中的一个，请自行对应  

## 1.srr.py 
用途：主力脚本，用来生成srr文件或者通过srr文件重建scene分卷文件。

用法举例：  
1.生成CatDog_Trainer-FLTDOX对应的fdx-cdtr.rar对应的srr文件，并将fdx-cdtr.nfo存储其中  
```
srr.py fdx-cdtr.nfo.sfv -s fdx-cdtr.nfo
```
2.查看fdx-cdtr.srr里边的列表内容  
```
srr.py fdx-cdtr.srr -l
```
3.通过fdx-cdtr.srr重构CatDog_Trainer-FLTDOX
```
srr.py fdx-cdtr.srr
```

## 2.pyrescene.py  
用途：用来生成srr文件；可以自动生成对应scene release的srr文件。  

用法举例：  
1.将E:\scene\及其子文件夹中的*.sfv对应的scene release生成srr文件，并保存在D:\srrfiles中  
```
pyrescene.py E:\scene\ --best --recursive --output D:\
```


## 3.preprardir.py  
用途：用来从RAR安装包中提取出不同版本的rar.exe ，这样才可以用一模一样的rar去重构scene release  

用法举例：  
1.将Z:\rar\windows文件夹中的WinRAR安装包内的rar提取到C:\pyReScene\rar文件夹中，  
```
preprardir.py -b Z:\rar\windows C:\pyReScene\rar
```
不加-b参数的话，只提取正式版winrar；加-b后会同时提取beta版，建议加-b
WinRAR安装包直接是没法用的，必须将其中的rar.exe提取出来才可以，rar.exe才是关键。  
 
## 4.retag.py  
用途：修复音乐文件的tag信息  
用法举例：  
1.将当前文件夹中的rls.srr对应的音乐文件的tag修复，并输出到D:\rls\  
```
retag.py rls.srr --output D:\rls\
```

## 5.srs.py  
用途：与srr.py类似，用来生成srs文件或者通过srs文件重建scene文件对应的sample文件。  

用法举例：  
1.生成当前文件夹对应sample文件的srs文件，并以上级目录名命名srs文件  
```
srs.py sample.mkv --dd
```
2.查看fdx-cdtr.srs里边的列表内容  
```
srs.py fdx-cdtr.srs -l
```
3.通过sample.srs重构full.mkv对应的sample.mkv   
```
srs.py sample.srr full.mkv
```

## 6.srr_usenet.exe  
用途：通过usenet的nzb文件生成对应的srr文件   

用法举例：  
1.通过rls.nzb生成对应srr文件  
```
srr_usenet.exe  rls.nzb
```


# 五.操作步骤

以下以srrGUI工具为例进行解说，srrGUI调用的也是命令行，也比命令行方便些。
## 1.提取rar.exe文件  
将下载到的WinRAR安装包放到C:\rar\windows文件夹中  
把提取到的rar.exe放到C:\pyReScene\rar文件夹中，  
```
preprardir.py -b C:\rar\windows C:\pyReScene\rar
```
不加-b参数的话，只提取正式版winrar；加-b后会同时提取beta版，建议加-b
WinRAR安装包直接是没法用的，必须将其中的rar.exe提取出来才可以，rar.exe才是关键。  

提取前的安装包是这样的：  

![WinRAR安装包](https://images2.imgbox.com/33/2d/ZlNEZ4iu_o.png)

提取出来的rar.exe是这样的：  

![RAR.exe](https://images2.imgbox.com/84/dd/DwtO4yuS_o.png)

这里有一个已经提取出来的rar.exe合集，大家可以直接使用，如果失效了的话，请大家自行提取。

https://github.com/ylxb2016/PT-help/blob/master/powerful%20tools%20for%20tracker/ReScene/rar_all.7z


## 2.操作srrGUI  
将前边下载到的srrgui-1.2.1.zip和pyReScene-0.7-w32.zip解压到一起；因为srrGUI.exe只是去调用pyReScene-0.7-w32里的那些exe文件。  
然后Select选择`[2]Reconstruct releaseRARs，sample（s） and other files from SRR files`，这个表示从srr文件重构Scene release文件  
`SRR File Path`选择你下载到的对应的srr文件，这里选择为`C:\pyReScene\rls.srr`  
`Input Dir Path`选择你已解压的文件，也就是待ReScene的文件，这里选择为`C:\release\rls.iso`    
`Output Dir Path`选择生成的Scene release文件路径，这里选择为`C:\scene\ReScene\`  
`RAR EXE Dir path`是重中之重，务必要选择对，选择为之前提取出来的rar.exe的文件夹，也就是`C:\pyReScene\rar`  
`emp Files Dir Path`代表临时文件的存储路径，随便写都行，但是为便于清理垃圾，建议写`为C:\pyReScene\temp`  

**最后点击Run Progress即可，在旁边的日志栏里会实时显示，也会显示实际用到的命令行代码，如果出错，你可以手动输入这行代码进行测试。**

具体操作图下图所示：

![srrGUI](https://i.loli.net/2019/07/15/5d2c964b3f3c548462.png)


再来介绍一下srrGUI其他设置的含义

`[1]Created SRR files from release dir(s) `表示生成srr文件  
`[2]Reconstruct releaseRARs，sample（s） and other files from SRR files`，表示从srr文件重构Scene release文件，和`[1]`是相反的操作    
`[3]Fix metadata tags ...`表示通过srr文件修改音乐文件的tag标签  
`[4]List SRR file contents`表示列出SRR文件的列表内容，其实就是之前说的`srr.py fdx-cdtr.srr -l`命令  
`Create directory from SRR file name`表示自动根据SRR文件创建对应的文件夹，请根据个人需求勾选  
`remember settings`表示保存设置，这样一些路径就不用重复输入了  


# 六.注意事项
1. python环境务必配置好，这是前提。
2. 如果python的环境变量没设置好，可以用以下命令行作为权宜之计  
`"D:\Program Files (x86)\Python\python.exe" D:\pyReScene-0.7\bin\preprardir.py -h -b C:\rar\windows C:\pyReScene\rar`
3. WinRAR安装包直接是没法用的，必须将其中的rar.exe提取出来才可以，rar.exe才是关键。

参考链接：

https://bitbucket.org/Gfy/pyrescene/downloads/  
https://bitbucket.org/sticki/pyautorescene  
https://www.d0z.net/archives/184    
http://rescene.wikidot.com/    
http://rescene.wikidot.com/tutorials  
http://rescene.wikidot.com/pyrescene-installation  
http://rescene.wikidot.com/faq  
http://rescene.wikidot.com/downloads  
https://gazellegames.net/wiki.php?action=article&id=374#additional%20information  

ylxb2016  
2019年7月12日  
==转载请注明来源==
