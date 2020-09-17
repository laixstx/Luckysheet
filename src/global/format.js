import { getcellvalue } from "./getdata";


export function genarate(value) {
    var ret = [];
    var m = null, ct = {}, v = value;

    if (value == null) {
        return null;
    }

    m = value;
    ct.fa = "General";
    ct.t = "g";

    return [m, ct, v];
}

export function update(fmt, v) {
    return v;
}

export function is_date(fmt, v) {
    return false;
}

export function valueShowEs(r, c, d) {
    var value = getcellvalue(r, c, d, "v");
    return value;
}
