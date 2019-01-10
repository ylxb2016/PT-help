https://github.com/utdemir/bencoder  
https://github.com/rndusr/torf  
https://torf.readthedocs.io/index.html  
以bencoder为例进行演示  
`pip3 install bencoder`
```
import bencoder
f = open("2.torrent","rb") #读入文件
d = bencoder.decode(f.read()) #赋值
del d[b"comment"] #删除字段
d[b'created']=b'test' #添加字段并赋值
from pprint import pprint
pprint(d)
f = open("2.torrent","wb") #以写入权限打开文件
f.write(bencoder.encode(d)) #写入文件
exit()
```
