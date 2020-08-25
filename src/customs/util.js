/**
 * 递归查找
 * @param data
 * @param func
 * @param parentObj
 * @param childKeyName
 * @param parentInd
 * @return {null}
 */
export const recursiveFind = (data, func, parentObj, childKeyName = 'children', parentInd = null) => {

    if (data && data.length > 0) {
        let reObj = null;

        for (let key = 0, len = data.length; key < len; key++) {
            const obj = data[key];
            const isOk = func(obj, key, parentObj, parentInd);
            // console.log('isOk',isOk);
            if (!isOk && obj) {

                if (obj[childKeyName]) {
                    // @ts-ignore
                    reObj = recursiveFind(obj[childKeyName], func, obj, childKeyName, key);

                    if (reObj) break;
                }

            } else {
                reObj = obj;
                break;
            }
        }
        return reObj;

    } else {
        return null;
    }
};
