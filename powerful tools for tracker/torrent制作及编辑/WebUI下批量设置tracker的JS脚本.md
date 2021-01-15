感谢@[Lucien-X](https://github.com/ylxb2016/PT-help/issues/1)  

> 我是在树莓派上安装的deluge，
> 搜索搜到了这个库里的deluge_tracker_rename.py ,
> 无奈树莓派的Python脚本运行环境，配置起来有点麻烦，
> 于是基于对deluge WebUI的逆向工程，
> 写了批量修改Tracker的JS脚本,
> 在 version 1.3.13下测试通过。
> 
> 这个脚本的好处是不需要安装任何依赖，打开控制台用就完事儿了
> 
> ```js
> /*
>   deluge_tracker_batch_rename.js
>   Author: Lucien_X
>   Time: 2019-12-15
>  */
> /* 
>  * 使用方法：
>  * 例如要批量修改Error状态的种子Tracker，
>  * 可以用Chrome打开deluge的webui，
>  * Filters => TrackerHost => Error
>  * 点开之后，在控制台粘贴如下代码，回车执行即可
>  */
> 
> const list = Object.keys(deluge.torrents.torrents);
> const { length } = list;
> list.forEach((v, i) => {
>   setTimeout(() => {
>     const a = [{
>       "tier": 0,
>        // 下面改成你要改成的新Tracker
>       "url": "https://tracker.xxxx.cc/announce.php?passkey=xxxxxxxx"
>     }];
>     deluge.client.core.set_torrent_trackers(v, a);
>     console.log(`${i + 1}/${length}`);
>     if (i + 1 === length) {
>         console.log('All Done!');
>     }
>   }, i * 1000);
> });
> ```

