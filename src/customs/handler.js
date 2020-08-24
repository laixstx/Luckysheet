import {colLocation, mouseposition, rowLocation} from "../global/location";
import {getconfig} from "../methods/get";
import {hasPartMC} from "../global/validate";
import {setluckysheet_select_save} from "../methods/set";
import {selectHightlightShow} from "../controllers/select";
import customConfig from "./config";
import customStore from "./store";

export default function customHandler() {

    /**
     * 表格区域-拖拽移动
     */
    $('#luckysheet-cell-main').on('dragover', function (event) {
        event.preventDefault();
        if (!customStore.draggingEle) return;

        let mouse = mouseposition(event.pageX, event.pageY);

        let scrollLeft = $("#luckysheet-cell-main").scrollLeft();
        let scrollTop = $("#luckysheet-cell-main").scrollTop();

        let x = mouse[0] + scrollLeft;
        let y = mouse[1] + scrollTop;

        let rowLoc = rowLocation(y),
            rowInd = rowLoc[2];
        let colLoc = colLocation(x),
            colInd = colLoc[2];

        let conf = getconfig();
        let cellMg = conf.merge[`${rowInd}_${colInd}`];

        // 如果选区([rowInd, rowInd] [colInd, colInd])被包含在某个“合并单元格”内，
        // 则以选中这个“合并单元格”
        if (hasPartMC(conf, rowInd, rowInd, colInd, colInd)) {
            cellMg = customStore.cellPartMerge;
            rowInd = cellMg.r;
            colInd = cellMg.c;

            customStore.cellPartMerge = null; // 清空临时变量
        }

        let rowEInd = rowInd;
        let colEInd = colInd;

        if (cellMg) {
            rowEInd = rowInd + cellMg.rs - 1;
            colEInd = colInd + cellMg.cs - 1;
        }
        // 设置并更新选区
        setluckysheet_select_save([{
            row: [rowInd, rowEInd],
            column: [colInd, colEInd]
        }]);
        selectHightlightShow();

    }).on('drop', function (event) { // 松开拖拽动作之后
        customStore.draggingEle = false;

        if(customConfig.onCellDrop) {
            customConfig.onCellDrop();
        }
    })

}