# MangoSale
## Contract introduction
- Launchpad: Launchpad can conduct Token auctions at a fixed price.
- FairLaunch:Fair Launch can conduct Token auctions in the form of fair launch.
- DutchAuction :Dutch Auction can conduct Token auctions in the form of Dutch auctions.


## Installing
### Before you begin
```
sudo apt install build-essential
```

At a minimum, you need the following packages before you install Rust:

```
clang curl git make
```
### Install required packages and Rust
```
sudo apt install --assume-yes git clang curl libssl-dev llvm libudev-dev make protobuf-compiler
```

Download the rustup installation program and use it to install Rust by running the following command:
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
Update your current shell to include Cargo by running the following command:
```
source $HOME/.cargo/env
```
Please make sure that you have these prerequisites installed on your computer:

```bash
rustup install nightly-2022-06-27
rustup component add rust-src --toolchain nightly-2022-06-27
rustup target add wasm32-unknown-unknown --toolchain nightly-2022-06-27
```

Then you have to install ink! command line utility which will make setting up Substrate smart contract projects easier:

```bash
cargo install cargo-contract --vers 0.15.0 --force --locked
```

You also need the [binaryen](https://github.com/WebAssembly/binaryen) package installed on your computer which is used to optimize the WebAssembly bytecode of the contract, you can use npm to install it:

```bash
npm install -g binaryen
```

## Testing
### Command  test
First of all you need to clone the repository, run:

```bash
https://github.com/Mangoboxlabs/MangoSaleV2.git
cd MangoSaleV2/contract
```

Then, You can enter any folder and enter the following command.

```bash
cargo test
```
### Test by polkadot.js apps
visit [contracts UI](https://weightv1--contracts-ui.netlify.app/?rpc=wss://rpc.mangobox.xyz).
then `Add New Contract`->`Upload New Contract Code`.Then upload your compiled `.contract` file.
#### Use Local Node
```
wget https://github.com/paritytech/substrate-contracts-node/releases/download/v0.20.0/substrate-contracts-node-linux.tar.gz
tar -zxvf substrate-contracts-node-linux.tar.gz
mv artifacts/substrate-contracts-node-linux/substrate-contracts-node ./
./substrate-contracts-node
```
visit [contracts UI](https://weightv1--contracts-ui.netlify.app/), and connect local node(ws://127.0.0.1:9944).

#### Contract deployment steps
token_factory > launchpad > fair_launchpad > dutch_auction

You need to use a token_factory creates two erc20 tokens, one for payment of fees and the other for presale tokens.
## Building

To build the WASM of your contract and metadata, You can enter any folder and enter the following command.
```bash
cargo +nightly-2022-06-27 contract build
```
If you show up ``CodeRejected: Can't decode wasm code``,That's because the rust version is incompatible with the current ink version,Please  enter the following command.
```
cargo +nightly-2022-06-27 contract build --optimization-passes=0
```
