#![cfg_attr(not(feature = "std"), no_std)]
extern crate alloc;
use ink_lang as ink;
pub use self::launchpad::{
    Launchpad
};
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
    pub struct PresaleDetail {
        id:u128,
        /// creater of presale
        owner:AccountId,
        /// Presale start time
        start_time:u64,
        /// Presale end time
        end_time: u64,
        /// Presale soft top
        soft_cap: u128,
        /// Presale hard top
        hard_cap: u128,
        /// contract of Presale
        token: AccountId,
        /// pay of Presale
        pay_token: AccountId,
        /// Minimum purchase quantity
        minimum_purchase:u128,
        /// maximum purchase quantity
        maximum_purchase:u128,
        /// presale price
        price_presale:u128,
        /// the information of project
        project_info:String,
        /// the amount of presale
        amount:u128,
    }
    /// A  Launchpad contract.
    #[ink(storage)]
    pub struct Launchpad {
        user_presales: StorageHashMap<AccountId, Vec<PresaleDetail>>,
        all_presales : Vec<PresaleDetail>,
        presale_charge:StorageHashMap<u128, u128>,
        every_presale:StorageHashMap<u128, PresaleDetail>,
        user_charge:StorageHashMap<(AccountId,u128), u128>,
        user_reward:StorageHashMap<(AccountId,u128), u128>,
    }
    impl Default for Launchpad {
        fn default() -> Self {
            Self::new()
        }
    }

    impl Launchpad {
        /// Creates a new launchpad
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                user_presales:StorageHashMap::new(),
                presale_charge:StorageHashMap::new(),
                every_presale:StorageHashMap::new(),
                user_charge:StorageHashMap::new(),
                user_reward:StorageHashMap::new(),
                all_presales:Vec::new()
            }
        }

        /// create a new presale
        ///
        /// Returns `false` if the token is non.
        #[ink(message)]
        pub fn create(
            &mut self,
            info: PresaleDetail
        ) -> bool {
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

        /// buy by presale
        ///
        /// Returns `false` if the token is non.
        #[ink(message)]
        pub fn buy(
            &mut self,
            id:u128,
            amount:u128
        ) ->bool {
            let charge = self.get_presale_charge(id);
            let presale = self.get_presale(id);
            if presale.token == AccountId::default() {return  false }
            // let mut erc20: Erc20 = ink_env::call::FromAccountId::from_account_id(presale.pay_token);
            let mut pay_erc20: Erc20 = ink_env::call::FromAccountId::from_account_id(presale.pay_token);
            assert!(presale.end_time > self.env().block_timestamp());
            assert!(presale.start_time < self.env().block_timestamp());
            assert!(presale.minimum_purchase < amount);
            assert!(presale.maximum_purchase > amount);
            let _ret = pay_erc20.transfer_from(self.env().caller(),self.env().account_id(),amount);
            self.presale_charge.insert(id,charge + amount);
            let reward_amount = presale.price_presale * amount;
            // let _ret = pay_erc20.transfer(self.env().caller(),reward_amount);
            let  user_charge = *self.user_charge.get(&(self.env().caller(),id)).unwrap_or(&0);
            let  user_reward = *self.user_reward.get(&(self.env().caller(),id)).unwrap_or(&0);
            self.user_charge.insert((self.env().caller(),id),user_charge + amount);
            self.user_reward.insert((self.env().caller(),id),user_reward + reward_amount);
            true
        }
        /// Extract locked token
        ///
        /// Returns `false` if the token is non.
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
        ///  Get the user reward by id
        ///
        /// Returns `0` if the reward is non.
        #[ink(message)]
        pub fn get_reward(
            &self,
            id:u128
        )->u128{
            *self.user_reward.get(&(self.env().caller(),id)).unwrap_or(&0)
        }

        ///  Get the state  by id
        ///
        /// Returns `false` if soft_cap > charge.
        #[ink(message)]
        pub fn state(&self,id:u128) -> bool {
            let presale = self.get_presale(id);
            let charge = self.get_presale_charge(id);
            if presale.soft_cap < charge {
                return true;
            }
            false
        }
        ///   Get all presale
        #[ink(message)]
        pub fn get_all_presale(&self) -> Vec<PresaleDetail> {
            self.all_presales.clone()
        }
        ///   Get user's presale
        #[ink(message)]
        pub fn get_user_presale(&self) -> Vec<PresaleDetail> {
            self.user_presales.get(&self.env().caller()).unwrap_or(&Vec::new()).clone()
        }
        ///  Get  presale by id
        #[ink(message)]
        pub fn get_presale(&self,id:u128) -> PresaleDetail {
            let default_pre = PresaleDetail {
                id:0,
                owner:AccountId::default(),
                start_time:0,
                end_time:0,
                soft_cap:0,
                hard_cap:0,
                token: AccountId::default(),
                pay_token: AccountId::default(),
                minimum_purchase:0,
                maximum_purchase:0,
                price_presale:0,
                project_info:String::from("test"),
                amount:0
            };
            self.every_presale.get(&id).unwrap_or(&default_pre).clone()
        }
       /// Get user's presale
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
            let mut mp = Launchpad::new();
            assert!(mp.buy(1,1) == false);
        }
        #[ink::test]
        fn create_works() {
            let mut mp = Launchpad::new();
            let default_pre = PresaleDetail {
                id:0,
                owner:AccountId::default(),
                start_time:0,
                end_time:0,
                soft_cap:0,
                hard_cap:0,
                token: AccountId::default(),
                pay_token: AccountId::default(),
                minimum_purchase:0,
                maximum_purchase:0,
                price_presale:0,
                project_info:String::from("test"),
                amount:0
            };
            assert!(mp.create(default_pre) == false);
        }
        #[ink::test]
        fn get_all_presale_works() {
            let  mp = Launchpad::new();
            assert!(mp.get_all_presale().len() == 0);
        }
        #[ink::test]
        fn get_user_presale_works() {
            let  mp = Launchpad::new();
            assert!(mp.get_user_presale().len() == 0);
        }
        #[ink::test]
        fn get_presale_works() {
            let  mp = Launchpad::new();
            assert!(mp.get_presale(0).id == 0);
        }
        #[ink::test]
        fn get_presale_charge_works() {
            let  mp = Launchpad::new();
            assert!(mp.get_presale_charge(0) == 0);
        }
        #[ink::test]
        fn claim_works() {
            let mut  mp = Launchpad::new();
            assert!(mp.claim(0) == false);
        }
        #[ink::test]
        fn state_works() {
            let  mp = Launchpad::new();
            assert!(mp.state(0) == false);
        }
        #[ink::test]
        fn get_reward_works() {
            let  mp = Launchpad::new();
            assert!(mp.get_reward(0) == 0);
        }
    }
}
