- [# Hexchat](#-hexchat)
- [# mIRC](#-mirc)
- [# ZNC](#-znc)
  - [教程：](#教程)
  - [ZNC-fish安装](#znc-fish安装)
  - [关于ZNC的CBC](#关于znc的cbc)
  - [如何支持**CBC+ECB**混合加密 ##](#如何支持cbcecb混合加密-)
# Hexchat #
----------
**hcfishlim.dl** -> 用来替换HexChat内的fishlim插件，原插件有bug，不支持CBC模式的fish加密

（此版本的keyx发起时仅支持CBC模式，接收时CBC和ECB模式均可）

以下命令均在需要加/解密的私聊窗口或channel内发送，不同于ZNC的用法。

for CBC mode -> `/setkey cbc:key`

for ECB mode -> `/setkey ecb:key`

默认ECB模式 -> `/setkey key`

删除key      -> `/delkey`

私聊交换key  -> `/keyx`

# mIRC #
----------
https://github.com/flakes/mirc_fish_10
https://syndicode.org/fish_10/

**mirc_fish_10-setup-2020-10-10.exe** 或 **mirc_fish_10-with-ssl-2020-10-10.zip**  -> mIRC的blowfish插件


# ZNC #
----------
## 教程： ##
https://wiki.znc.in/ZNC
https://www.machunjie.com/linux/863.html

## ZNC-fish安装 ##

    wget https://gist.github.com/v4lli/ee4edd99128e7cb518ebad548cab7a41

    znc-buildmod fish.cpp

    mkdir -p ~/.znc/modules/

    cp fish.so ~/.znc/modules/



IRC客户端连接ZNC后，在IRC客户端内输入以下命令载入插件

    /msg *status loadmod fish

    /msg *fish Help

fish的语法 https://github.com/dctrwatson/znc-fish

**fish.cpp** -> 来自上述[gist](https://gist.github.com/v4lli/ee4edd99128e7cb518ebad548cab7a41),用来安装ZNC的fish加密插件。
仅支持ECB模式，不支持CBC模式。


## 关于ZNC的CBC ##

https://github.com/znc/znc/issues/1532

https://github.com/znc/znc/issues/1576

ZNC的`*crypt`和`*fish`存在某种意义上的冲突，`*crypt`是内置的插件且`*crypt`的优先级更高。
比如`*crypt`和`*fish`都有keyx功能，这个功能会打架，可能导致"无法"正常使用keyx。

`*crypt` 不解密ecb的内容，只解密cbc的内容
`*fish `不解密cbc的内容，只解密ecb的内容

有的channel里既有ecb加密又有cbc加密，导致无法单独使用ZNC的`*crypt`或`*fish`。遇到这种情况，要么使用mIRC或者Hexchat这种既支持CBC又支持ECB的fish插件，要么就需要一定的技巧来使用ZNC的`*crypt`和`*fish`。


## 如何支持**CBC+ECB**混合加密 ##  

ecb的内容，一般为`+OK`的前缀；  
cbc的内容，一般为`+OK *`前缀或丢失前缀（若想手动解密，则需补回`+OK *`前缀）。  

基于不同前缀的识别，经过观察可以发现：  
`*crypt` 不解密ecb的内容，只解密cbc的内容  
`*fish` 不解密cbc的内容，只解密ecb的内容  

所以，拿同一个key在`*crypt`和`*fish` 分别设置一次setkey即可  
`/msg *fish setkey #channel 123456789`  
`/msg *crypt setkey #channel 123456789`  

这样的话，就可以读取cbc和ecb混合加密的信息了，但是这样的情况不便于发出消息：  

> 发出消息的会是cbc+ecb双重加密后的消息，即A会被`*crypt`使用cbc模式加密一次成为B，然后B将会被`*fish`再使用ecb模式二次加密成为C，这样的话他人的irc收到消息后，一般只会被其中的ecb插件解密为B或B'，其无法直接看到A（若想由B或B'解密为A，还得手动解密cbc，比如再转发一次消息）。  


需要开2个znc窗口(network)，  
窗口1，nick1，同时开启`*crypt`和`*fish`，用来阅读ecb+cbc消息  
窗口2，nick2，只开启`*fish`，用来发送ecb消息（也可以阅读ecb消息）  