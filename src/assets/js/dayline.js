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

function timestampToDate(timestamp) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear();
    var M = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
    var D = date.getDate();
    return Y+"-"+M+"-"+D;
}


function getOption(kChart, data, indicatorType){
    var option = kChart.getOption();
    option.xAxis= getXAxis(data, indicatorType);
    option.yAxis = getYAxis(indicatorType);
    //option.dataZoom = getDataZoom();
    option.series = getSeries(data, indicatorType);
    // if (indicatorType == VOLUMN_TYPE){
    //     option.visualMap = getvisualMap();
    // }
    return option;
}

function makeOption(data, indicatorType) {
    initXAxisData(data);
    initYAxisData();
    initSeriesData(data);
    var option = {
        backgroundColor: bgColor,
        animation: false, //是否开启动画，左右拖动动画
        legend: {//图例控件,点击图例控制哪些系列不显示
            icon: 'rect',
            type: 'scroll',
            itemWidth: 14,
            itemHeight: 2,
            left: 'center',
            top: '2%',
            animation: true,
            textStyle: {
                fontSize: 16,
                color: '#0e99e2'
            },
            pageIconColor: '#0e99e2',
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            backgroundColor: 'rgba(245, 245, 245, 0.8)',
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            },
            position: function (pos, params, el, elRect, size) {
                /**
                 * tempArr[0] = rawData[i].open;
                 tempArr[1] = rawData[i].close;
                 tempArr[2] = rawData[i].low;
                 tempArr[3] = rawData[i].high;
                 tempArr[4] = rawData[i].volume;
                 */
                var dataArr = params[0].data;


                var obj = {top: 10};
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 50;
                return obj;
            },
        },
        axisPointer: {  //鼠标滑动时，成交量指针可联动
            link: {xAxisIndex: 'all'},
            label: {
                backgroundColor: '#777'
            }
        },
        grid: getGrid(),
        xAxis: getXAxis(data, indicatorType),
        yAxis: getYAxis(indicatorType),
        dataZoom: getDataZoom(data),
        series: getSeries(data, indicatorType)
    };

    //option.visualMap = getvisualMap(indicatorType);

    return option;
}

function getvisualMap(indicatorType){
    var visualMap;
    if (indicatorType == VOLUMN_TYPE) {
        visualMap = {
            show: false,
            seriesIndex: 7,
            dimension: 2,
            pieces: [{
                value: 1,
                color: downColor
            }, {
                value: -1,
                color: upColor
            }]
        };
    }

    return visualMap;
}

function getIndicatorArr(rawData, indicator) {
    var categoryData = [];
    for (var i = 0; i < rawData.length; i++) {
        if(indicator == "date"){
            categoryData.push(timestampToDate(rawData[i][indicator]));
        }else{
            categoryData.push(rawData[i][indicator]);
        }

    }
    return categoryData;
}

function getVolumesArr(rawData) {
    var categoryData = [];

    for (var i = 0; i < rawData.length; i++) {
        var tempValue = [];
        tempValue[0] = i;
        tempValue[1] = rawData[i].volume;
        tempValue[2] = rawData[i].open * 1 > rawData[i].close * 1 ? 1 : -1;
        categoryData.push(tempValue);
    }
    return categoryData;
}

function getValueArr(rawData) {
    var values = [];

    for (var i = 0; i < rawData.length; i++) {
        var tempArr = [];
        tempArr[0] = rawData[i].open;
        tempArr[1] = rawData[i].close;
        tempArr[2] = rawData[i].low;
        tempArr[3] = rawData[i].high;
        tempArr[4] = rawData[i].volume;
        values.push(tempArr);
    }
    return values;
}

function getValueMA(dayCount, data) {
    var result = [];

    for (var i = 0; i < data.length; i++) {
        if (data[i]["ma" + dayCount] == 0) {
            result.push("-");
            continue;
        }
        result.push(data[i]["ma" + dayCount]);
    }
    return result;
}


function getGrid() {
    var grid = [   //设置曲线图的具体文职
        {
            left: '5%',
            right: '6%',
            height: '45%'
        },
        {
            left: '5%',
            right: '6%',
            top: '60%',
            height: '20%'
        }
    ];
    return grid;
}

//绘制横轴的时间线
function getXAxis(data, indicatorType) {

    var xAxis = [
        xAxisObj.kline,
    ];
    if (indicatorType == VOLUMN_TYPE){
        xAxis.push(xAxisObj.volumn);
    }
    else if (indicatorType == MACD_TYPE){
        xAxis.push(xAxisObj.macd);
    }
    else if (indicatorType == KDJ_TYPE){
        xAxis.push(xAxisObj.kdj);
    }
    else if (indicatorType == RSI_TYPE){
        xAxis.push(xAxisObj.rsi);
    }
    return xAxis;
}

