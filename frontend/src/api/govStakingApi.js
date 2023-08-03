import instance from "@/api/http";
import {ChainIdMapByName} from "@/utils/constantData";

export const getProductList = (chain = 1, address) => {
    if (chain === ChainIdMapByName['Mumbai']) {
        chain = 2
    } else {
        chain = 1
    }
    if (!address) {
        address = "0x0000000000000000000000000000000000000000"
    }
    return instance.post(`/api/staking/product-list`, {
        chain,
    });
};

export const getPositions = (chain = 1, address) => {
    if (chain === ChainIdMapByName['Mumbai']) {
        chain = 2
    } else {
        chain = 1
    }
    if (!address) {
        address = "0x0000000000000000000000000000000000000000"
    }
    return instance.post(`/api/staking/positions`, {
        chain,
        address
    });
};


export const getPositionsMore = ({
                                     chain,
                                     address,
                                     limit,
                                     skip,
                                     type
                                 }) => {
    console.log({
        chain,
        address,
        limit,
        skip,
        type
    })
    if (chain === ChainIdMapByName['Mumbai']) {
        chain = 2
    } else {
        chain = 1
    }
    if (!address) {
        address = "0x0000000000000000000000000000000000000000"
    }
    return instance.post(`/api/staking/position-more`, {
        chain,
        address,
        limit,
        skip,
        type
    });
};
export const updateAutoReinvestment = ({
       signature,
       token_id,
       chain,
       autoReinvestment,
       datetime,
   }) => {


    return instance.post(`/api/staking/update-auto-reinvestment`, {
        signature,
        token_id,
        chain,
        autoReinvestment,
        datetime,
    });
};