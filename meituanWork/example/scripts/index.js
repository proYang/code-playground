$(document).ready(function () {
    var main = {
        // 模拟数据
        shopList: [
            {
                id: 1,
                name: '牛肉面',
                city: '兰州',
            }, {
                id: 2,
                name: '全聚德烤鸭',
                city: '北京',
            }, {
                id: 3,
                name: '抄手',
                city: '成都',
            }, {
                id: 4,
                name: '芥菜团子',
                city: '南昌',
            }, {
                id: 5,
                name: '状元糕',
                city: '南昌',
            }, {
                id: 6,
                name: '热干面',
                city: '湖北',
            }, {
                id: 7,
                name: '毛肚',
                city: '重庆',
            }, {
                id: 8,
                name: '抄手',
                city: '成都',
            }, {
                id: 9,
                name: '毛血旺',
                city: '重庆',
            }, {
                id: 10,
                name: '热干面',
                city: '湖北',
            }, {
                id: 11,
                name: '芥菜团子',
                city: '南昌',
            }, {
                id: 12,
                name: '抄手',
                city: '成都',
            }, {
                id: 13,
                name: '全聚德烤鸭',
                city: '北京',
            }, {
                id: 14,
                name: '春卷',
                city: '北京',
            }, {
                id: 15,
                name: '冒菜',
                city: '成都',
            }, {
                id: 16,
                name: '肉夹馍',
                city: '西安',
            }, {
                id: 17,
                name: '凉皮',
                city: '西安',
            }, {
                id: 18,
                name: '小笼包',
                city: '上海',
            }, {
                id: 19,
                name: '丝袜奶茶',
                city: '香港',
            }, {
                id: 20,
                name: '芥菜团子',
                city: '南昌',
            }, {
                id: 21,
                name: '米粉',
                city: '桂林',
            }, {
                id: 22,
                name: '腐乳',
                city: '绍兴',
            }
        ],
        // 城市列表
        cityList: [],
        // 表格数据
        tableList: [],
        // 分页相关参数
        page: {
            size: 10,
            currentPage: 1
        },
        search: {
            city: '',
            name: ''
        },
        selected: [],
        init: function () {
            this.tableList = this.shopList.slice(0)
            this.getCityList()
            this.renderCityList()
            this.renderTable()
            this.bindPageEvent()
            this.bindSearchEvent()
            this.bindCheckEvent()
            this.bindSearchCityEvent()
        },
        // 获取城市列表
        getCityList: function () {
            var obj = {}
            var result = []
            // 去重
            this.shopList.forEach(function (item) {
                obj[item.city] = item.city
            })
            for (var key in obj) {
                result.push({ name: obj[key], disabled: false })
            }
            this.cityList = result
        },
        // 填充表格
        renderTable: function () {
            var $J_tbody = $('#J_tbody')
            var template = ''
            // 分页显示
            var totalPage = Math.ceil(this.tableList.length / this.page.size)
            if (totalPage == 1) {
                $('.next, .pre').hide()
            } else {
                $('.next, .pre').show()
            }
            if (this.page.currentPage == 1) {
                $('.pre').hide()
            } else if (this.page.currentPage == totalPage) {
                $('.next').hide()
            }
            var start = (this.page.currentPage == 1 ? 0 : (this.page.currentPage - 1) * this.page.size)
            var end = (this.page.currentPage == totalPage ? this.tableList.length : start + this.page.size)
            // 截取当前分页数据
            var tableList = this.tableList.slice(start, end)
            tableList.forEach(function (item) {
                var tplClass = item.selected == true ? 'checkbox checked' : 'checkbox'
                var str = '<tr><td><span class="' + tplClass + '" data-id="' + item.id + '"></span></td><td>' +
                    item.id + '</td><td>' + item.name + '</td><td>' + item.city + '</td></tr>'
                template = template + str
            })
            if (this.tableList.length == 0) {
                $('.tip').show()
            } else {
                $('.tip').hide()
            }
            $J_tbody.html(template)
        },
        // 填充城市下拉菜单
        renderCityList: function () {
            var $cityList = $('#J_city-list')
            var template = ''
            this.cityList.forEach(function (item) {
                if (item.disabled) return
                var str = '<li>' + item.name + '</li>'
                template = template + str
            })
            $cityList.html(template)
        },
        // 填充已选中提示信息
        renderMessage: function () {
            var sum = 0;
            var arr = []
            var template = ''
            this.tableList.forEach(function (item) {
                if (item.selected) {
                    sum++
                    arr.push(item.name)
                }
            })
            template = '已选择' + sum + '项：' + arr.join('、')
            $('.message').html(template)
        },
        // 上下页按钮事件
        bindPageEvent: function () {
            var that = this
            $buttonGroup = $('.J_button-group')
            $buttonGroup.on('click', function (event) {
                if ($(event.target).hasClass('pre')) {
                    that.page.currentPage--
                } else if ($(event.target).hasClass('next')) {
                    that.page.currentPage++
                }
                that.renderTable()
            })
        },
        // 搜索事件
        bindSearchEvent: function () {
            var that = this
            $select = $('.J_select')
            var $group = $select.find('.list-group')
            $select.on('click', function (event) {
                event.stopPropagation()
                if (event.target.nodeName == 'LI') {
                    // 获取选中城市
                    $select.find('span').html($(event.target).html())
                    that.search.city = $(event.target).html()
                    $group.addClass('hidden')
                } else {
                    $group.removeClass('hidden')
                }
            })
            $('body').on('click', function (event) {
                $group.addClass('hidden')
            })
            $('.J_search').on('click', function (event) {
                that.search.name = $('.select.input').val()
                if (that.search.name.length > 0 && that.search.city.length > 0) {
                    that.tableList = []
                    that.shopList.forEach(function (item) {
                        if (new RegExp(that.search.name).test(item.name) && new RegExp(that.search.city).test(item.city)) {
                            that.tableList.push(item)
                        }
                    })
                } else {
                    if (that.search.name.length > 0) {
                        that.tableList = []
                        that.shopList.forEach(function (item) {
                            if (new RegExp(that.search.name).test(item.name)) {
                                that.tableList.push(item)
                            }
                        })
                    }
                    if (that.search.city.length > 0) {
                        that.tableList = []
                        that.shopList.forEach(function (item) {
                            if (new RegExp(that.search.city).test(item.city)) {
                                that.tableList.push(item)
                            }
                        })
                    }
                }

                that.renderTable()
                that.renderMessage()
            })
        },
        bindCheckEvent: function () {
            var that = this
            $('.table').on('click', '.checkbox', function () {
                var id = $(this).attr('data-id')
                if (id) {
                    that.tableList.forEach(function (item) {
                        if (item.id == id && (item.selected == false || item.selected == undefined)) {
                            item.selected = true
                        } else if (item.id == id && item.selected == true) {
                            item.selected = false
                        }
                    })
                } else {
                    if ($(this).hasClass('checked')) {
                        that.tableList.forEach(function (item) {
                            item.selected = false
                        })
                        $(this).removeClass('checked')
                    } else {
                        that.tableList.forEach(function (item) {
                            item.selected = true
                        })
                        $(this).addClass('checked')
                    }
                }
                that.renderTable()
                that.renderMessage()
            })
        },
        // 城市下拉框搜索事件
        bindSearchCityEvent() {
            var that = this
            var val = undefined
            $input = $('.J_search')
            $input.on('keyup', function (event) {
                val = $(this).val()
                if (val && val.length > 0) {
                    that.cityList.forEach(function (item) {
                        if (!new RegExp(val).test(item.name)) {
                            item.disabled = true
                        }
                    })
                }
                that.renderCityList()
            })
        }
    }

    main.init()
});