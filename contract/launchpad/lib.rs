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
    @member owner creater of locking
    @member start_time Presale start time
    @member end_time Presale end time
    @member soft_cap Presale soft top
    @member hard_cap Presale hard top
    @member token contract of Presale
    @member pay_token pay of Presale
    @member minimum_purchase Minimum purchase quantity
    @member maximum_purchase maximum purchase quantity
    @member price_presale presale price
    @member project_info the information of project
    @member amount the amount of presale
     */
    pub struct PresaleDetail {
        id:u128,
        owner:AccountId,
        start_time:u64,
        end_time: u64,
        soft_cap: u128,
        hard_cap: u128,
        token: AccountId,
        pay_token: AccountId,
        minimum_purchase:u128,
        maximum_purchase:u128,
        price_presale:u128,
        project_info:String,
        amount:u128
    }
    #[ink(storage)]
    pub struct Launchpad {
        user_presales: StorageHashMap<AccountId, Vec<PresaleDetail>>,
        all_presales : Vec<PresaleDetail>,
        presale_charge:StorageHashMap<u128, u128>,

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
                presale_charge:StorageHashMap::new(),
                all_locks:Vec::new()
            }
        }
        /**
        @notice
        create a new presale
        @param data PresaleDetail
         */
        #[ink(message)]
        pub fn create(
            &mut self,
            mut data: PresaleDetail
        ) -> bool {
            if data.token == AccountId::default() {return  false }
            let mut erc20: Erc20 = ink_env::call::FromAccountId::from_account_id(data.toke);
            let _ret = erc20.transfer_from(self.env().caller(),self.env().account_id(),data.amount);
            let mut exists_presale = self.user_presales.get(&self.env().caller()).unwrap_or(&Vec::new()).clone();
            let id = self.all_presales.len() + 1;
            data.id = id;
            exists_presale.push(data.clone());
            self.user_presales.insert(self.env().caller(),exists_presale);
            self.all_presales.push(data);
            true
        }
        /**
        @notice
        Extract locked token
        @param index the id of lock
         */
        #[ink(message)]
        pub fn buy(
            &mut self,
            id:u128,
            amount:u128
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
          Get all presale
       */
        #[ink(message)]
        pub fn get_all_presale(&self) -> Vec<PresaleDetail> {
            self.all_presales.clone()
        }
        /**
        @notice
        Get user's presale
         */
        #[ink(message)]
        pub fn get_user_presale(&self) -> Vec<PresaleDetail> {
            self.user_presales.get(&self.env().caller()).unwrap_or(&Vec::new()).clone()
        }
        /**
          @notice
          Get  presale by id
       */
        #[ink(message)]
        pub fn get_presale(&self,id:u128) -> PresaleDetail {
            self.all_presales[id]
        }
        /**
          @notice
          Get user's presale
       */
        #[ink(message)]
        pub fn get_presale_charge(&self,id:u128) -> u128 {
            self.presale_charge.get(&id).unwrap_or(&0).clone()
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
