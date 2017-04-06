/**
 * 
 * @author yxl
 * @module mobile-lock
 * @version  0.1.0
 * @description  mobile-lock锁屏组件
 * 
 */
;(function(name, definition) {
    // 检测上下文环境是否为AMD或CMD
    var hasDefine = typeof define === "function"

    if (hasDefine) {
        define(definition)
    } else {
        // 将模块挂载到window对象
        this[name] = definition()
    }
})('Lock',function () {
    var Lock = {

        /**
         * canvas实例元素
         * @property _canvas
         */
        _canvas: undefined,

        /**
         * getContext() 方法返回一个用于在画布上绘图的环境。
         * @property _context
         */
        _context: undefined,

        /**
         *  n*n方阵阶数
         * @property _n
         */
        _n: 3,

        /**
         *  当前组件状态
         * 'set' 表示设置密码状态
         * 'check' 表示验证密码状态
         * @property _type
         */
        _type: 'set',

        /**
         * 圆圈半径，每个圆直径2r，左右边距各r
         * @property _r
         */
        _r: 0,

        /**
         *  至少选中圆圈个数
         * @property _length
         */
        _length: 5,

        /**
         * 各位置圆圈状态数字
         * @property _circles
         */
        _circles: [],

        /**
         * 第二次验证时，上一次被选中的圆圈位置序列
         * @property _lastTouchedList
         */
        _lastTouchedList: '',

        /**
         * 被选中的圆圈位置序列
         * @property _touchedList
         */
        _touchedList: [],

        /**
         * 密码长度少于设置长度 回调函数
         * @property _deficiency
         */
        _deficiency: null,

        /**
         * 第一次设置密码回调函数
         * @property _firstSetPwd
         */
        _firstSetPwd: null,

        /**
         * 设置密码成功回调函数
         * @property _setSuccess
         */
        _setSuccess: null,

        /**
         * 设置密码失败回调函数
         * @property _setFail
         */
        _setFail: null,

        /**
         * 验证密码成功回调函数
         * @property _checkSuccess
         */
        _checkSuccess: null,

        /**
         * 设置密码失败回调函数
         * @property _checkFail
         */
        _checkFail: null,

        /**
         * 执行对应回调函数
         *
         * @method _useCallback
         * @param {String} key
         * @private
         */
        _useCallback(key) {
            var func = this[key]
            var cv = typeof func
            typeof func == 'function' ? func.call(this) : ''
        },

        /**
         * 绑定对应回调函数
         *
         * @method _bindCallback
         * @param {Object} options
         * @private
         */
        _bindCallback(options) {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    if (typeof options[key] == 'function') {
                        var item = key.split('')
                        item.unshift('_')
                        item = item.join('')
                        this[item] = options[key]
                    }
                }
            }
        },

        /**
         * 计算每个圆圈的位置信息
         *
         * @method _caculatePosition
         * @private
         */
        _caculatePosition: function () {
            var n = this.num
            var r = this._r
            this._circles = []
            this._touchedList = []
            for (var i = 0; i < n; i++) { // 行
                for (var j = 0; j < n; j++) { // 列
                    this._circles.push({
                        x: j * 4 * r + 2 * r,
                        y: i * 4 * r + 2 * r,
                        r: r,
                        touched: false, // 是否已被选中
                    });
                }
            }
        },

        /**
         * 填充圆圈样式
         *
         * @method _drawCircle
         * @private
         */
        _drawCircle: function () {
            var circles = this._circles;
            for (var i = 0; i < circles.length; i++) {
                this._content.beginPath();
                this._content.arc(circles[i].x, circles[i].y, circles[i].r, 0, 2 * Math.PI, false);
                if (!circles[i].touched) {
                    // 未点击状态
                    this._content.strokeStyle = "#bbb";// 画空心圆
                    this._content.stroke();
                } else {
                    // 已点击状态
                    this._content.fillStyle = "#ffa724";// 画实心圆
                    this._content.strokeStyle = "#fd8d00";// 画空心圆
                    this._content.fill();
                    this._content.stroke();
                }
                this._content.closePath();
            }
        },

        /**
         * 构造圆圈间、圆圈与手指间线条
         *
         * @method _drawCircle
         * @private
         */
        _drawLine: function (position) {
            this._clearCanvas()
            this._drawCircle()
            for (var i = 0; i < this._touchedList.length - 1; i++) {
                var startIndex = this._touchedList[i]
                var endIndex = this._touchedList[i + 1]
                var start = this._circles[startIndex]
                var end = this._circles[endIndex]
                this._content.beginPath();
                this._content.strokeStyle = "#e0281e";// 画空心圆
                this._content.moveTo(start.x, start.y);
                this._content.lineTo(end.x, end.y);
                this._content.stroke();
            }
            if (!position || this._touchedList.length == 0) return
            startIndex = this._touchedList[this._touchedList.length - 1]
            start = this._circles[startIndex]
            end = position
            this._content.strokeStyle = "#e0281e";// 画空心圆
            this._content.beginPath();
            this._content.moveTo(start.x, start.y);
            this._content.lineTo(end.x, end.y);
            this._content.stroke();
        },

        /**
         * 手指进入圆圈范围，对应操作
         *
         * @method _touchCircle
         * @param {Object} position
         * @private
         */
        _touchCircle: function (position) {
            // 手指进入圆圈范围
            var circles = this._circles;
            for (var i = 0; i < circles.length; i++) {
                if (position.x >= circles[i].x - circles[i].r && position.x <= circles[i].x + circles[i].r) {
                    if (position.y >= circles[i].y - circles[i].r && position.y <= circles[i].y + circles[i].r) {
                        if (circles[i].touched == false) {
                            this._touchedList.push(i)
                            circles[i].touched = true;
                            this._clearCanvas()
                            this._drawCircle()
                            this._drawLine()
                        }
                    }
                }
            }
        },

        /**
         * 获取触点在canvas中的相对位置
         *
         * @method _getPosition
         * @param {Object} touch
         * @returns {Object} position
         * @private
         */
        _getPosition: function (touch) {
            // 获取触点在canvas中的位置
            var position = {
                x: touch.clientX - this.element.offsetLeft,
                y: touch.clientY - this.element.offsetTop
            }
            return position
        },

        /**
         * 清除canvas内容
         *
         * @method _clearCanvas
         * @private
         */
        _clearCanvas: function () {
            // 擦除画布
            this._content.clearRect(0, 0, this._content.canvas.width, this._content.canvas.height);
        },

        /**
         * 重置canvas内容，并提示用户
         *
         * @method _resetCanvas
         * @private
         */
        _resetCanvas: function () {
            this._clearCanvas()
            // 重新计算位置
            this._caculatePosition()
            this._drawCircle()
        },

        /**
         * 绑定DOM事件到canvas元素
         *
         * @method _addEvent
         * @private
         */
        _addEvent: function () {
            var that = this
            this.element.addEventListener('touchstart', function (event) {
                event.preventDefault()
                event.stopPropagation()
                var position = that._getPosition(event.touches[0])
                that._touchCircle(position)
            })
            this.element.addEventListener('touchmove', function (event) {
                event.stopPropagation()
                var position = that._getPosition(event.touches[0])
                that._touchCircle(position)
                that._drawLine(position)
            })
            this.element.addEventListener('touchend', function () {
                event.stopPropagation()
                that._drawLine()
                var password = that._touchedList.join('')
                if (that._type == 'set') {
                    that._setPassword(password)
                } else if (that._type == 'check') {
                    that._checkPassword(password)
                }
            })
        },

        /**
         * 设置密码
         *
         * @method password
         * @private
         */
        _setPassword: function (password) {
            if (this._touchedList.length < this.length && this._touchedList.length > 0) {
                // 不足用户设置长度，执行对应回调函数
                this._useCallback('_deficiency')
            } else if(this._touchedList.length > 0) {
                if (this._lastTouchedList.length == 0) {
                    // 第一次输入图案
                    this._lastTouchedList = password
                    this._useCallback('_firstSetPwd')
                } else {
                    // 第二次输入图案
                    if (this._lastTouchedList == password) {
                        // 两次密码一致
                        this._lastTouchedList = ''
                        this.util.setStorage('mobile_lock', password)
                        this._useCallback('_setSuccess')
                    } else {
                        // 两次密码不一致
                        this._lastTouchedList = ''
                        this._useCallback('_setFail')
                    }
                }
            }
            // 重置画布
            this._resetCanvas()
        },

        /**
         * 校验密码
         *
         * @method _checkPassword
         * @private
         */
        _checkPassword: function (password) {
            var localPwd = Lock.util.getStorage('mobile_lock')
            if (localPwd == password) {
                this._useCallback('_checkSuccess')
            } else {
                this._useCallback('_checkFail')
            }
            // 重置画布
            this._resetCanvas()
        },


        /**
         * 初始化
         *
         * @method init
         * @param {Object} options
         * @public
         */
        init: function (options) {
            this.element = document.querySelector(options.element)
            this.length = parseInt(options.length)
            this.num = parseInt(options.num)
            this._content = this.element.getContext('2d')
            this._r = this._content.canvas.width / (4 * this.num)
            this._caculatePosition()
            this._drawCircle()
            this._addEvent()
            this._bindCallback(options)
        },

        /**
         * 切换组件为设置密码状态或校验密码状态
         *
         * @method switchState
         * @param {String} type
         * @public
         */
        switchState: function (type) {
            if (this._type == 'set' && !type) {
                //type 参数不存在，切换组件状态为'set'
                this._type = 'check'
            } else if (this._type == 'check' && !type) {
                //type 参数不存在，切换组件状态为'check'
                this._type = 'set'
            } else if (type && (type == 'set' || type == 'check')) {
                //type 参数存在，且为'check'或'set'之一, 切换到对应状态
                this._type = type
            } else {
                console.error('The type [' + type + '] is not supposed')
            }
        },
    }

    /**
     * 工具类
     *
     * @class util
     */
    Lock.util = {
        getStorage: function (item) {
            return window.localStorage.getItem(item)
        },
        setStorage: function (item, value) {
            window.localStorage.setItem(item, value)
        },
        removeStorage: function (item) {
            window.localStorage.removeItem(item)
        }
    }

    return Lock
});
