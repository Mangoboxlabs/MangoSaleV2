import instance from "@/api/http";
import {ChainIdMapByName} from "@/utils/constantData";

export const getRewardData = (chain = 1, address ) => {
    if (chain === ChainIdMapByName['Mumbai']) {
        chain = 2
    } else {
        chain = 1
    }
    if(!address){
        address= "0x0000000000000000000000000000000000000000"
    }
    return instance.post(`/api/reward`,{
        chain,
        address
    });
};
