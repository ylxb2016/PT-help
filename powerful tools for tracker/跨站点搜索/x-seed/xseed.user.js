// ==UserScript==
// @name         xseed
// @author       enigmaz
// @run-at       document-end
// @include      http://localhost*
// @include      http*://*/x-seed*
// @include     file:///*/x-seed.html*
// @connect      *
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// ==/UserScript==

/* global GM_xmlhttpRequest, $ */
'use strict'

class Site {
  constructor (name, urlBase, custom = {}) {
    this.name = name
    this.urlBase = urlBase
    this.custom = deepAssign({
      path: {
        torrents: 'torrents.php',
        index: 'index.php',
        login: 'login.php'
      },
      api: {
        torrents: false,
        userInfo: false
      },
      reg: {
        date: /(\d{4}-\d{2}-\d{2})[^\d]+?(\d{2}:\d{2}:\d{2})/,
        matchNothing: /没有种子/,
        userClass: /class="([a-zA-Z]+)_Name"/,
        bonus: /魔[^\d]+(\d{1,3}(,\d{3})*(\.\d+)?)/,
        ratio: /分享[^\d]+(\d+(\.\d+)?)/,
        upload: /上[^\d]+(\d+\.\d+[^TGMK]*?[TGMK]?B)/,
        download: /下[^\d]+(\d+\.\d+[^TGMK]*?[TGMK]?B)/,
        activeUp: /活[^\d]+(\d+)[^\d]+\d+/,
        activeDown: /活[^\d]+\d+[^\d]+(\d+)/
      },
      selector: {
        torrentTable: 'table.torrents:last > tbody > tr:gt(0)',
        torrentTableCells: '> td',
        title: 'a[href*=\'hit\']',
        link: 'a[href*=\'hit\']',
        user: 'a[href*=\'userdetail\']',
        userInfo: '.medium'
      },
      search: {
        key: 'search',
        default: {}
      },
      torrentTdMap: {
        title: 1,
        link: 1,
        pubdate: 3,
        size: 4,
        seeders: 5,
        leechers: 6,
        completed: 7
      }
    }, custom)
  }

  search (keywords, cb) {
    let params = Object.assign({}, this.custom.search.default)
    params[this.custom.search.key] = keywords
    this._request(this.custom.path.torrents, params, this._parseTorrentList,
      this.custom.api.torrents, cb)
  }

  getUserStatistics (cb) {
    this._request(this.custom.path.index, {}, this._parseUserStatistics,
      this.custom.api.userInfo, cb)
  }

  _request (path, params, parse, api, cb) {
    let self = this
    let url = new URL(path, this.urlBase)
    let urlParams = new URLSearchParams(params)
    url.search = urlParams
    GM_xmlhttpRequest({
      method: 'GET',
      url: url.toString(),
      onload: (res) => {
        if (res.finalUrl.search(this.custom.path.login) === -1) {
          let doc = api
            ? JSON.parse(res.responseText)
            : $((new DOMParser()).parseFromString(res.responseText, 'text/html'))
          parse(self, doc, cb)
        } else {
          throw new Error('SiteUnlogin')
        }
      },
      onerror: (res) => {
        throw new Error('GM_xmlhttpRequestError')
      }
    })
  }

  _parseTorrentList (self, doc, cb) {
    let custom = self.custom
    if (custom.reg.matchNothing.test(doc.html())) {
      let data = false
      cb(data)
    } else {
      let torrentTable = doc.find(custom.selector.torrentTable)
      for (let i = 0; i < torrentTable.length; i++) {
        let row = torrentTable.eq(i)
        let cells = row.find(custom.selector.torrentTableCells)

        let title = self._parseTorrentTitle(custom, cells.eq(custom.torrentTdMap.title))
        let link = self._parseTorrentLink(custom, cells.eq(custom.torrentTdMap.link))
        let pubdate = self._parseTorrentPubdate(custom, cells.eq(custom.torrentTdMap.pubdate))
        let size = self._parseTorrentSize(custom, cells.eq(custom.torrentTdMap.size))
        let seeders = self._parseTorrentSeeders(custom, cells.eq(custom.torrentTdMap.seeders))
        let leechers = self._parseTorrentLeechers(custom, cells.eq(custom.torrentTdMap.leechers))
        let completed = self._parseTorrentCompleted(custom, cells.eq(custom.torrentTdMap.completed))

        let tableData = { title, link, pubdate, size, seeders, leechers, completed }
        cb(tableData)
      }
    }
  }

  _parseTorrentTitle (custom, cell) {
    let title = cell.find(custom.selector.title)
    return title.attr('title') || title.text()
  }
  _parseTorrentLink (custom, cell) {
    return cell.find(custom.selector.link).attr('href')
  }
  _parseTorrentPubdate (custom, cell) {
    let match = cell.html().match(custom.reg.date)
    return Date.parse(match[1] + ' ' + match[2])
  }
  _parseTorrentSize (custom, cell) { return parseSize(cell.text()) }
  _parseTorrentSeeders (custom, cell) { return parseInt(cell.text()) }
  _parseTorrentLeechers (custom, cell) { return parseInt(cell.text()) }
  _parseTorrentCompleted (custom, cell) { return parseInt(cell.text()) }

