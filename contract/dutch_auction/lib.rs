#![cfg_attr(not(feature = "std"), no_std)]
extern crate alloc;
use ink_lang as ink;
#[allow(unused_imports)]
#[allow(renamed_and_removed_lints)]
#[ink::contract]
mod dutch_auction {
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
    @member owner creater of presale
    @member start_time Presale start time
    @member end_time Presale end time
    @member soft_cap Presale soft top
    @member hard_cap Presale hard top
    @member token contract of Presale
    @member pay_token pay of Presale
    @member minimum_purchase Minimum purchase quantity
    @member maximum_purchase maximum purchase quantity
    @member project_info the information of project
    @member amount the amount of presale
     */
    pub struct PresaleDetail {
        id:u128,
        owner:AccountId,
        start_time:u64,
        end_time: u64,
        soft_cap: u128,
        hard_cap:u128,
        start_price:u128,
        end_price:u128,
        decrease_price_cycle:u128,
        token: AccountId,
        pay_token: AccountId,
        minimum_purchase:u128,
        maximum_purchase:u128,
        project_info:String,
        amount:u128,

    }
    #[ink(storage)]
    pub struct DutchAuction {
        user_presales: StorageHashMap<AccountId, Vec<PresaleDetail>>,
        all_presales : Vec<PresaleDetail>,
        presale_charge:StorageHashMap<u128, u128>,
        every_presale:StorageHashMap<u128, PresaleDetail>,
        user_charge:StorageHashMap<(AccountId,u128), u128>,
        all_charge:StorageHashMap<u128, u128>,
        user_reward:StorageHashMap<(AccountId,u128), u128>,
    }
    impl Default for DutchAuction {
        fn default() -> Self {
            Self::new()
        }
    }

