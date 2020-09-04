const defaultC$data = {
    "name": "", // 单元格名称。如：B2
    "leftParentCellName": "", //左父格。如：A1
    "topParentCellName": "", //上父格。如：A2
    "fillBlankRows": false, //是否填充空白行
    "multiple": 0, //数据行倍数,填充数据行数为 multiple - (size % multiple)
    "expand": "NONE", //扩展 RIGHT, DOWN, NONE;
    //链接相关暂时不做
    // "linkUrl":"",
    // "linkTargetWindow":"",
    // "linkParameters":[],

    "conditionPropertyItems": [], //条件属性配置，查看conditionPropertyItems.json

    "cellType": "SIMPLE", //SIMPLE, EXPRESSION, DATASET, FI_EXPRESSION
    "datasetValue": {  //数据集值
        "code": "", //数据集code
        "name": "",  //数据集名称
        "property": "",  //属性名
        "aggregate": "GROUP", //聚合方式 GROUP, CUSTOMGROUP, REGROUP, SELECT, RESELECT, SUM, AVG, MAX, MIN, COUNT
        "order": "DESC",  //排序方式
        "groupItems": [],
    },
    "simpleValue": "", //普通文本值
    "expressionValue": "", //表达式值

    //数据映射
    "mappingType": "SIMPLE", //映射类型 SIMPLE, DATASET
    "mappingDataset": "", //映射数据集code
    "mappingValueProperty": "", //数据集映射显示值
    "mappingKeyProperty": "", //数据集映射实际值
    "mappingItems": [],

    //过滤条件
    "conditions": [],
}

const SheetData = {
    
    updateCellData: function (r, c, data, isWhole) {
        if(isWhole) {
            this.data = data;
        } else {
            for(var k in data) {
                if(data.hasOwnProperty(k)) {
                    this.data[k] = data[k];
                }
            }
        }
    }
};

export default SheetData;