import instance from "@/api/http";
import {ChainIdMapByName} from "@/utils/constantData";

export const getStakeData = (chain = 1, address ) => {
    if (chain === ChainIdMapByName['Mumbai']) {
        chain = 2
    } else {
        chain = 1
    }
    if(!address){
        address= "0x0000000000000000000000000000000000000000"
    }

    return instance.post(`/api/stake`,{
        chain,
        address
    });
};


export const getTokens = (chain = 1, address ) => {
    if (chain === ChainIdMapByName['Mumbai']) {
        chain = 2
    } else {
        chain = 1
    }
    if(!address){
        address= "0x0000000000000000000000000000000000000000"
    }
    return instance.post(`/api/tokens`,{
        chain,
        address
    });
};
export const getBundleTokens = (chain = 1, bundle_id ) => {
    if (chain === ChainIdMapByName['Mumbai']) {
        chain = 2
    } else {
        chain = 1
    }

    return instance.post(`/api/stake/bundle-tokens`,{
        chain,
        bundle_id
    });
};
