/**
 * 获取选中的单个单元格的数据
 *  - 当选中多个单元格时，返回 null
 */
import {getdatabyselection} from "../global/getdata";
import isEmpty from 'lodash/isEmpty'
import customConfig from "./config";
import {getconfig, getluckysheet_select_save} from "../methods/get";
import Store from "../store";

/**
 * 切换选中的单元格之后，回调 customConfig.onCellSelect
 */
export function onCellSelect() {
    const selCellData = getSelectedCellData();
    // console.log('表格 mouseup，selCellData', selCellData);
    if (customConfig.onCellSelect) {
        customConfig.onCellSelect(selCellData);
    }
}

export function getSelectedCellData() {
    let cellData = null;
    let selSave = getluckysheet_select_save();

    if (selSave.length > 1) { // 有多个选区
        return cellData;
    }

    let {column, row, column_focus, row_focus} = selSave[0];
    let maxC = column[1];
    let maxR = row[1];
    let mergeO = getconfig().merge || {};
    let mc = mergeO[`${row_focus}_${column_focus}`];
    if (mc) { // 聚焦单元格是合并单元格
        let {r, c, rs, cs} = mc;
        // 如果选中区域的最大单元格超出合并单元格的范围，说明选中多个单元格，则返回 null
        if (maxC > c + cs || maxR > r + rs) {
            return cellData;
        }

        // 如果聚焦单元格不是合并单元格，且选中多个单元格，则返回 null
    } else if (maxC > column_focus || maxR > row_focus) {
        return cellData;
    }

    let cellV = Store.flowdata ? Store.flowdata[row_focus][column_focus] : {};
    cellData = {
        r: row_focus,
        c: column_focus,
        v: cellV
    };

    return cellData;
}