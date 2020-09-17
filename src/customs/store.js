import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import cloneDeep from 'lodash/cloneDeep';

const defaultValue = {
    draggingData: null, // 正在拖拽的数据
    draggingEle: false, // 标识是否正在拖拽元素

    cellPartMerge: null, // hasPartMC 方法返回 true 时，这个值保存 Store.config.merge 对应的对象值
    cellSelectedMove: false, // 是否正在拖动替换单元格

    cellDbClick: false, // 标识是否双击单元格

    rowMarks: null, // 行标记。以 `_${r}` 为 key，以 {r:number, markContent: string} 为 value。例如：{_2: {r: 2, markContent: '<span>x</span>'}}
    colMarks: null,
    cellMarks: null,

    rowHidden: null,
    colHidden: null,
};

/**
 * 自定义的数据，用来暂存自定义功能需要的临时变量
 */
const customStore = { ...defaultValue };

export function initCustomStore(setting) {

    for (let k in defaultValue) {
        if (defaultValue.hasOwnProperty(k)) {
            let v;
            let setV = setting[k];

            if ('undefined' === typeof setV) {
                v = cloneDeep(defaultValue[k]);
            } else if (isArray(setV) || isObject(setV)) {
                v = cloneDeep(setV);
            } else {
                v = setV;
            }

            customStore[k] = v;
        }
    }
    // console.log('initCustomStore', setting, customStore);
}

export default customStore;