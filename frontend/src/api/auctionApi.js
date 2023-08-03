import instance from "@/api/http";
import { ChainIdMapByName } from "@/utils/constantData";

export const getAuctionsData = ({ chain, address, type, is_my_nft, is_ended }) => {
    if (chain === ChainIdMapByName["Mumbai"]) {
        chain = 2;
    } else {
        chain = 1;
    }
    if (!address) {
        address = "0x0000000000000000000000000000000000000000";
    }
    return instance.post(`/api/auctions`, {
        chain,
        address,
        type,
        is_my_nft,
        is_ended,
    });
};

export const subscript = ({ chain = 1, address, bundle_id }) => {
    if (chain === ChainIdMapByName["Mumbai"]) {
        chain = 2;
    } else {
        chain = 1;
    }
    return instance.post(`/api/auction/subscript`, {
        chain,
        address,
        bundle_id,
    });
};
export const unSubscript = ({ chain = 1, address, bundle_id }) => {
    if (chain === ChainIdMapByName["Mumbai"]) {
        chain = 2;
    } else {
        chain = 1;
    }
    return instance.post(`/api/auction/un-subscript`, {
        chain,
        address,
        bundle_id,
    });
};

export const getBidHistory = ({ chain = 1, auction_id }) => {
    if (chain === ChainIdMapByName["Mumbai"]) {
        chain = 2;
    } else {
        chain = 1;
    }
    return instance.post(`/api/auction/bid-history`, {
        chain,
        auction_id,
    });
};

export const getAuctionInfo = ({ chain = 1, bundle_id }) => {
    if (chain === ChainIdMapByName["Mumbai"]) {
        chain = 2;
    } else {
        chain = 1;
    }
    return instance.post(`/api/auction/info`, {
        chain,
        bundle_id,
    });
};
