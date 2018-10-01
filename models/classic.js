﻿import { HTTP } from '../utils/http.js'
// import { ClassicStorage } from '../models/classic-storage.js'

class ClassicModel extends HTTP {
	prefix = 'classic'
	constructor() {
		super()
	}
	getLatest(sCallback) {
		/* async, 不能 return 结果 */
		this.request({
			url: 'classic/latest',
			/* success: 接收异步调用的结果 */
			success: res => {
				let key = this._fullKey(res.index)
        wx.setStorageSync(key, res)
        /* 最新一期的期数 index 写入缓存 */
				this._setLatestIndex(res.index)
				sCallback(res)
			}
		})
	}
	getClassic(index, next_or_previous, sCallback) {
		let key =
			next_or_previous === 'next'
				? this._fullKey(index + 1)
				: this._fullKey(index - 1)
		let classic = wx.getStorageSync(key)
		if (!classic) {
			this.request({
				url: `classic/${index}/${next_or_previous}`,
				success: res => {
          let key = this._fullKey(res.index)
					wx.setStorageSync(key, res)
					sCallback(res)
				}
			})
		} else {
			sCallback(classic)
		}
	}
	isFirst(index) {
		if (index === 1) {
			return true
		} else return false
	}
	isLatest(index) {
		// let key = this._fullKey('latest-' + index)
    // let latestIndex = wx.getStorageSync(key)
    let latestIndex = this._getLastIndex(index)
		if (latestIndex) {
			if (index === latestIndex) {
				return true
			}
		} else return false
	}
	/**
	 * 在缓存中存放最新一期的期数 index
	 */
	_setLatestIndex(index) {
		let key = this._fullKey('latest-' + index)
		wx.setStorageSync(key, index)
  }
  _getLastIndex(index) {
    let key = this._fullKey('latest-' + index)
    let latestIndex = wx.getStorageSync(key)
    return latestIndex
  }
	_fullKey(partKey) {
		let key = this.prefix + '-' + partKey
		return key
	}
}

export { ClassicModel }
