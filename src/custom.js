import {colLocation, mouseposition, rowLocation} from "./global/location";
import Store from "./store";
import * as validateO from "./global/validate";
import editor from "./global/editor";
import {jfrefreshgrid} from "./global/refresh";
import {setcellvalue} from "./global/setdata";

/**
 * 给 luckysheet 全局变量添加一些自定义的属性，方便进行自定义逻辑
 * @param luckysheet
 */
function customLSheet(luckysheet) {
    luckysheet.mouseposition = mouseposition;
    luckysheet.rowLocation = rowLocation;
    luckysheet.colLocation = colLocation;
    luckysheet.customO = Store.customO;
    luckysheet.validateO = validateO;
    luckysheet.Store = Store;
    luckysheet.editor = editor;

    /**
     * 实时刷新单元格的值，并具备 redo、undo 特性。
     * 默认的 luckysheet.setcellvalue 方法只是更新数据，不会马上刷新表格，且不具备 redo、undo 特性。
     * @param rInd 行索引
     * @param cInd 列索引
     * @param value 值
     */
    luckysheet.refreshCellValue = function(rInd, cInd, value) {
        let oldData = Store.flowdata;
        let d = editor.deepCopyFlowData(oldData);
        // d[rInd][cInd].m = d[rInd][cInd].v = value;
        setcellvalue(rInd, cInd, d, value);

        Store.clearjfundo = true;
        jfrefreshgrid(d);
    };

    luckysheet.refreshGridData = function () {

    }
}

export default customLSheet;