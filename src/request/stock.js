import { get } from './http'

/* 获取股票列表 */
export const getStockList = p => get('/stock/getstocklist', p);
export const updateStockList = p => get('/stock/updatestocklist', p);
export const updateStockDayInfo = p => get('/stock/updatestockdayinfo', p);
export const updateStockTimeInfo = p => get('/stock/updatestocktimeinfo', p);
export const updateStockWeekInfo = p => get('/stock/updatestockweekinfo', p);
export const updateStockMonthInfo = p => get('/stock/updatestockmonthinfo', p);
export const stopUpdateTaskByType = p => get('/stock/stopupdatetaskbytype', p);

export const getStocktimebar = p => get('/stock/getstocktimebar', p);
export const getStockdaybar = p => get('/stock/getstockdaybar', p);
export const getStockweekbar = p => get('/stock/getstockweekbar', p);
export const getStockmonthbar = p => get('/stock/getstockmonthbar', p);

export const getStockInfoById = p => get('/stock/getstockinfobyid', p);
export const queryStockByFilter = p => get('/stock/querystockbyfilter', p);

export const getShStock = p => get('/stock/getshstock', p);
export const backTest = p => get('/stock/backtest', p)
export const selectReplayList = p => get('/stock/selectreplaylist', p)