  _parseUserStatistics (self, doc, cb) {
    let custom = self.custom

    let userID = doc.find(custom.selector.user).first().text()
    let userInfo = doc.find(custom.selector.userInfo).first()
    let infoText = userInfo.text()
    let infoHTML = userInfo.html()

    let userClassMatch = infoHTML.match(custom.reg.userClass)
    let userClass = userClassMatch ? userClassMatch[1] : '-'
    let bonusMatch = infoText.match(custom.reg.bonus)
    let bonus = bonusMatch ? bonusMatch[1].replace(/,/g, '') : null
    let ratioMatch = infoText.match(custom.reg.ratio)
    let ratio = ratioMatch ? ratioMatch[1].replace(/,/g, '') : null
    let uploadMatch = infoText.match(custom.reg.upload)
    let upload = uploadMatch ? uploadMatch[1] : null
    let downloadMatch = infoText.match(custom.reg.download)
    let download = downloadMatch ? downloadMatch[1] : null
    let activeUpMatch = infoText.match(custom.reg.activeUp)
    let activeUp = activeUpMatch ? activeUpMatch[1] : null
    let activeDownMatch = infoText.match(custom.reg.activeDown)
    let activeDown = activeDownMatch ? activeDownMatch[1] : null

    let data = {
      id: userID,
      class: userClass,
      bonus: parseFloat(bonus),
      ratio: parseFloat(ratio),
      upload: parseSize(upload),
      download: parseSize(download),
      up: parseInt(activeUp),
      down: parseInt(activeDown)
    }
    cb(data)
  }
}

class TTG extends Site {
  constructor (name, urlBase) {
    super(name, urlBase, {
      path: { torrents: 'browse.php' },
      search: { key: 'search_field', default: { c: 'M' } },
      reg: {
        matchNothing: /没找到任何内容/,
        bonus: /积分[^\d]+(\d+(\.\d+)?)/
      },
      selector: {
        torrentTable: 'table#torrent_table > tbody > tr:gt(0)',
        title: 'a[href*=\'/t/\']',
        link: 'a[href*=\'/t/\']',
        userInfo: 'td.bottom'
      },
      torrentTdMap: { pubdate: 4, size: 6, seeders: 8, leechers: 8 }
    })
  }
  _parseTorrentTitle (custom, cell) {
    return cell.find(custom.selector.title).html().match(/<b>([\S\s]+?)</)[1]
  }
  _parseTorrentSeeders (custom, cell) {
    return parseInt(cell.text().match(/(\d+)[^\d]+(\d+)/)[1])
  }
  _parseTorrentLeechers (custom, cell) {
    return parseInt(cell.text().match(/(\d+)[^\d]+(\d+)/)[2])
  }
  _parseTorrentCompleted (custom, cell) {
    return parseInt(cell.text().match(/(\d+)次/)[1])
  }
}

class HDR extends Site {
  constructor (name, urlBase) {
    super(name, urlBase, {
      path: { torrents: 'browse.php' },
      search: { key: 's', default: { action: 's' } },
      reg: { matchNothing: /没有您搜索的相关结果/ },
      selector: {
        torrentTable: 'div#torrent-list dl',
        torrentTableCells: 'div',
        title: 'p.title_eng',
        link: 'a[href*=\'details\']',
        userInfo: 'div.fr.headerRightInfo'
      },
      torrentTdMap: {
        title: 5,
        link: 27,
        pubdate: 14,
        size: 13,
        seeders: 16,
        leechers: 17,
        completed: 0
      }
    })
  }
  _parseTorrentCompleted (custom, cell) { return 0 }
}

class PTP extends Site {
  constructor (name, urlBase) {
    super(name, urlBase, {
      search: { key: 'searchstr', default: { grouping: '0' } },
      reg: {
        matchNothing: /Your search did not match anything/,
        date: /([a-zA-Z]{3} \d{2} \d{4})[^\d]+(\d{2}:\d{2})/,
        bonus: /Bonus[^\d]+(\d{1,3}(,\d{3})*)/,
        ratio: /Ratio[^\d]+(\d+(\.\d+)?)/,
        upload: /Up[^\d]+(\d+\.\d+[^TGMK]*?[TGMK]?i?B)/,
        download: /Down[^\d]+(\d+\.\d+[^TGMK]*?[TGMK]?i?B)/ },
      selector: {
        user: 'a[href*=\'user.php?id=\']',
        userInfo: 'div.user-info-bar'
      }
    })
  }
  _parseTorrentList (self, doc, cb) {
    let custom = self.custom
    if (custom.reg.matchNothing.test(doc.html())) {
      let data = false
      cb(data)
    } else {
      let script = doc.find('script').text()
      let pageData = JSON.parse(script.match(/var PageData = ({[\s\S]*?});/)[1])
      for (let i = 0; i < pageData.Movies.length; i++) {
        let cells = pageData.Movies[i].GroupingQualities[0].Torrents[0]

        let title = cells.ReleaseName
        let link = 'torrents.php?torrentid=' + cells.TorrentId
        let dateMatch = cells.Time.match(custom.reg.date)
        let pubdate = Date.parse(dateMatch[1] + ' ' + dateMatch[2])
        let size = parseSize(cells.Size)
        let seeders = parseInt(cells.Seeders)
        let leechers = parseInt(cells.Leechers)
        let completed = parseInt(cells.Snatched)

        let tableData = { title, link, pubdate, size, seeders, leechers, completed }
        cb(tableData)
      }
    }
  }
}

