import {getTranStatus} from "@/api/common";


export const dealRes = async (transactionHash) => {
    let statusRes = await getTranStatus(transactionHash);
    if (statusRes.data.data == 1) {
        setTimeout(() => {
            return
        }, 3000);
    } else {
        setTimeout(() => {
            dealRes(transactionHash);
        }, 3000);
    }
}
