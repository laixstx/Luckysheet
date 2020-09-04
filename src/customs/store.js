/**
 * 自定义的数据，用来暂存自定义功能需要的临时变量
 */
const customStore = {
    draggingData: null, // 正在拖拽的数据
    draggingEle: false, // 标识是否正在拖拽元素

    cellPartMerge: null, // hasPartMC 方法返回 true 时，这个值保存 Store.config.merge 对应的对象值
    cellSelectedMove: false, // 是否正在拖动替换单元格
};

export default customStore;