class MiNE extends Site {
  constructor (name, urlBase) {
    super(name, urlBase, {
      path: {
        torrents: 'api/torrents',
        index: '',
        login: 'authentication/signin'
      },
      api: { torrents: true },
      search: { key: 'keys' }
    })
  }
  _parseTorrentList (self, doc, cb) {
    if (doc.total === 0) {
      let data = false
      cb(data)
    } else {
      for (let i = 0; i < doc.total; i++) {
        let row = doc.rows[i]

        let title = row.resource_detail_info.custom_title
        let link = 'torrents/' + row._id
        let pubdate = Date.parse(row.createdat)
        let size = row.torrent_size
        let seeders = row.torrent_seeds
        let leechers = row.torrent_leechers
        let completed = row.torrent_finished

        let tableData = { title, link, pubdate, size, seeders, leechers, completed }
        cb(tableData)
      }
    }
  }
  _parseUserStatistics (self, doc, cb) {
    let script = doc.find('script').text()
    let user = JSON.parse(script.match(/var user = ({[\s\S]*?});/)[1])

    let data = {
      id: user.username,
      class: '-',
      bonus: user.score,
      ratio: user.seed_ratio,
      upload: user.uploaded,
      download: user.downloaded,
      up: user.seeded,
      down: user.leeched
    }
    cb(data)
  }
}

let parseSize = (size) => {
  let sizeMatch = size.toString().match(/^([\d.]+)[^TGMK]*?([TGMK]?i?B)$/)
  if (sizeMatch) {
    let sizeNum = parseFloat(sizeMatch[1])
    let sizeType = sizeMatch[2]
    switch (true) {
      case /Ti?B/.test(sizeType):
        return sizeNum * Math.pow(2, 40)
      case /Gi?B/.test(sizeType):
        return sizeNum * Math.pow(2, 30)
      case /Mi?B/.test(sizeType):
        return sizeNum * Math.pow(2, 20)
      case /Ki?B/.test(sizeType):
        return sizeNum * Math.pow(2, 10)
      default:
        return sizeNum
    }
  }
  return size
}

let deepAssign = (obj1, obj2) => {
  for (let i in obj2) {
    if (toString.call(obj2[i]) !== '[object Null]' &&
    toString.call(obj2[i]) !== '[object RegExp]' &&
    typeof (obj2[i]) === 'object') {
      obj1[i] = deepAssign(obj1[i], obj2[i])
    } else {
      obj1[i] = obj2[i]
    }
  }
  return obj1
}

window.onload = () => {
  const enabledSites = [
    'MTeam',
    'PTP',
    'MiNE',
    'HDChina',
    'TTG',
    'OurBits',
    'HDR',
    'CMCT'
  ]

  let keywords = document.getElementById('keywords')
  let torrentTable = document.getElementById('torrentTable')
  let userTable = document.getElementById('userTable')

  let siteTable = {
    MTeam: new Site('MTeam', 'https://tp.m-team.cc'),
    CMCT: new Site('CMCT', 'https://hdcmct.org'),
    OurBits: new Site('OurBits', 'https://ourbits.club'),
    Hyperay: new Site('Hyperay', 'https://www.hyperay.org'),
    FRDS: new Site('FRDS', 'https://pt.keepfrds.com'),
    HDChina: new Site('HDChina', 'https://hdchina.org', {
      selector: {
        torrentTable: 'table.torrent_list > tbody > tr:gt(0)',
        userInfo: 'div.userinfo'
      }
    }),
    TTG: new TTG('TTG', 'https://totheglory.im'),
    HDR: new HDR('HDR', 'http://hdroute.org'),
    PTP: new PTP('PTP', 'https://passthepopcorn.me'),
    MiNE: new MiNE('MiNE', 'https://mine.pt/')
  }

  let search = () => {
    torrentTable.__vue__.tableData = []
    let searchText = torrentTable.__vue__.search
    for (let s of enabledSites) {
      let site = siteTable[s]
      site.search(searchText, (data) => {
        if (data) {
          data.site = site.name
          data.link = (new URL(data.link, site.urlBase)).toString()
          torrentTable.__vue__.tableData.push(data)
        }
      })
    }
  }

  let getUserStatistics = () => {
    userTable.__vue__.tableData = []
    for (let s of enabledSites) {
      let site = siteTable[s]
      site.getUserStatistics((data) => {
        if (data) {
          data.site = site.name
          userTable.__vue__.tableData.push(data)
        }
      })
    }
  }

  getUserStatistics()

  keywords.onkeyup = function (e) {
    if (e.keyCode === 13) {
      search()
      keywords.blur()
    }
  }
}