//绘制纵轴的标尺
function getYAxis(indicatorType) {
    var yAxis = [
        yAxisObj.kline,
    ];
    if (indicatorType == VOLUMN_TYPE){
        yAxis.push(yAxisObj.volumn);
    }
    else if (indicatorType == MACD_TYPE){
        yAxis.push(yAxisObj.macd);
    }
    else if (indicatorType == KDJ_TYPE){
        yAxis.push(yAxisObj.kdj);
    }
    else if (indicatorType == RSI_TYPE){
        yAxis.push(yAxisObj.rsi);
    }
    return yAxis;
}

//区域缩放
function getDataZoom(data) {
    var start = ((100 - 60 / data.length  * 100)).toFixed(0) * 1;

    var dataZoom = [
        {
            type: 'inside',
            xAxisIndex: [0, 1],//控件联动
            start: start,
            end: 100
        },
        {
            show: true,
            xAxisIndex: [0, 1],
            type: 'slider',
            start: start,
            end: 100
        }
    ];
    return dataZoom;
}
var VOLUMN_TYPE = 1;
var MACD_TYPE = 2;
var KDJ_TYPE = 3;
var RSI_TYPE = 4;

function getSeries(data, indicatorType) {
    var series = [
        seriesObj.kline,
        seriesObj.ma5,
        seriesObj.ma10,
        seriesObj.ma20,
        seriesObj.ma30,
        seriesObj.ma60,
        seriesObj.ma120

    ];
    if (indicatorType == VOLUMN_TYPE){
        series.push(seriesObj.volumn);
        series.push(seriesObj.volumn120);
    }
    else if (indicatorType == MACD_TYPE){
        series.push(seriesObj.macd);
        series.push(seriesObj.dif);
        series.push(seriesObj.dea);
    }
    else if (indicatorType == KDJ_TYPE){
        series.push(seriesObj.k);
        series.push(seriesObj.d);
        series.push(seriesObj.j);
    }
    else if (indicatorType == RSI_TYPE){
        series.push(seriesObj.rsi6);
        series.push(seriesObj.rsi12);
        series.push(seriesObj.rsi24);
    }
    return series;
}

var xAxisObj;
var yAxisObj;
var seriesObj;

function initXAxisData(data){
    xAxisObj = {
        kline : {
            type: 'category',
            data: getIndicatorArr(data, "date"),
            axisLine: {lineStyle: {color: '#8392A5'}}
        },
        volumn : {
            type: 'category',
            gridIndex: 1,
            data: getIndicatorArr(data, "date"),
            axisLine: {lineStyle: {color: '#8392A5'}},
            axisLabel: {show: false},

        },
        macd : { //macd
            type: 'category',
            gridIndex: 1,
            data: getIndicatorArr(data, "date"),
            axisLabel: {
                show: false
            }
        },
        kdj : { //kdj
            type: 'category',
            gridIndex: 1,
            data: getIndicatorArr(data, "date"),
            axisLabel: {
                show: false
            },
        },
        rsi : { //rsi
            type: 'category',
            gridIndex: 1,
            data: getIndicatorArr(data, "date"),
            axisLabel: {
                show: false
            },
        }

    };
}

function initYAxisData(){
    yAxisObj = {
        kline : {
            scale: true,

            axisLabel: { //label文字设置
                color: '#c7c7c7',
                //inside: true, //label文字朝内对齐
            },
            axisLine: {lineStyle: {color: '#8392A5'}},
            splitLine: {
                show: false //表格线
            }
        },
        volumn : {//成交量
            gridIndex: 1, splitNumber: 3, z: 4,
            axisLine: {
                //onZero: false
                lineStyle: {color: '#8392A5'}
            },
            splitLine: {
                show: false  //表格线
            },
            axisLabel: { //label文字设置
                color: '#c7c7c7',
                inside: true, //label文字朝内对齐
                //fontSize: 8
            },
        },
        macd : { //macd
            name: "MACD(12, 26, 9)",
            z: 4,
            gridIndex: 1,
            splitNumber: 4,
            axisLine: {
                //onZero: false
                lineStyle: {color: '#8392A5'}
            },
            splitLine: {
                show: false //表格线
            },
            axisLabel: { //label文字设置
                color: '#c7c7c7',
                //inside: true, //label文字朝内对齐
                //fontSize: 8
            },
        },
        kdj : { //kdj
            name: "KDJ(9, 3, 3)",
            z: 4,
            gridIndex: 1,
            splitNumber: 4,
            axisLine: {
                //onZero: false
                lineStyle: {color: '#8392A5'}
            },

            splitLine: {
                show: false //表格线
            },
            axisLabel: { //label文字设置
                color: '#c7c7c7'
            }
        },
        rsi : { //rsi
            name: "RSI(6, 12, 24)",
            z: 4,
            gridIndex: 1,
            splitNumber: 4,
            axisLine: {
                //onZero: false
                lineStyle: {color: '#8392A5'}
            },

            splitLine: {
                show: false //表格线
            },
            axisLabel: { //label文字设置
                color: '#c7c7c7'
            }
        }
    };
}

