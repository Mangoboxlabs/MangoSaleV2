#![cfg_attr(not(feature = "std"), no_std)]
extern crate alloc;
use ink_lang as ink;
#[allow(unused_imports)]
#[allow(renamed_and_removed_lints)]
#[ink::contract]
mod launchpad {
    use erc20::Erc20;
    use core::convert::TryInto;
    use alloc::string::String;
    use ink_prelude::vec::Vec;
    use ink_storage::{
        collections::HashMap as StorageHashMap,
        traits::{
            PackedLayout,
            SpreadLayout,
        },
    };
    #[derive(Debug,scale::Encode, scale::Decode, Clone, SpreadLayout, PackedLayout)]
    #[cfg_attr(
    feature = "std",
    derive(scale_info::TypeInfo, ink_storage::traits::StorageLayout)
    )]
    /**
    @member ent_time Time of the end of locking
    @member amount Amount of locking
    @member contract contract of locking
    @member contract contract of locking
    @member is_extract Whether it has been extracted
     */
    pub struct PresaleDetail {
        owner:AccountId,
        start_time:u64,
        end_time: u64,
        soft_cap: u128,
        hard_cap: u128,
        token: AccountId,
        pay_token: AccountId,
        minimum_purchase:u128,
        maximum_purchase:u128
    }
    #[ink(storage)]
    pub struct Launchpad {
        user_locks: StorageHashMap<AccountId, Vec<LockDetail>>,
        all_locks : Vec<LockDetail>

    }
    impl Default for launchpad {
        fn default() -> Self {
            Self::new()
        }
    }

    impl launchpad {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                user_locks:StorageHashMap::new(),
                all_locks:Vec::new()
            }
        }
        /**
        @notice
        Add a new token lock

        @param contract Token address
        @param amount Number of locks
        @end_time Lock end time
         */
        #[ink(message)]
        pub fn lock(
            &mut self,
            contract:AccountId,
            amount:u128,
            end_time:u64
        ) -> bool {
            if contract == AccountId::default() {return  false }
            let mut erc20: Erc20 = ink_env::call::FromAccountId::from_account_id(contract);
            let _ret = erc20.transfer_from(self.env().caller(),self.env().account_id(),amount);
            let lock = LockDetail{
                owner:self.env().caller(),
                end_time,
                amount,
                contract,
                is_extract:false
            };
            let mut exists_locks = self.user_locks.get(&self.env().caller()).unwrap_or(&Vec::new()).clone();
            exists_locks.push(lock.clone());
            self.user_locks.insert(self.env().caller(),exists_locks);
            self.all_locks.push(lock);
            true
        }
        /**
        @notice
        Additional locking token
        @param index the id of lock
        @amount Quantity to be locked
         */
        #[ink(message)]
        pub fn additional_tokens(
            &mut self,
            index:u128,
            amount:u128
        ) ->bool {
            let mut exists_locks = self.user_locks.get(&self.env().caller()).unwrap_or(&Vec::new()).clone();
            for (i,value) in exists_locks.iter_mut().enumerate(){
                if i == index.try_into().unwrap() {
                    let mut erc20: Erc20 = ink_env::call::FromAccountId::from_account_id(value.contract);
                    value.amount += amount;
                    let _ret = erc20.transfer_from(self.env().caller(),self.env().account_id(),amount);
                }
            }
            self.user_locks.insert(self.env().caller(),exists_locks);
            true
        }
        /**
        @notice
        Redefine locked time
        @param index the id of lock
        @end_time Lock end time
         */
        #[ink(message)]
        pub fn additional_time(
            &mut self,
            index:u128,
            end_time:u64
        ) ->bool {
            let mut exists_locks = self.user_locks.get(&self.env().caller()).unwrap_or(&Vec::new()).clone();
            for (i,value) in  exists_locks.iter_mut().enumerate(){
                if i == index.try_into().unwrap() {
                    value.end_time = end_time;
                }
            }
            self.user_locks.insert(self.env().caller(),exists_locks);
            true
        }
        /**
        @notice
        Extract locked token
        @param index the id of lock
         */
        #[ink(message)]
        pub fn withdraw_token(
            &mut self,
            index:u128,
        ) ->bool {
            let mut exists_locks = self.user_locks.get(&self.env().caller()).unwrap_or(&Vec::new()).clone();
            for (i,value) in  exists_locks.iter_mut().enumerate(){
                if i == index.try_into().unwrap() {
                    let mut erc20: Erc20 = ink_env::call::FromAccountId::from_account_id(value.contract);
                    assert!(value.end_time <= self.env().block_timestamp());
                    let _ret = erc20.transfer(self.env().caller(),value.amount);
                    value.is_extract = true;
                    value.amount = 0;
                    return true
                }
            }
            false
        }

        /**
        @notice
        Get user's locks
         */
        #[ink(message)]
        pub fn get_user_locks(&self) -> Vec<LockDetail> {
            self.user_locks.get(&self.env().caller()).unwrap_or(&Vec::new()).clone()
        }
    }
    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;
        /// Imports `ink_lang` so we can use `#[ink::test]`.
        use ink_lang as ink;
        #[ink::test]
        fn lock_works() {
            let mut mp = MangoLock::new();
            assert!(mp.lock(AccountId::default(),1,1) == false);
        }
        #[ink::test]
        fn additional_tokens_works() {
            let mut mp = MangoLock::new();
            assert!(mp.additional_tokens(0,1) == true);
        }
        #[ink::test]
        fn additional_time_works() {
            let mut mp = MangoLock::new();
            assert!(mp.additional_time(0,1) == true);
        }
        #[ink::test]
        fn withdraw_token_works() {
            let mut mp = MangoLock::new();
            assert!(mp.withdraw_token(0) == false);
        }
        #[ink::test]
        fn get_user_locks_works() {
            let  mp = MangoLock::new();
            assert!(mp.get_user_locks().len() == 0);
        }
    }
}
