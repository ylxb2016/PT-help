
Hexchat
----------
**hcfishlim.dll ** -> 用来替换HexChat内的fishlim插件，原插件有bug，不支持CBC模式的fish加密

（此版本的keyx发起时仅支持CBC模式，接收时CBC和ECB模式均可）

以下命令均在需要加/解密的私聊窗口或channel内发送，不同于ZNC的用法。

for CBC mode -> `/setkey cbc:key`

for ECB mode -> `/setkey ecb:key`

默认ECB模式 -> `/setkey key`

删除key      -> `/delkey`

私聊交换key  -> `/keyx`

mIRC
----------
https://github.com/flakes/mirc_fish_10
https://syndicode.org/fish_10/

**mirc_fish_10-setup-2020-10-10.exe** 或 **mirc_fish_10-with-ssl-2020-10-10.zip**  -> mIRC的blowfish插件


ZNC
----------
教程：
https://wiki.znc.in/ZNC
https://www.machunjie.com/linux/863.html

ZNC-fish安装

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
