var bgColor = "white";//背景
var upColor = '#ec0000';//涨颜色
var downColor = '#00da3c';//跌颜色

var volumn120Color = '#0645e8';

var difColor = '#da6ee8';
var deaColor = '#39afe6';

var kColor = "#39afe6";
var dColor = "#da6ee8";
var jColor = "#ffab42";

var rsi6Color = '#e61000';
var rsi12Color = '#2700e6';
var rsi24Color = '#40e606';

/**
 * 15:20 时:分 格式时间增加num分钟
 * @param {Object} time 起始时间
 * @param {Object} num
 */
function addTimeStr(time, num) {
    var hour = time.split(':')[0];
    var mins = Number(time.split(':')[1]);
    var mins_un = parseInt((mins + num) / 60);
    var hour_un = parseInt((Number(hour) + mins_un) / 24);
    if (mins_un > 0) {
        if (hour_un > 0) {
            var tmpVal = ((Number(hour) + mins_un) % 24) + "";
            hour = tmpVal.length > 1 ? tmpVal : '0' + tmpVal;//判断是否是一位
        } else {
            var tmpVal = Number(hour) + mins_un + "";
            hour = tmpVal.length > 1 ? tmpVal : '0' + tmpVal;
        }
        var tmpMinsVal = ((mins + num) % 60) + "";
        mins = tmpMinsVal.length > 1 ? tmpMinsVal : 0 + tmpMinsVal;//分钟数为 取余60的数
    } else {
        var tmpMinsVal = mins + num + "";
        mins = tmpMinsVal.length > 1 ? tmpMinsVal : '0' + tmpMinsVal;//不大于整除60
    }
    return hour + ":" + mins;
}

//获取增加指定分钟数的 数组  如 09:30增加2分钟  结果为 ['09:31','09:32'] 
function getNextTime(startTime, endTIme, offset, resultArr) {
    var result = addTimeStr(startTime, offset);
    resultArr.push(result);
    if (result == endTIme) {
        return resultArr;
    } else {
        return getNextTime(result, endTIme, offset, resultArr);
    }
}


/**
 * 不同类型的股票的交易时间会不同
 * @param {Object} type   hs=沪深  us=美股  hk=港股
 */
var time_arr = function (type) {
    if (type.indexOf('us') != -1) {//生成美股时间段
        var timeArr = new Array();
        timeArr.push('09:30')
        return getNextTime('09:30', '16:00', 1, timeArr);
    }
    if (type.indexOf('hs') != -1) {//生成沪深时间段
        var timeArr = new Array();
        timeArr.push('09:30');
        timeArr.concat(getNextTime('09:30', '11:29', 1, timeArr));
        timeArr.push('13:00');
        timeArr.concat(getNextTime('13:00', '15:00', 1, timeArr));
        return timeArr;
    }
    if (type.indexOf('hk') != -1) {//生成港股时间段
        var timeArr = new Array();
        timeArr.push('09:30');
        timeArr.concat(getNextTime('09:30', '11:59', 1, timeArr));
        timeArr.push('13:00');
        timeArr.concat(getNextTime('13:00', '16:00', 1, timeArr));
        return timeArr;
    }

}
var tempPrePrice;
function get_m_data(data, type) {

    var priceArr = new Array();
    var avgPrice = new Array();
    var updownrangeArr = new Array();
    var vol = new Array();
    var times = time_arr(type);
    for (var i = 0; i < data.length; i++) {
        var v =  data[i];
        if (i == 0) {
            tempPrePrice = v.price / (v.upDownRange + 1);
        }
        updownrangeArr.push(v.upDownRange);
        priceArr.push(v.price);
        avgPrice.push(v.avgPrice);
        vol.push(v.volume);

    }
    // $.each(data, function (i, v) {
        
    //     //times.push(v.time);
    // })

    return {
        priceArr: priceArr,
        updownrangeArr: updownrangeArr,
        avgPrice: avgPrice,
        vol: vol,
        times: times
    }
}

