import instance from "@/api/http";
import {ChainIdMapByName} from "@/utils/constantData";

export const getMainData = () => {
    return instance.post(`/api/main`);
};
export const getLendingData = (chain,address) => {
    if(!address){
        address="0x0000000000000000000000000000000000000000"
    }
    if (chain === ChainIdMapByName['Mumbai']) {
        chain = 2
    } else {
        chain = 1
    }
    return instance.post(`/api/lending`,{
        chain,
        address
    });
};