    impl DutchAuction {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                user_presales:StorageHashMap::new(),
                presale_charge:StorageHashMap::new(),
                every_presale:StorageHashMap::new(),
                user_charge:StorageHashMap::new(),
                all_charge:StorageHashMap::new(),
                user_reward:StorageHashMap::new(),
                all_presales:Vec::new()
            }
        }
        /**
        @notice
        create a new presale
        @param info PresaleDetail
         */
        #[ink(message)]
        pub fn create(
            &mut self,
            info: PresaleDetail
        ) -> bool {
            assert!(info.start_price > info.end_price);
            let mut data = info;
            if data.token == AccountId::default() {return  false }
            let mut erc20: Erc20 = ink_env::call::FromAccountId::from_account_id(data.token);
            let _ret = erc20.transfer_from(self.env().caller(),self.env().account_id(),data.amount);
            let mut exists_presale = self.user_presales.get(&self.env().caller()).unwrap_or(&Vec::new()).clone();
            let id = self.all_presales.len() + 1;
            data.id = id.try_into().unwrap();
            exists_presale.push(data.clone());
            self.user_presales.insert(self.env().caller(),exists_presale);
            self.every_presale.insert(id.try_into().unwrap(),data.clone());
            self.all_presales.push(data);
            true
        }
        /**
        @notice
        buy by presale
        @param id the id of presale
        @param amount the amount of presale
         */
        #[ink(message)]
        pub fn buy(
            &mut self,
            id:u128,
            amount:u128
        ) ->bool {
            let charge = *self.presale_charge.get(&id).unwrap_or(&0);
            let presale = self.get_presale(id);
            if presale.token == AccountId::default() {return  false }
            let mut pay_erc20: Erc20 = ink_env::call::FromAccountId::from_account_id(presale.pay_token);
            assert!(presale.end_time > self.env().block_timestamp());
            assert!(presale.start_time < self.env().block_timestamp());
            assert!(presale.minimum_purchase < amount);
            assert!(presale.maximum_purchase > amount);
            let _ret = pay_erc20.transfer_from(self.env().caller(),self.env().account_id(),amount);
            self.presale_charge.insert(id,charge + amount);
            let  user_charge = *self.user_charge.get(&(self.env().caller(),id)).unwrap_or(&0);
            let  all_charge = *self.all_charge.get(&id).unwrap_or(&0);
            self.user_charge.insert((self.env().caller(),id),user_charge + amount);
            self.all_charge.insert(id,all_charge + amount);
            let current_price = self.get_current_price(id);
            let can_reward = amount * current_price;
            let  user_reward = *self.user_reward.get(&(self.env().caller(),id)).unwrap_or(&0);
            self.user_reward.insert((self.env().caller(),id),user_reward + can_reward);
            true
        }
        /**
          @notice
          Extract locked token
          @param id the id of presale
           */
        #[ink(message)]
        pub fn claim(
            &mut self,
            id:u128,
        ) ->bool {
            let presale = self.get_presale(id);
            if presale.token == AccountId::default() {return  false }
            assert!(presale.end_time < self.env().block_timestamp());
            assert!(self.state(id));
            let user_reward = self.get_reward(id);
            let mut erc20: Erc20 = ink_env::call::FromAccountId::from_account_id(presale.token);
            let _ret = erc20.transfer(self.env().caller(),user_reward);
            self.user_reward.insert((self.env().caller(),id),0);
            true
        }
        /**
          @notice
          Get the price  by id
          @param id the id of presale
       */
        #[ink(message)]
        pub fn get_current_price(
            &self,
            id:u128
        ) -> u128 {
            let presale = self.get_presale(id);
            let current_price = presale.start_price;
            if presale.token == AccountId::default() {return 1}
            let diff_cycle= ((self.env().block_timestamp() - presale.start_time) / 1000) as u128 / presale.decrease_price_cycle;
            let diff_price = presale.start_price - diff_cycle;
            if diff_price>0 {
                1
            } else {
                current_price
            }

        }
        /**
       @notice
       Get the user reward by id
       @param id the id of presale
        */
        #[ink(message)]
        pub fn get_reward(
            &self,
            id:u128
        )->u128{
            *self.user_reward.get(&(self.env().caller(),id)).unwrap_or(&0)
        }
        /**
         @notice
         Get the state  by id
         @param id the id of presale
      */
        #[ink(message)]
        pub fn state(&self,id:u128) -> bool {
            let presale = self.get_presale(id);
            let charge = self.get_presale_charge(id);
            if presale.soft_cap < charge {
                 return true;
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
            let default_pre = PresaleDetail {
                id:0,
                owner:AccountId::default(),
                start_time:0,
                end_time:0,
                soft_cap:0,
                hard_cap:0,
                start_price:0,
                end_price:0,
                decrease_price_cycle:0,
                token: AccountId::default(),
                pay_token: AccountId::default(),
                minimum_purchase:0,
                maximum_purchase:0,
                project_info:String::from("test"),
                amount:0
            };
            self.every_presale.get(&id).unwrap_or(&default_pre).clone()
        }
        /**
          @notice
          Get user's presale
       */
        #[ink(message)]
        pub fn get_presale_charge(&self,id:u128) -> u128 {
            *self.presale_charge.get(&id).unwrap_or(&0)
        }
    }
    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;
        /// Imports `ink_lang` so we can use `#[ink::test]`.
        use ink_lang as ink;
        #[ink::test]
        fn buy_works() {
            let mut mp = DutchAuction::new();
            assert!(mp.buy(1,1) == false);
        }
        #[ink::test]
        fn create_works() {
            let mut mp = DutchAuction::new();
            let default_pre = PresaleDetail {
                id:0,
                owner:AccountId::default(),
                start_time:0,
                end_time:0,
                soft_cap:0,
                hard_cap:0,
                start_price:1,
                end_price:0,
                decrease_price_cycle:0,
                token: AccountId::default(),
                pay_token: AccountId::default(),
                minimum_purchase:0,
                maximum_purchase:0,
                project_info:String::from("test"),
                amount:0
            };
            assert!(mp.create(default_pre) == false);
        }
        #[ink::test]
        fn get_all_presale_works() {
            let  mp = DutchAuction::new();
            assert!(mp.get_all_presale().len() == 0);
        }
        #[ink::test]
        fn get_user_presale_works() {
            let  mp = DutchAuction::new();
            assert!(mp.get_user_presale().len() == 0);
        }
        #[ink::test]
        fn get_presale_works() {
            let  mp = DutchAuction::new();
            assert!(mp.get_presale(0).id == 0);
        }
        #[ink::test]
        fn get_presale_charge_works() {
            let  mp = DutchAuction::new();
            assert!(mp.get_presale_charge(0) == 0);
        }
        #[ink::test]
        fn claim_works() {
            let mut  mp = DutchAuction::new();
            assert!(mp.claim(0) == false);
        }
        #[ink::test]
        fn state_works() {
            let  mp = DutchAuction::new();
            assert!(mp.state(0) == false);
        }
        #[ink::test]
        fn get_reward_works() {
            let  mp = DutchAuction::new();
            assert!(mp.get_reward(0) == 0);
        }
        #[ink::test]
        fn get_current_price_works() {
            let  mp = DutchAuction::new();
            assert!(mp.get_current_price(0) == 1);
        }
    }
}
