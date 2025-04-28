/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/aydo.json`.
 */
export type Aydo = {
  address: '9yfK1UMw4EjX9XViX3SwaufH7q6TaypzhycMQn6r9Z5Z';
  metadata: {
    name: 'aydo';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'acceptDeal';
      discriminator: [76, 156, 34, 30, 129, 136, 76, 244];
      accounts: [
        {
          name: 'deal';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [100, 101, 97, 108];
              },
              {
                kind: 'arg';
                path: 'id';
              },
            ];
          };
        },
        {
          name: 'offer';
          writable: true;
          relations: ['deal'];
        },
        {
          name: 'buyer';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [98, 117, 121, 101, 114];
              },
              {
                kind: 'account';
                path: 'owner';
              },
            ];
          };
        },
        {
          name: 'owner';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'id';
          type: 'u64';
        },
      ];
    },
    {
      name: 'acceptStreamData';
      discriminator: [1, 252, 61, 135, 148, 219, 12, 109];
      accounts: [
        {
          name: 'buyer';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [98, 117, 121, 101, 114];
              },
              {
                kind: 'account';
                path: 'owner';
              },
            ];
          };
        },
        {
          name: 'deal';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [100, 101, 97, 108];
              },
              {
                kind: 'arg';
                path: 'dealId';
              },
            ];
          };
        },
        {
          name: 'offer';
          writable: true;
          relations: ['deal'];
        },
        {
          name: 'streamer';
          writable: true;
          relations: ['deal'];
        },
        {
          name: 'owner';
          writable: true;
          signer: true;
        },
        {
          name: 'buyerTokenAccount';
          writable: true;
        },
        {
          name: 'streamerTokenAccount';
          writable: true;
        },
        {
          name: 'mint';
        },
        {
          name: 'tokenProgram';
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'dealId';
          type: 'u64';
        },
        {
          name: 'count';
          type: 'u32';
        },
      ];
    },
    {
      name: 'createBuyer';
      discriminator: [194, 147, 244, 216, 132, 37, 15, 171];
      accounts: [
        {
          name: 'buyer';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [98, 117, 121, 101, 114];
              },
              {
                kind: 'account';
                path: 'owner';
              },
            ];
          };
        },
        {
          name: 'owner';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [];
    },
    {
      name: 'createDeal';
      discriminator: [198, 212, 144, 151, 97, 56, 149, 113];
      accounts: [
        {
          name: 'deal';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [100, 101, 97, 108];
              },
              {
                kind: 'arg';
                path: 'id';
              },
            ];
          };
        },
        {
          name: 'offer';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [111, 102, 102, 101, 114];
              },
              {
                kind: 'arg';
                path: 'offerId';
              },
            ];
          };
        },
        {
          name: 'streamer';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [115, 116, 114, 101, 97, 109, 101, 114];
              },
              {
                kind: 'account';
                path: 'owner';
              },
            ];
          };
        },
        {
          name: 'owner';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'id';
          type: 'u64';
        },
        {
          name: 'offerId';
          type: 'u64';
        },
        {
          name: 'encryptedData';
          type: 'string';
        },
      ];
    },
    {
      name: 'createOffer';
      discriminator: [237, 233, 192, 168, 248, 7, 249, 241];
      accounts: [
        {
          name: 'offer';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [111, 102, 102, 101, 114];
              },
              {
                kind: 'arg';
                path: 'id';
              },
            ];
          };
        },
        {
          name: 'buyer';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [98, 117, 121, 101, 114];
              },
              {
                kind: 'account';
                path: 'owner';
              },
            ];
          };
        },
        {
          name: 'owner';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'id';
          type: 'u64';
        },
        {
          name: 'location';
          type: 'string';
        },
        {
          name: 'price';
          type: 'u64';
        },
      ];
    },
    {
      name: 'createStreamer';
      discriminator: [192, 22, 239, 153, 57, 26, 45, 12];
      accounts: [
        {
          name: 'streamer';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [115, 116, 114, 101, 97, 109, 101, 114];
              },
              {
                kind: 'account';
                path: 'owner';
              },
            ];
          };
        },
        {
          name: 'owner';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [];
    },
    {
      name: 'deleteOffer';
      discriminator: [144, 92, 174, 254, 109, 200, 70, 39];
      accounts: [
        {
          name: 'offer';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [111, 102, 102, 101, 114];
              },
              {
                kind: 'arg';
                path: 'id';
              },
            ];
          };
        },
        {
          name: 'buyer';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [98, 117, 121, 101, 114];
              },
              {
                kind: 'account';
                path: 'owner';
              },
            ];
          };
        },
        {
          name: 'owner';
          signer: true;
        },
      ];
      args: [
        {
          name: 'id';
          type: 'u64';
        },
      ];
    },
    {
      name: 'depositFunds';
      discriminator: [202, 39, 52, 211, 53, 20, 250, 88];
      accounts: [
        {
          name: 'buyer';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [98, 117, 121, 101, 114];
              },
              {
                kind: 'account';
                path: 'owner';
              },
            ];
          };
        },
        {
          name: 'owner';
          writable: true;
          signer: true;
        },
        {
          name: 'ownerTokenAccount';
          writable: true;
        },
        {
          name: 'buyerTokenAccount';
          writable: true;
        },
        {
          name: 'mint';
        },
        {
          name: 'tokenProgram';
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
    {
      name: 'withdrawReward';
      discriminator: [191, 187, 176, 137, 9, 25, 187, 244];
      accounts: [
        {
          name: 'streamer';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [115, 116, 114, 101, 97, 109, 101, 114];
              },
              {
                kind: 'account';
                path: 'owner';
              },
            ];
          };
        },
        {
          name: 'owner';
          writable: true;
          signer: true;
        },
        {
          name: 'commissionOwner';
          writable: true;
        },
        {
          name: 'streamerTokenAccount';
          writable: true;
        },
        {
          name: 'ownerTokenAccount';
          writable: true;
        },
        {
          name: 'commissionTokenAccount';
          writable: true;
        },
        {
          name: 'mint';
        },
        {
          name: 'tokenProgram';
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'amount';
          type: 'u64';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'buyer';
      discriminator: [212, 193, 28, 181, 26, 219, 85, 174];
    },
    {
      name: 'deal';
      discriminator: [125, 223, 160, 234, 71, 162, 182, 219];
    },
    {
      name: 'offer';
      discriminator: [215, 88, 60, 71, 170, 162, 73, 229];
    },
    {
      name: 'streamer';
      discriminator: [20, 164, 224, 41, 247, 218, 145, 131];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'buyerNotRegistered';
      msg: 'Buyer is not registered.';
    },
    {
      code: 6001;
      name: 'streamerNotRegistered';
      msg: 'Streamer is not registered.';
    },
    {
      code: 6002;
      name: 'balanceOverflow';
      msg: 'Balance overflow occurred.';
    },
    {
      code: 6003;
      name: 'buyerAlreadyExists';
      msg: 'Buyer already exists.';
    },
    {
      code: 6004;
      name: 'offerAlreadyExists';
      msg: 'Offer already exists.';
    },
    {
      code: 6005;
      name: 'offerIsNotActive';
      msg: 'Offer is not active.';
    },
    {
      code: 6006;
      name: 'dealIsAccepted';
      msg: 'Deal is accepted.';
    },
    {
      code: 6007;
      name: 'dealIsNotAccepted';
      msg: 'Deal is not accepted.';
    },
    {
      code: 6008;
      name: 'dealIsCompleted';
      msg: 'Deal is completed.';
    },
    {
      code: 6009;
      name: 'requestForbidden';
      msg: 'Request forbidden.';
    },
    {
      code: 6010;
      name: 'fundsNotEnough';
      msg: 'Not enough funds.';
    },
    {
      code: 6011;
      name: 'overflow';
      msg: 'Overflow occurred.';
    },
    {
      code: 6012;
      name: 'unauthorized';
      msg: 'Unauthorized action.';
    },
    {
      code: 6013;
      name: 'invalidTokenAccount';
      msg: 'Invalid token account.';
    },
    {
      code: 6014;
      name: 'invalidTokenMint';
      msg: 'Invalid token mint.';
    },
  ];
  types: [
    {
      name: 'buyer';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'pubkey';
          },
          {
            name: 'balance';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'deal';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'id';
            type: 'u64';
          },
          {
            name: 'offer';
            type: 'pubkey';
          },
          {
            name: 'streamer';
            type: 'pubkey';
          },
          {
            name: 'isAccepted';
            type: 'bool';
          },
          {
            name: 'isCompleted';
            type: 'bool';
          },
          {
            name: 'encryptedData';
            type: 'string';
          },
        ];
      };
    },
    {
      name: 'offer';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'id';
            type: 'u64';
          },
          {
            name: 'buyer';
            type: 'pubkey';
          },
          {
            name: 'isActive';
            type: 'bool';
          },
          {
            name: 'location';
            type: 'string';
          },
          {
            name: 'price';
            type: 'u64';
          },
        ];
      };
    },
    {
      name: 'streamer';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'owner';
            type: 'pubkey';
          },
          {
            name: 'balance';
            type: 'u64';
          },
        ];
      };
    },
  ];
};
