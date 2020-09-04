import {colLocation, mouseposition, rowLocation} from "../global/location";
import Store from "../store";
import * as validateO from "../global/validate";
import editor from "../global/editor";
import {jfrefreshgrid} from "../global/refresh";
import {setcellvalue} from "../global/setdata";
import customHandler from "./handler";
import customStore from "./store";
import {ABCatNum, chatatABC} from "../utils/util";
import { getSelectedCellData } from "./method";
import isEmpty from 'lodash/isEmpty';
import forIn from 'lodash/forIn';

/**
 * 给 luckysheet 全局变量添加一些自定义的属性，方便进行自定义逻辑
 * @param luckysheet
 */
export default function customLSheet(luckysheet) {
    luckysheet.mouseposition = mouseposition;
    luckysheet.rowLocation = rowLocation;
    luckysheet.colLocation = colLocation;
    luckysheet.validateO = validateO;
    luckysheet.Store = Store;
    luckysheet.deepCopyFlowData = editor.deepCopyFlowData;
    luckysheet.customStore = customStore;
    luckysheet.chatatABC = chatatABC; // 数字转字母
    luckysheet.ABCatNum = ABCatNum; // 字母转数字。ABCatNum(startCell.replace(/[^A-Za-z]/g, ""));

    luckysheet.getSelectedCellData = getSelectedCellData;

    /**
     * 实时刷新单元格的值，并具备 redo、undo 特性。
     * 默认的 luckysheet.setcellvalue 方法只是更新数据，不会马上刷新表格，且不具备 redo、undo 特性。
     * @param rInd 行索引
     * @param cInd 列索引
     * @param value 值
     * @param extraProps {{}} 单元格额外的属性值
     */
    luckysheet.refreshCellValue = function (rInd, cInd, value, extraProps = {}) {
        let oldData = Store.flowdata;
        let d = editor.deepCopyFlowData(oldData);
        // d[rInd][cInd].m = d[rInd][cInd].v = value;
        setcellvalue(rInd, cInd, d, value);

        if(!isEmpty(extraProps) && d[rInd][cInd]) {
            forIn(extraProps, (v, k) => {
                d[rInd][cInd][k] = v;
            })
        }

        Store.clearjfundo = true;
        jfrefreshgrid(d);
    };

}

/**
 * 初始化自定义的逻辑
 */
export function customInitWork() {
    customHandler(); // 事件
}