/**
 * 生成分时option
 * @param {Object} m_data 分时数据
 * @param {Object} type 股票类型  us-美股  hs-沪深  hk-港股
 */
function initMOption(m_data, type) {
    var m_datas = get_m_data(m_data, type);
    return {
        tooltip: { //弹框指示器
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            formatter: function (params, ticket, callback) {
                var i = params[0].dataIndex;

                var color;
                if (m_datas.updownrangeArr[i] > 0) {
                    color = 'style="color:#ff4242"';
                } else {
                    color = 'style="color:#26bf66"';
                }

                var html = '<div class="commColor" style="width:100px;"><div>当前价 <span  ' + color + ' >' + m_datas.priceArr[i] + '</span></div>';
                html += '<div>均价 <span  ' + color + ' >' + m_datas.avgPrice[i] + '</span></div>';
                html += '<div>涨幅 <span  ' + color + ' >' + (m_datas.updownrangeArr[i] * 100).toFixed(3) + '%</span></div>';
                html += '<div>成交量 <span  ' + color + ' >' + m_datas.vol[i] + '</span></div></div>'
                return html;
            }
        },
        legend: { //图例控件,点击图例控制哪些系列不显示
            icon: 'rect',
            type: 'plain',
            itemWidth: 14,
            itemHeight: 2,
            left: 'center',
            top: '2%',
            //backgroundColor:'red',
            borderColor: 'green',
            textStyle: {
                fontSize: 16,
                color: '#0e99e2'
            }
        },
        axisPointer: {
            show: true
        },
        //color: [ma5Color, ma10Color],
        grid: getTimeLineGrid(m_datas),
        xAxis: getTimeLineXAxis(m_datas),
        yAxis: getTimeLineYAxis(m_datas),
        dataZoom: [],
        animation: false,//禁止动画效果
        backgroundColor: bgColor,
        blendMode: 'source-over',
        series: getTimeLineSeries(m_datas)
    };
}

function getTimeLineGrid() {
    var grid = [{
        id: 'gd1',
        left: '10%',
        right: '10%',
        height: '45%', //主K线的高度,
        top: '10%'
    },
        {
            id: 'gd2',
            left: '10%',
            right: '10%',
            height: '45%', //主K线的高度,
            top: '10%'
        }, {
            id: 'gd3',
            left: '10%',
            right: '10%',
            top: '65%',
            height: '20%' //交易量图的高度
        }
    ];
    return grid;
}

function getTimeLineXAxis(m_datas) {
    var xAxis = [{ //主图
        gridIndex: 0,
        data: m_datas.times,
        axisLabel: { //label文字设置
            show: false
        },
        splitLine: {
            show: false,
        }
    }, {
        show: false,
        gridIndex: 1,
        data: m_datas.times,
        axisLabel: { //label文字设置
            show: false
        },
        splitLine: {
            show: false,
        }
    }, { //交易量图
        splitNumber: 2,
        type: 'category',
        gridIndex: 2,
        data: m_datas.times,
        axisLabel: { //label文字设置
            color: '#9b9da9',
            fontSize: 10
        },
    }]
    return xAxis;
}

