// ==UserScript==
// @name         Pt-search
// @namespace    http://blog.rhilip.info
// @version      20180505
// @description  Pt-search 配套脚本
// @author       Rhilip
// @run-at       document-end
// @include     file:///*/ptsearch.html*
// @include      http://localhost*
// @include      http*://*/ptsearch*
// @updateURL    https://github.com/Rhilip/PT-help/raw/master/docs/js/ptsearch.user.js
// @supportURL   https://github.com/Rhilip/PT-help/issues/2
// @connect      *
// @grant        GM_xmlhttpRequest
// ==/UserScript==

var script_version = '';
if (GM_info && GM_info.script) {
    script_version = GM_info.script.version || script_version;
}

var time_regex = /(\d{4}-\d{2}-\d{2}[^\d]+?\d{2}:\d{2}:\d{2})/;
var time_regen_replace = /-(\d{2})[^\d]+?(\d{2}):/;

/**
 * @return {number}
 */
function FileSizetoLength(size) {
    var _size_raw_match = size.match(/^([\d.]+)[^TGMK]?([TGMK]?i?B)$/);
    if (_size_raw_match) {
        var _size_num = parseFloat(_size_raw_match[1]);
        var _size_type = _size_raw_match[2];
        switch (true) {
            case /Ti?B/.test(_size_type):
                return _size_num * Math.pow(2, 40);
            case /Gi?B/.test(_size_type):
                return _size_num * Math.pow(2, 30);
            case /Mi?B/.test(_size_type):
                return _size_num * Math.pow(2, 20);
            case /Ki?B/.test(_size_type):
                return _size_num * Math.pow(2, 10);
            default:
                return _size_num;
        }
    }
    return size;
}

/**
 * @return {string}
 */
function TimeStampFormatter(data) {
    var unixTimestamp = new Date(data);
    return unixTimestamp.toLocaleString();
}