function initSeriesData(data){
    seriesObj = {
        kline : {
            name: 'K线图',
            type: 'candlestick',
            data: getValueArr(data),
            itemStyle: {
                normal: {
                    color: upColor,
                    color0: downColor,
                    borderColor: upColor,
                    borderColor0: downColor,
                }
            }
        },
        ma5 : {
            name: 'MA5',
            symbol: 'none', //去掉点
            type: 'line',
            data: getValueMA(5, data),
            smooth: true, //让曲线更加的圆滑
            lineStyle: {
                normal: {opacity: 1}
            },
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1// 0.1的线条是非常细的了
                    }
                }
            }

        },
        ma10 : {
            name: 'MA10',
            symbol: 'none', //去掉点
            type: 'line',
            data: getValueMA(10, data),
            smooth: true,
            lineStyle: {
                normal: {opacity: 1},

            },
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1// 0.1的线条是非常细的了
                    }
                }
            }
        },
        ma20 : {
            name: 'MA20',
            symbol: 'none', //去掉点
            type: 'line',
            data: getValueMA(20, data),
            smooth: true,
            lineStyle: {
                normal: {opacity: 1}
            },
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1// 0.1的线条是非常细的了
                    }
                }
            }
        },
        ma30 : {
            name: 'MA30',
            symbol: 'none', //去掉点
            type: 'line',
            data: getValueMA(30, data),
            smooth: true,
            lineStyle: {
                normal: {opacity: 1}
            },
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1// 0.1的线条是非常细的了
                    }
                }
            }
        },
        ma60 : {
            name: 'MA60',
            symbol: 'none', //去掉点
            type: 'line',
            data: getValueMA(60, data),
            smooth: true,
            lineStyle: {
                normal: {opacity: 1}
            },
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1// 0.1的线条是非常细的了
                    }
                }
            }
        },
        ma120 : {
            name: 'MA120',
            symbol: 'none', //去掉点
            type: 'line',
            data: getValueMA(120, data),
            smooth: true,
            lineStyle: {
                normal: {opacity: 1}
            },
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 1// 0.1的线条是非常细的了
                    }
                }
            }
        },
        volumn : {
            name: '成交量',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: getVolumesArr(data),
            itemStyle: {
                normal: {
                    color: function (params) {
                        var colorList;
                        if (params.data[2] == 1) {
                            colorList = upColor;
                        } else {
                            colorList = downColor;
                        }
                        return colorList;
                    },
                }
            }
        },
        volumn120 : {
            name: '120均量',
            symbol: 'none', //去掉点
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: getIndicatorArr(data, "volume120"),
            lineStyle: {
                normal: {
                    color: volumn120Color,
                    width: 1
                }
            }

        },
        macd : {
            name: 'MACD',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: getIndicatorArr(data, "macd"),
            barWidth: '40%',
            itemStyle: {
                normal: {
                    color: function (params) {
                        var colorList;
                        if (params.data >= 0) {
                            colorList = upColor;
                        } else {
                            colorList = downColor;
                        }
                        return colorList;
                    },
                }
            }
        },
        dif : {
            name: 'DIF',
            type: 'line',
            symbol: "none",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: getIndicatorArr(data, 'dif'),
            lineStyle: {
                normal: {
                    color: difColor,
                    width: 1
                }
            }
        },
        dea : {
            name: 'DEA',
            type: 'line',
            symbol: "none",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: getIndicatorArr(data, 'dea'),
            lineStyle: {
                normal: {
                    opacity: 0.8,
                    color: deaColor,
                    width: 1
                }
            }
        },
        k : {
            name: 'k',
            type: 'line',
            symbol: "none",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: getIndicatorArr(data, 'k'),
            lineStyle: {
                normal: {
                    opacity: 0.8,
                    color: kColor,
                    width: 1
                }
            }
        },
        d : {
            name: 'd',
            type: 'line',
            symbol: "none",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: getIndicatorArr(data, 'd'),
            lineStyle: {
                normal: {
                    opacity: 0.8,
                    color: dColor,
                    width: 1
                }
            }
        },
        j : {
            name: 'j',
            type: 'line',
            symbol: "none",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: getIndicatorArr(data, 'j'),
            lineStyle: {
                normal: {
                    opacity: 0.8,
                    color: jColor,
                    width: 1
                }
            }
        },
        rsi6 : {
            name: 'rsi6',
            type: 'line',
            symbol: "none",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: getIndicatorArr(data, 'rsi6'),
            lineStyle: {
                normal: {
                    opacity: 0.8,
                    color: rsi6Color,
                    width: 1
                }
            }
        },
        rsi12 : {
            name: 'rsi12',
            type: 'line',
            symbol: "none",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: getIndicatorArr(data, 'rsi12'),
            lineStyle: {
                normal: {
                    opacity: 0.8,
                    color: rsi12Color,
                    width: 1
                }
            }
        },
        rsi24 : {
            name: 'rsi24',
            type: 'line',
            symbol: "none",
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: getIndicatorArr(data, 'rsi24'),
            lineStyle: {
                normal: {
                    opacity: 0.8,
                    color: rsi24Color,
                    width: 1
                }
            }
        }
    };
}

export {
    makeOption,
    getOption
}

