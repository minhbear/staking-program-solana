import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { createMint, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { StakingProrgam } from "../target/types/staking_prorgam";

describe("staking-prorgam", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;
  const connection = new Connection('http://127.0.0.1:8899', "confirmed");
  // const mintKeypair = Keypair.fromSecretKey(new Uint8Array([
  //   172, 213,  39,  65,  95, 118, 253, 185,   5, 202,
  //    90, 229, 140, 193,  82, 122, 188, 178, 188,  97,
  //   198, 158,   7, 129,  13,  20, 143, 138,  27,  78,
  //   181, 235, 143, 241, 184,  17, 147, 131, 205, 222,
  //   205,  37, 209, 237,  60, 207, 196, 238, 212, 202,
  //   169, 247, 138, 184, 160, 136, 103,  36, 219, 181,
  //   211, 228, 206, 173
  // ]));
  const mintKeypair = Keypair.generate()

  async function createMintToken() {
    const mint = await createMint(
      connection,
      payer.payer,
      payer.publicKey,
      payer.publicKey,
      9,  
      mintKeypair
    )

    console.log('created mint token account: ', mint)
  }

  const program = anchor.workspace.StakingProrgam as Program<StakingProrgam>;

  it("Is initialized!", async () => {
    await createMintToken()
    let [vaultAccount] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault')],
      program.programId
    )

    const tx = await program.methods.initialize()
    .accounts({
      signer: payer.publicKey,
      tokenVaultAccount: vaultAccount,
      mint: mintKeypair.publicKey,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID
    })
    .rpc();

    console.log("Your transaction signature", tx);
  });
});