$(document).ready(function () {
    var table = $("#table");
    if (table) {    // 存在Bootstrap Table
        // 移除Tampermonkey提示，显示隐藏表格
        $("#use-tampermonkey").hide();
        $("#hide-without-tampermonkey").show();
    }

    var search_log = $("#search-log");

    function writelog(text) {
        search_log.append("<li>" + TimeStampFormatter(Date.now()) + " - " + text + "</li>");
    }

    // Begin after click `search` Button
    $("#advsearch").click(function () {
        // Get Search Info
        var search_text = $("#keyword").val().trim();     // Search Text
        var search_site = localStorage.getItem('selected_name').split(',') || [];   // Search Site
        // Get Config
        var config_log = $("#config-log").prop("checked"); // Logging

        if (!$('#config-keep-old').prop('checked')) {
            table.bootstrapTable('removeAll');  // 清空已有表格信息
            search_log.html('');   // 清空原有搜索日志
        }

        function table_append(data) {
            table.bootstrapTable('append', data);
            if (config_log) {
                var _data_str = "";
                for (var i in data) {
                    _data_str += i + ": " + data[i] + "; ";
                }
                writelog(_data_str);
            }
        }

        function Get_Search_Page(site, search_prefix, parser_func) {
            if (search_site.indexOf(site) > -1) {
                writelog("Start Searching in Site " + site + " .");
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: search_prefix.replace("$key$",search_text),
                    onload: function (res) {
                        if (/(login|verify|returnto)[.=]/.test(res.finalUrl)) {
                            writelog("May Not Login in Site " + site + ". With finalUrl: " + res.finalUrl);
                        } else {
                            writelog("Get Search Pages Success in Site " + site + ".");
                            var doc = (new DOMParser()).parseFromString(res.responseText, 'text/html');
                            var body = doc.querySelector("body");
                            var page = $(body); // 构造 jQuery 对象
                            try {
                                parser_func(res, doc, body, page);
                                writelog("End of Search in Site " + site + ".");
                            } catch (error) {
                                writelog("An error occurred when parser in Site " + site + ". With Error information: " + error + ". Please opening a issues to report at https://github.com/Rhilip/PT-help/issues/2");
                            }
                        }
                    },
                    onerror: function (res) {
                        writelog("An error occurred when searching in Site " + site + " .With finalUrl: " + res.finalUrl + ". Your computer may not be able to access this site.");
                    }
                });
            }
        }

        // 通用处理模板，如果默认解析模板可以解析该站点则请不要自建解析方法
        // NexusPHP类站点通用
        function NexusPHP(site, search_prefix, torrent_table_selector) {
            Get_Search_Page(site, search_prefix, function (res, doc, body, page) {
                var url_prefix = /pt\.whu\.edu\.cn|whupt\.net|hudbt\.hust\.edu\.cn/.test(res.finalUrl) ? "" : (res.finalUrl.match(/(https?:\/\/[^\/]+?\/).+/) || ['', ''])[1];
                writelog("Using The normal parser for NexusPHP in Site: " + site);
                if (/没有种子|No [Tt]orrents?|Your search did not match anything|用准确的关键字重试/.test(res.responseText)) {
                    writelog("No any torrent find in Site " + site + ".");
                    return;
                }
                var tr_list = page.find(torrent_table_selector || "table.torrents:last > tbody > tr:gt(0)");
                writelog("Get " + tr_list.length + " records in Site " + site + ".");
                for (var i = 0; i < tr_list.length; i++) {
                    var torrent_data_raw = tr_list.eq(i);
                    var _tag_name = torrent_data_raw.find("a[href*='hit']").first();

                    // 确定日期tag，因用户在站点设置中配置及站点优惠信息的情况的存在，此处dom结构会有不同
                    // 此外多数站点对于 seeders, leechers, completed 没有额外的定位信息，故要依赖于正确的日期tag
                    var _tag_date, _date = "0000-00-00 00:00:00";
                    _tag_date = torrent_data_raw.find("> td").filter(function () {
                        return /(\d{4}-\d{2}-\d{2}[^\d]+?\d{2}:\d{2}:\d{2})|[分时天月年]/.test($(this).html());
                    }).last();
                    if (_tag_date && _tag_date.html()) {
                        _date = (_tag_date.html().match(time_regex) || ["", "0000-00-00 00:00:00"])[1].replace(time_regen_replace, "-$1 $2:");
                    }

                    var _tag_size = _tag_date.next("td");
                    var _tag_seeders = _tag_size.next("td");  // torrent_data_raw.find("a[href$='#seeders']")
                    var _tag_leechers = _tag_seeders.next("td");  // torrent_data_raw.find("a[href$='#leechers']")
                    var _tag_completed = _tag_leechers.next("td");  // torrent_data_raw.find("a[href^='viewsnatches']")

                    table_append({
                        "site": site,
                        "name": _tag_name.attr("title") || _tag_name.text(),
                        "link": url_prefix + _tag_name.attr("href"),
                        "pubdate": Date.parse(_date),
                        "size": FileSizetoLength(_tag_size.text()),
                        "seeders": _tag_seeders.text().replace(',', '') || 0,  // 获取不到正常信息的时候置0
                        "leechers": _tag_leechers.text().replace(',', '') || 0,
                        "completed": _tag_completed.text().replace(',', '') || 0
                    });
                }
            });
        }

        // 特殊站点处理逻辑
        function TTG(site, search_prefix) {  // TTG : https://totheglory.im/
            Get_Search_Page(site, search_prefix, function (res, doc, body, page) {
                var tr_list = page.find("#torrent_table tr.hover_hr");
                writelog("Get " + tr_list.length + " records in Site " + site + ".");
                for (var i = 0; i < tr_list.length; i++) {
                    var torrent_data_raw = tr_list.eq(i);
                    var _tag_name = torrent_data_raw.find("a[href^='/t/']");

                    var _name_match = _tag_name.html().match(/<b>(.+?)<br>/);
                    var _name = _name_match ? _name_match[1] : _tag_name.text();

                    var _tag_date, _date;
                    _tag_date = torrent_data_raw.find("td").filter(function () {
                        return time_regex.test($(this).html());
                    });
                    _date = _tag_date.html().match(time_regex)[1].replace(time_regen_replace, "-$1 $2:");

                    var _tag_size = torrent_data_raw.find("td").filter(function () {
                        return /[kMGT]B$/.test($(this).text());
                    });

                    var _tag_seeders = torrent_data_raw.find("a[href$='toseeders=1']");
                    var _tag_leechers = torrent_data_raw.find("a[href$='todlers=1']");
                    var _tag_completed = _tag_size.next("td");

                    table_append({
                        "site": site,
                        "name": _name,
                        "link": "https://totheglory.im" + _tag_name.attr("href"),
                        "pubdate": Date.parse(_date),
                        "size": FileSizetoLength(_tag_size.text()),
                        "seeders": _tag_seeders.text().replace(',', '') || 0,
                        "leechers": _tag_leechers.text().replace(',', '') || 0,
                        "completed": (_tag_completed.text().match(/\d+/) || ["0"])[0].replace(',', '')
                    });
                }
            });
        }

        function NPU(site, search_prefix) {    // NPUPT : https://npupt.com/
            Get_Search_Page(site, search_prefix, function (res, doc, body, page) {
                var tr_list = page.find("#torrents_table tr");
                for (var i = 1; i < tr_list.length; i += 3) {
                    var torrent_data_raw = tr_list.eq(i);
                    var _tag_name = torrent_data_raw.find("a[href*='hit']");
                    var _tag_date = torrent_data_raw.find("div.small").filter(function () {
                        return time_regex.test($(this).html());
                    });
                    var _date = (_tag_date.html().match(time_regex) || ["", "0000-00-00 00:00:00"] )[1].replace(time_regen_replace, "-$1 $2:");

                    var _tag_size = torrent_data_raw.find("center");

                    table_append({
                        "site": site,
                        "name": _tag_name.attr("title") || _tag_name.text(),
                        "link": "https://npupt.com/" + _tag_name.attr("href"),
                        "pubdate": Date.parse(_date),
                        "size": FileSizetoLength(_tag_size.text()),
                        "seeders": torrent_data_raw.find("span.badge").eq(0).text(),
                        "leechers": torrent_data_raw.find("span.badge").eq(1).text(),
                        "completed": parseInt(torrent_data_raw.find("a[href^='viewsnatches.php?id=']").text()) || 0
                    });
                }
            });
        }

        function ZX(site, search_prefix) {
            Get_Search_Page(site, search_prefix, function (res, doc, body, page) {
                var torrent_list_table = page.find(".torrenttable tr");
                writelog("Get " + torrent_list_table.length + " records in Site ZX.");
                for (var i = 1; i < torrent_list_table.length; i++) {
                    var torrent_data_raw = torrent_list_table.eq(i);

                    var _tag_name = torrent_data_raw.find("a[name='title']");
                    var _tag_size = torrent_data_raw.find("td.r");
                    var _tag_date = _tag_size.next("td").next("td").next("td");
                    var _tag_seeders = _tag_date.next("td");
                    var _tag_leechers = _tag_seeders.next("td");
                    var _tag_completed = _tag_leechers.next("td");

                    // 对这个站点的垃圾时间简写进行标准化
                    var _date, myDate = new Date();
                    var _tag_date_text = _tag_date.text();
                    switch (true) {
                        case /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(_tag_date_text):   // "2017-12-29 22:44"（完整，不需要改动）
                            _date = Date.parse(_tag_date_text);
                            break;
                        case /\d{2}-\d{2} \d{2}:\d{2}/.test(_tag_date_text):   // "01-06 10:05"（当年）
                            _date = Date.parse(myDate.getFullYear() + "-" + _tag_date_text);
                            break;
                        case /\d{2}:\d{2}/.test(_tag_date_text):   // "18:50"（当日）
                            _date = Date.parse(myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate() + " " + _tag_date_text);
                            break;
                    }

                    table_append({
                        "site": site,
                        "name": _tag_name.text(),
                        "link": "http://pt.zhixing.bjtu.edu.cn" + _tag_name.attr("href"),
                        "pubdate": _date,
                        "size": FileSizetoLength(_tag_size.text()),
                        "seeders": _tag_seeders.text().replace(',', ''),
                        "leechers": _tag_leechers.text().replace(',', ''),
                        "completed": _tag_completed.text().replace(',', '')
                    });
                }
            });
        }

        function HDChina(site, search_prefix) {
            Get_Search_Page(site, search_prefix, function (res, doc, body, page) {
                var tr_list = page.find(".torrent_list tr:odd");
                writelog("Get " + tr_list.length + " records in Site HDChina.");
                for (var i = 0; i < tr_list.length; i++) {
                    var torrent_data_raw = tr_list.eq(i);
                    var _tag_name = torrent_data_raw.find("a[href*='hit']");

                    var _date, _tag_date = torrent_data_raw.find(".t_time");
                    if (/[分时天月年]/.test(_tag_date.text())) {
                        _date = _tag_date.children("span").attr("title");
                    } else {
                        _date = _tag_date.text();
                    }

                    var _tag_size = torrent_data_raw.find(".t_size");
                    var _tag_seeders = torrent_data_raw.find(".t_torrents");
                    var _tag_leechers = torrent_data_raw.find(".t_leech");
                    var _tag_completed = torrent_data_raw.find(".t_completed");

                    table_append({
                        "site": site,
                        "name": _tag_name.attr("title") || _tag_name.text(),
                        "link": "https://hdchina.org/" + _tag_name.attr("href"),
                        "pubdate": Date.parse(_date),
                        "size": FileSizetoLength(_tag_size.text()),
                        "seeders": _tag_seeders.text().replace(',', ''),
                        "leechers": _tag_leechers.text().replace(',', ''),
                        "completed": _tag_completed.text().replace(',', '')
                    });
                }
            });
        }

        function HDCity(site, search_prefix) {
            Get_Search_Page(site, search_prefix, function (res, doc, body, page) {
                var tr_list = page.find("div[class^='text'][style='line-height:1rem;']");
                writelog("Get " + tr_list.length + " records in Site HDCity.");
                for (var i = 0; i < tr_list.length; i++) {
                    var torrent_data_raw = tr_list.eq(i);
                    var _tag_name = torrent_data_raw.find("a[href*='t-']");

                    var _date, _tag_date;
                    _tag_date = torrent_data_raw.find("div").filter(function () {
                        return time_regex.test($(this).text());
                    }).last();
                    _date = _tag_date.text();

                    var _tag_size = _tag_name.parent("div");
                    var _tag_seeders = torrent_data_raw.find("a[href$='#seeders']");
                    var _tag_leechers = torrent_data_raw.find("a[href$='#leechers']");
                    var _tag_completed = torrent_data_raw.find("a[href^='viewsnatches']");

                    var _size = _tag_size.text().match(/\[([.\d]+? [KMGT]B)/)[1];

                    table_append({
                        "site": site,
                        "name": _tag_name.text(),
                        "link": "https://hdcity.work/" + _tag_name.attr("href"),
                        "pubdate": Date.parse(_date),
                        "size": FileSizetoLength(_size),
                        "seeders": _tag_seeders.text().replace(',', '') || 0,
                        "leechers": _tag_leechers.text().replace(',', '') || 0,
                        "completed": _tag_completed.text().replace(',', '') || 0
                    });
                }
            });
        }

        function HDStreet(site, search_prefix) {
            Get_Search_Page(site, search_prefix, function (res, doc, body, page) {
                // 继承自蚂蚁的使用大量colspan,rowspan的表格处理
                var tr_list = page.find(".torrents > tbody > tr:gt(1)");    // 前两行都是表题栏，不要
                writelog("Get " + tr_list.length / 2 + " records in Site HDStreet.");
                for (var i = 0; i < tr_list.length; i += 2) {    // 每两行数据组成一个种子资源的完整信息
                    var torrent_data_raw_1 = tr_list.eq(i);
                    var torrent_data_raw_2 = tr_list.eq(i + 1);
                    var _tag_name = torrent_data_raw_1.find("a[href$='hit=1']");

                    // 确定日期tag，因用户在站点设置中配置及站点优惠信息的情况的存在，此处dom结构会有不同
                    // 此外多数站点对于 seeders, leechers, completed 没有额外的定位信息，故要依赖于正确的日期tag
                    var _tag_date, _date;
                    _tag_date = torrent_data_raw_2.find("span").filter(function () {
                        return time_regex.test($(this).attr("title"));
                    }).last().parent("td");
                    if (/[分时天月年]/.test(_tag_date.text())) {
                        _date = _tag_date.children("span").attr("title");
                    } else {
                        _tag_date = torrent_data_raw_2.find("td").filter(function () {
                            return time_regex.test($(this).text());
                        }).last();
                        _date = _tag_date.text().match(time_regex)[1].replace(/-(\d{2}) ?(\d{2}):/, "-$1 $2:");
                    }

                    var _tag_size = _tag_date.next("td");
                    var _tag_seeders = torrent_data_raw_1.find("a[href$='#seeders']");
                    var _tag_leechers = torrent_data_raw_1.find("a[href$='#leechers']");
                    var _tag_completed = torrent_data_raw_1.find("a[href^='viewsnatches.php']");

                    table_append({
                        "site": site,
                        "name": _tag_name.attr("title") || _tag_name.text(),
                        "link": "http://hdstreet.club/" + _tag_name.attr("href"),
                        "pubdate": Date.parse(_date),
                        "size": FileSizetoLength(_tag_size.text()),
                        "seeders": _tag_seeders.text().replace(',', '') || 0,
                        "leechers": _tag_leechers.text().replace(',', '') || 0,
                        "completed": _tag_completed.text().replace(',', '') || 0
                    });
                }
            });
        }

        function HDRoute(site, search_prefix) {
            // TODO 注意HDR的未进行测试，不可用
            Get_Search_Page(site, search_prefix, function (res, doc) {
                var tr_list = doc.querySelectorAll("dl[id^='dl_torrent']");  // 所有种子均在id开头为dl_torrent的dl标签下
                writelog("Get " + tr_list.length + " records in Site HDRoute.");
                for (var i = 0; i < tr_list.length; i++) {   // 遍历记录
                    var torrent_data_raw = tr_list[i];
                    // 获取种子标题名
                    var _tag_torrent_title = torrent_data_raw.querySelector("div.torrent_title");
                    var _title_chs = _tag_torrent_title.querySelector("p.title_chs").textContent;
                    var _title_eng = _tag_torrent_title.querySelector("p.title_eng").textContent;

                    var _date = torrent_data_raw.querySelector("div.torrent_added").innerHTML
                        .match(/(\d{4}-\d{2}-\d{2}[^\d]+?\d{2}:\d{2}:\d{2})/)[1]
                        .replace(/-(\d{2})[^\d]+?(\d{2}):/, "-$1 $2:");

                    var _size = torrent_data_raw.querySelector("div.torrent_size").textContent;
                    var _seeders = "0";
                    var _leechers = "0";
                    var _seeders_selector = torrent_data_raw.querySelectorAll("a[href*='list_peers']")[0];
                    var _leechers_selector = torrent_data_raw.querySelectorAll("a[href*='list_peers']")[1];
                    if (_seeders_selector) {
                        _seeders = _seeders_selector.textContent;
                    }
                    if (_leechers_selector) {
                        _leechers = _leechers_selector.textContent;
                    }

                    table_append({
                        "site": site,
                        "name": _title_chs + (_title_eng ? (" | " + _title_eng) : ""),
                        "link": "http://hdroute.org/" + torrent_data_raw.querySelector("div.torrent_detail_icon > a").getAttribute("href"),
                        "pubdate": Date.parse(_date),
                        "size": FileSizetoLength(_size),
                        "seeders": _seeders.replace(',', '').replace("---", "0") || 0,  // 出现 `---`表示无数据
                        "leechers": _leechers.replace(',', '').replace("---", "0") || 0,
                        "completed": 0 // 搜索页不显示完成人数
                    });
                }
            });
        }

        function CCFBits(site, search_prefix) {
            Get_Search_Page(site, search_prefix, function (res, doc, body, page) {
                var url_prefix = "http://ccfbits.org/";
                if (/没有找到匹配种子!/.test(res.responseText)) {
                    writelog("No any torrent find in Site " + site + ".");
                    return;
                }
                var tr_list = page.find("table.mainouter > tbody > tr:nth-child(2) > td > table:last > tbody> tr:gt(0)");
                writelog("Get " + tr_list.length + " records in Site " + site + ".");
                for (var i = 0; i < tr_list.length; i++) {
                    var torrent_data_raw = tr_list.eq(i);
                    var _tag_name = torrent_data_raw.find("a[href*='hit']");

                    // 确定日期tag，因用户在站点设置中配置及站点优惠信息的情况的存在，此处dom结构会有不同
                    // 此外多数站点对于 seeders, leechers, completed 没有额外的定位信息，故要依赖于正确的日期tag
                    var _tag_date, _date = "0000-00-00 00:00:00";
                    _tag_date = torrent_data_raw.find("> td").filter(function () {
                        return time_regex.test($(this).html());
                    }).last();
                    if (_tag_date && _tag_date.html()) {
                        _date = (_tag_date.html().match(time_regex) || ["", "0000-00-00 00:00:00"])[1].replace(time_regen_replace, "-$1 $2:");
                    }

                    var _tag_seeders = torrent_data_raw.find("a[href$='toseeders=1']");  // torrent_data_raw.find("a[href$='#seeders']")
                    var _tag_leechers = torrent_data_raw.find("a[href$='todlers=1']");  // torrent_data_raw.find("a[href$='#leechers']")
                    var _tag_completed = torrent_data_raw.find("a[href^='snatches']");  // torrent_data_raw.find("a[href^='viewsnatches']")

                    var _tag_completed_size = _tag_completed.parent("td");
                    var _size = (_tag_completed_size.text().match(/^[\d.]+ [kMG]B/) || ["0 GB"])[0];

                    table_append({
                        "site": site,
                        "name": _tag_name.attr("title") || _tag_name.text(),
                        "link": url_prefix + _tag_name.attr("href"),
                        "pubdate": Date.parse(_date),
                        "size": FileSizetoLength(_size),
                        "seeders": _tag_seeders.text().replace(',', '') || 0,  // 获取不到正常信息的时候置0
                        "leechers": _tag_leechers.text().replace(',', '') || 0,
                        "completed": _tag_completed.text().replace(',', '').replace("次", "").trim() || 0
                    });
                }
            });

        }

        // 开始各站点遍历
        writelog("Script Version: " + script_version + ", Choose Site List: " + search_site.toString() + ", With Search Keywords: " + search_text);
        // 教育网通用模板解析
        NexusPHP("BYR", "https://bt.byr.cn/torrents.php?search=$key$");
        NexusPHP("WHU", "https://pt.whu.edu.cn/torrents.php?search=$key$");
        NexusPHP("NWSUAF6", "https://pt.nwsuaf6.edu.cn/torrents.php?search=$key$");
        NexusPHP("XAUAT6", "http://pt.xauat6.edu.cn/torrents.php?search=$key$");
        NexusPHP("NYPT", "http://nanyangpt.com/torrents.php?search=$key$");
        NexusPHP("SJTU", "https://pt.sjtu.edu.cn/torrents.php?search=$key$");
        NexusPHP("HUDBT", "https://hudbt.hust.edu.cn/torrents.php?search=$key$");
        NexusPHP("TJUPT", "https://tjupt.org/torrents.php?search=$key$");

        // 教育网不能使用通用NexusPHP解析的站点
        NPU("NPU", "https://npupt.com/torrents.php?search=$key$");
        ZX("ZX", "http://pt.zhixing.bjtu.edu.cn/search/x$key$");
        // NexusPHP("CUGB", "http://pt.cugb.edu.cn/torrents.php?search=");

        // 公网通用模板解析
        NexusPHP("HDSKY", "https://hdsky.me/torrents.php?search=$key$");
        NexusPHP("Hyperay", "https://www.hyperay.org/torrents.php?search=$key$");
        NexusPHP("HDHome", "https://hdhome.org/torrents.php?search=$key$");
        NexusPHP("HDHome(Live)", "https://hdhome.org/live.php?search=$key$");
        NexusPHP("HDTime", "https://hdtime.org/torrents.php?search=$key$");
        NexusPHP("HDU", "https://pt.hdupt.com/torrents.php?search=$key$");
        NexusPHP("JoyHD", "https://www.joyhd.net/torrents.php?search=$key$");
        NexusPHP("CHDBits", "https://chdbits.co/torrents.php?search=$key$");
        NexusPHP("Ourbits", "https://ourbits.club/torrents.php?search=$key$");
        NexusPHP("OpenCD", "https://open.cd/torrents.php?search=$key$");
        NexusPHP("KeepFrds", "https://pt.keepfrds.com/torrents.php?search=$key$");
        NexusPHP("TCCF", "https://et8.org/torrents.php?search=$key$");
        NexusPHP("U2", "https://u2.dmhy.org/torrents.php?search=$key$");
        NexusPHP("CMCT", "https://hdcmct.org/torrents.php?search=$key$");
        NexusPHP("MTeam", "https://tp.m-team.cc/torrents.php?search=$key$");
        NexusPHP("MTeam(Adult)", "https://tp.m-team.cc/adult.php?search=$key$");
        NexusPHP("GZTown", "https://pt.gztown.net/torrents.php?search=$key$");
        NexusPHP("HD4FANS", "https://pt.hd4fans.org/torrents.php?search=$key$");
        NexusPHP("TLFBits", "http://pt.eastgame.org/torrents.php?search=$key$");
        NexusPHP("BTSCHOOL", "http://pt.btschool.net/torrents.php?search=$key$");

        // 公网不能使用通用NexusPHP解析的站点
        HDChina("HDChina", "https://hdchina.org/torrents.php?search=$key$");
        TTG("TTG(Media)", "https://totheglory.im/browse.php?c=M&search_field=$key$");
        TTG("TTG(Gamez)", "https://totheglory.im/browse.php?c=G&search_field=$key$");

        HDCity("HDCity", "https://hdcity.work/pt?iwannaseethis=$key$");
        HDStreet("HDStreet", "http://hdstreet.club/torrents.php?search=$key$");
        HDRoute("HDRoute", "http://hdroute.org/browse.php?s=$key$&dp=0&add=0&action=s&or=1&imdb=");
        CCFBits("CCFBits", "http://ccfbits.org/browse.php?search=$key$");

        // 外网站点

        // BT站点

        // TODO DMHY
        // TODO RARGB
        // TODO Nyaa
        // TODO Nyaa(sukebei)

        // 自定义站点请添加到此处


    });
});