function getTimeLineYAxis(m_datas) {
    var yAxis = [ //y轴
        {
            gridIndex: 0,
            scale: true,
            splitNumber: 6,
            axisLabel: { //label文字设置
                //inside: true, //label文字朝内对齐
                fontWeight: 'bold',
                color: function (val, index) {
                    if (val == tempPrePrice) {
                        return '#aaa'
                    }
                    return val > tempPrePrice ? upColor : downColor;
                }
            },
            z: 4,
            // splitLine: { //分割线设置
            // 	show: false,
            // 	lineStyle: {
            // 		color: '#181a23'
            // 	}
            // },
        },
        {
            scale: true,
            gridIndex: 1,
            splitNumber: 6,
            position: 'right',
            z: 4,
            axisLabel: { //label文字设置
                color: function (val, index) {
                    if (val == tempPrePrice) {
                        return '#aaa'
                    }
                    return val > tempPrePrice ? upColor : downColor;
                },
                //inside: true, //label文字朝内对齐
                fontWeight: 'bold',
                formatter: function (val, index) {
                    //tempPrePrice = val / (m_datas.updownrangeArr[index] + 1);
                    var resul = ratioCalculate(val, tempPrePrice);
                    return resul + "%"
                }
            },
            // splitLine: { //分割线设置
            // 	show: true,
            // 	lineStyle: {
            // 		color: '#5ec0a9'
            // 	}
            // },
            axisPointer: {
                show: true,
                label: {
                    formatter: function (params, index) { //计算右边Y轴对应的当前价的涨幅比例
                        var resul = ratioCalculate(params.value, tempPrePrice);
                        return resul + "%"
                    }
                }
            }
        },
        { //交易图
            gridIndex: 2,
            z: 4,
            splitNumber: 3,
            axisLine: {
                onZero: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                show: false
            },
            axisLabel: { //label文字设置
                color: '#c7c7c7',
                //inside: true, //label文字朝内对齐
                fontSize: 8
            },
        }
    ];
    return yAxis;
}

function getTimeLineSeries(m_datas) {
    var series =
        [{
            name: '当前价',
            type: 'line',
            data: m_datas.priceArr,
            smooth: true,
            symbol: "circle", //中时有小圆点
            lineStyle: {
                normal: {
                    opacity: 0.8,
                    color: '#39afe6',
                    width: 1
                }
            }
            // ,
            // areaStyle: {
            // 	normal: {
            // 		color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            // 			offset: 0,
            // 			color: 'rgba(0, 136, 212, 0.7)'
            // 		}, {
            // 			offset: 0.8,
            // 			color: 'rgba(0, 136, 212, 0.02)'
            // 		}], false),
            // 		shadowColor: 'rgba(0, 0, 0, 0.1)',
            // 		shadowBlur: 10
            // 	}
            // }
        }, {
            name: '均价',
            type: 'line',
            data: m_datas.avgPrice,
            smooth: true,
            symbol: "circle",
            lineStyle: { //标线的样式
                normal: {
                    opacity: 0.8,
                    color: '#da6ee8',
                    width: 1
                }
            }
        }, {
            type: 'line',
            data: m_datas.priceArr,
            smooth: true,
            symbol: "none",
            gridIndex: 1,
            xAxisIndex: 1,
            yAxisIndex: 1,
            lineStyle: { //标线的样式
                normal: {
                    width: 0
                }
            }
        },
            {
                name: 'Volumn',
                type: 'bar',
                gridIndex: 2,
                xAxisIndex: 2,
                yAxisIndex: 2,
                data: m_datas.vol,
                barWidth: '60%',
                itemStyle: {
                    normal: {
                        color: function (params) {
                            var colorList;
                            if (m_datas.priceArr[params.dataIndex] >= m_datas.priceArr[params.dataIndex - 1]) {
                                colorList = upColor;
                            } else {
                                colorList = downColor;
                            }
                            return colorList;
                        },
                    }
                }
            }
        ];
    return series;
}


/**
 * 计算价格涨跌幅百分比
 * @param {Object} price 当前价
 * @param {Object} yclose 昨收价
 */
function ratioCalculate(price, yclose) {
    return ((price - yclose) / yclose * 100).toFixed(3);
}

//数组处理
function splitData(rawData) {
    var datas = [];
    var times = [];
    var vols = [];
    for (var i = 0; i < rawData.length; i++) {
        datas.push(rawData[i]);
        times.push(rawData[i].splice(0, 1)[0]);
        vols.push(rawData[i][4]);
    }
    return {datas: datas, times: times, vols: vols};
}

export {
    initMOption
}
