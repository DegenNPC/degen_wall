/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/degen_wall.json`.
 */
export type DegenWall = {
  "address": "DEGENvq96VhCR8jawM9ZkBuQtGtFNTsER4ohGPkFBLUt",
  "metadata": {
    "name": "degenWall",
    "version": "1.0.0",
    "spec": "0.1.0",
    "description": "Created by DegenWall"
  },
  "instructions": [
    {
      "name": "createMetadataAccount",
      "discriminator": [
        75,
        73,
        45,
        178,
        212,
        194,
        127,
        113
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "id"
        },
        {
          "name": "metadataAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  103,
                  101,
                  110,
                  95,
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  1
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "token"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "createMetadataAccountParams"
            }
          }
        }
      ]
    },
    {
      "name": "createPixelsAccount",
      "discriminator": [
        49,
        199,
        137,
        106,
        126,
        49,
        213,
        56
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "id"
        },
        {
          "name": "metadata"
        },
        {
          "name": "metadataAccount",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  103,
                  101,
                  110,
                  95,
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  1
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "metadata"
              }
            ]
          }
        },
        {
          "name": "pixelsAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  103,
                  101,
                  110,
                  95,
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  1
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "metadata"
              },
              {
                "kind": "account",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "solTreasuryAccount",
          "optional": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  103,
                  101,
                  110,
                  95,
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  1
                ]
              }
            ]
          }
        },
        {
          "name": "treasury",
          "writable": true,
          "optional": true
        },
        {
          "name": "mint"
        },
        {
          "name": "poolAccount",
          "optional": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  103,
                  101,
                  110,
                  95,
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  1
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "treasuryMint",
          "writable": true,
          "optional": true
        },
        {
          "name": "payerTokenAccount",
          "writable": true,
          "optional": true
        },
        {
          "name": "vaultWsol",
          "optional": true
        },
        {
          "name": "vaultMint",
          "optional": true
        },
        {
          "name": "tokenProgram",
          "optional": true,
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "createPixelsAccountParams"
            }
          }
        }
      ]
    },
    {
      "name": "createPoolAccount",
      "discriminator": [
        141,
        39,
        149,
        90,
        253,
        66,
        124,
        136
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint"
        },
        {
          "name": "vaultWsol"
        },
        {
          "name": "vaultMint"
        },
        {
          "name": "treasuryMint"
        },
        {
          "name": "poolAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  103,
                  101,
                  110,
                  95,
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  1
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "createPoolAccountParams"
            }
          }
        }
      ]
    },
    {
      "name": "createSolTreasuryAccount",
      "discriminator": [
        6,
        215,
        142,
        145,
        33,
        201,
        93,
        76
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "solTreasuryAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  103,
                  101,
                  110,
                  95,
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  1
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "createSolTreasuryAccountParams"
            }
          }
        }
      ]
    },
    {
      "name": "deletePoolAccount",
      "discriminator": [
        53,
        98,
        26,
        225,
        77,
        47,
        77,
        136
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint"
        },
        {
          "name": "poolAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  103,
                  101,
                  110,
                  95,
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  1
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "updatePoolAccount",
      "discriminator": [
        117,
        97,
        171,
        180,
        210,
        68,
        106,
        142
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint"
        },
        {
          "name": "poolAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  103,
                  101,
                  110,
                  95,
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  1
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "updatePoolAccountParams"
            }
          }
        }
      ]
    },
    {
      "name": "updateSolTreasuryAccount",
      "discriminator": [
        24,
        29,
        185,
        233,
        96,
        169,
        97,
        79
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "solTreasuryAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  103,
                  101,
                  110,
                  95,
                  119,
                  97,
                  108,
                  108
                ]
              },
              {
                "kind": "const",
                "value": [
                  1
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "updateSolTreasuryAccountParams"
            }
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "metadataAccount",
      "discriminator": [
        32,
        224,
        226,
        224,
        77,
        64,
        109,
        234
      ]
    },
    {
      "name": "pixelsAccount",
      "discriminator": [
        5,
        215,
        120,
        188,
        29,
        204,
        240,
        21
      ]
    },
    {
      "name": "poolAccount",
      "discriminator": [
        116,
        210,
        187,
        119,
        196,
        196,
        52,
        137
      ]
    },
    {
      "name": "solTreasuryAccount",
      "discriminator": [
        172,
        119,
        222,
        247,
        211,
        84,
        123,
        69
      ]
    }
  ],
  "events": [
    {
      "name": "metadataAccountCreated",
      "discriminator": [
        169,
        211,
        83,
        26,
        243,
        161,
        192,
        64
      ]
    },
    {
      "name": "pixelsAccountCreated",
      "discriminator": [
        181,
        196,
        126,
        251,
        144,
        94,
        3,
        108
      ]
    },
    {
      "name": "poolAccountCreated",
      "discriminator": [
        199,
        245,
        207,
        105,
        195,
        237,
        14,
        152
      ]
    },
    {
      "name": "poolAccountDeleted",
      "discriminator": [
        170,
        11,
        12,
        175,
        87,
        100,
        239,
        232
      ]
    },
    {
      "name": "poolAccountUpdated",
      "discriminator": [
        247,
        144,
        91,
        45,
        42,
        160,
        91,
        159
      ]
    },
    {
      "name": "solTreasuryAccountCreated",
      "discriminator": [
        244,
        183,
        251,
        141,
        177,
        85,
        167,
        247
      ]
    },
    {
      "name": "solTreasuryAccountUpdated",
      "discriminator": [
        126,
        165,
        36,
        116,
        64,
        103,
        126,
        186
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "stopBeingPoor",
      "msg": "Stop being poor!"
    },
    {
      "code": 6001,
      "name": "whyAreYouDoingThisToMeBruv",
      "msg": "Why are you doing this to me bruv?"
    },
    {
      "code": 6002,
      "name": "youAreNotMyBoss",
      "msg": "You are not my boss!"
    },
    {
      "code": 6003,
      "name": "notEnoughMoneyForGas",
      "msg": "Not enough money for gas!"
    },
    {
      "code": 6004,
      "name": "invalidWsolAccount",
      "msg": "Invalid WSOL Account"
    },
    {
      "code": 6005,
      "name": "invalidMintAccount",
      "msg": "Invalid Mint account!"
    },
    {
      "code": 6006,
      "name": "invalidTreasuryAccount",
      "msg": "Invalid Treasury Account!"
    },
    {
      "code": 6007,
      "name": "invalidTreasuryOwner",
      "msg": "Invalid Treasury Owner!"
    },
    {
      "code": 6008,
      "name": "invalidPayerTokenAccount",
      "msg": "Invalid Payer Token Account!"
    },
    {
      "code": 6009,
      "name": "thisIsPointlessDude",
      "msg": "This is pointless dude!"
    },
    {
      "code": 6010,
      "name": "emptyData",
      "msg": "Empty data!"
    },
    {
      "code": 6011,
      "name": "dataTooBig",
      "msg": "Data too big!"
    },
    {
      "code": 6012,
      "name": "invalidData",
      "msg": "Invalid data!"
    },
    {
      "code": 6013,
      "name": "urlTooBig",
      "msg": "URL too big!"
    },
    {
      "code": 6014,
      "name": "twitterStringTooBig",
      "msg": "Twitter string too big!"
    },
    {
      "code": 6015,
      "name": "invalidTwitter",
      "msg": "Invalid Twitter!"
    },
    {
      "code": 6016,
      "name": "nameStringTooBig",
      "msg": "Name string too big!"
    },
    {
      "code": 6017,
      "name": "tickerStringTooBig",
      "msg": "Ticker string too big!"
    },
    {
      "code": 6018,
      "name": "noHttpPrefix",
      "msg": "No Http Prefix!"
    },
    {
      "code": 6019,
      "name": "overallStringTooBig",
      "msg": "Overall string too big!"
    },
    {
      "code": 6020,
      "name": "duplicateCoordinate",
      "msg": "Duplicate coordinate!"
    },
    {
      "code": 6021,
      "name": "insufficientVaultReserves",
      "msg": "Insufficient vault reserves!"
    },
    {
      "code": 6022,
      "name": "missingSolTreasuryAccount",
      "msg": "Missing Sol Treasury Account!"
    },
    {
      "code": 6023,
      "name": "missingTreasuryAccount",
      "msg": "Missing Treasury Account!"
    },
    {
      "code": 6024,
      "name": "missingPoolAccount",
      "msg": "Missing Pool Account!"
    },
    {
      "code": 6025,
      "name": "missingTreasuryMintAccount",
      "msg": "Missing Treasury Mint Account!"
    },
    {
      "code": 6026,
      "name": "missingPayerTokenAccount",
      "msg": "Missing Payer Token Account!"
    },
    {
      "code": 6027,
      "name": "missingVaultWsolAccount",
      "msg": "Missing Vault Wsol Account!"
    },
    {
      "code": 6028,
      "name": "missingVaultMintAccount",
      "msg": "Missing Vault Mint Account!"
    },
    {
      "code": 6029,
      "name": "mathOverflow",
      "msg": "Math Overflow!"
    },
    {
      "code": 6030,
      "name": "mathOverflow2",
      "msg": "Math Overflow 2!"
    },
    {
      "code": 6031,
      "name": "mathOverflow3",
      "msg": "Math Overflow 3!"
    },
    {
      "code": 6032,
      "name": "mathOverflow4",
      "msg": "Math Overflow 4!"
    },
    {
      "code": 6033,
      "name": "unsortedData",
      "msg": "Unsorted data"
    },
    {
      "code": 6034,
      "name": "nonceTooHigh",
      "msg": "Nonce too high"
    },
    {
      "code": 6035,
      "name": "lamportsAmountMustBeGreaterThan0",
      "msg": "Lamports amount must be greater than 0"
    }
  ],
  "types": [
    {
      "name": "createMetadataAccountParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "ticker",
            "type": "string"
          },
          {
            "name": "website",
            "type": "string"
          },
          {
            "name": "twitter",
            "type": "string"
          },
          {
            "name": "community",
            "type": "string"
          },
          {
            "name": "image",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "createPixelsAccountParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tweet",
            "type": "bool"
          },
          {
            "name": "nonce",
            "type": "u16"
          },
          {
            "name": "data",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "createPoolAccountParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lamportsPerPixel",
            "type": "u64"
          },
          {
            "name": "burn",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "createSolTreasuryAccountParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lamportsPerPixel",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "metadataAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "id",
            "type": "pubkey"
          },
          {
            "name": "payer",
            "type": "pubkey"
          },
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "socials",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "metadataAccountCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "id",
            "type": "pubkey"
          },
          {
            "name": "payer",
            "type": "pubkey"
          },
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "ticker",
            "type": "string"
          },
          {
            "name": "website",
            "type": "string"
          },
          {
            "name": "twitter",
            "type": "string"
          },
          {
            "name": "community",
            "type": "string"
          },
          {
            "name": "image",
            "type": "string"
          },
          {
            "name": "description",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "pixelsAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "nonce",
            "type": "u16"
          },
          {
            "name": "lamportsPerPixel",
            "type": "u64"
          },
          {
            "name": "burn",
            "type": "bool"
          },
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "id",
            "type": "pubkey"
          },
          {
            "name": "metadata",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "data",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "pixelsAccountCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "nonce",
            "type": "u16"
          },
          {
            "name": "lamportsPerPixel",
            "type": "u64"
          },
          {
            "name": "burn",
            "type": "bool"
          },
          {
            "name": "tweet",
            "type": "bool"
          },
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "id",
            "type": "pubkey"
          },
          {
            "name": "metadata",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "data",
            "type": "bytes"
          }
        ]
      }
    },
    {
      "name": "poolAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "vaultWsol",
            "type": "pubkey"
          },
          {
            "name": "vaultMint",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "lamportsPerPixel",
            "type": "u64"
          },
          {
            "name": "burn",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "poolAccountCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "vaultWsol",
            "type": "pubkey"
          },
          {
            "name": "vaultMint",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "lamportsPerPixel",
            "type": "u64"
          },
          {
            "name": "burn",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "poolAccountDeleted",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "poolAccountUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lamportsPerPixel",
            "type": "u64"
          },
          {
            "name": "burn",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "solTreasuryAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "lamportsPerPixel",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "solTreasuryAccountCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "lamportsPerPixel",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "solTreasuryAccountUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lamportsPerPixel",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "updatePoolAccountParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lamportsPerPixel",
            "type": "u64"
          },
          {
            "name": "burn",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "updateSolTreasuryAccountParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lamportsPerPixel",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "authorityPubkey",
      "type": "pubkey",
      "value": "F51Rn9VgBSTTuKDHtUBWs7G81kz7hNpLgo8K9n1ANPNR"
    },
    {
      "name": "dataMaxLen",
      "type": "u16",
      "value": "620"
    },
    {
      "name": "maxPxNr",
      "type": "u8",
      "value": "124"
    },
    {
      "name": "nameMaxLen",
      "type": "u8",
      "value": "30"
    },
    {
      "name": "pxHeight",
      "type": "u8",
      "value": "128"
    },
    {
      "name": "pxSize",
      "type": "u8",
      "value": "5"
    },
    {
      "name": "pxWidth",
      "type": "u8",
      "value": "255"
    },
    {
      "name": "seedPrefix",
      "type": "bytes",
      "value": "[100, 101, 103, 101, 110, 95, 119, 97, 108, 108]"
    },
    {
      "name": "socialsMaxLen",
      "type": "u16",
      "value": "872"
    },
    {
      "name": "stringDelimiter",
      "type": "string",
      "value": "\"|\""
    },
    {
      "name": "tickerMaxLen",
      "type": "u8",
      "value": "10"
    },
    {
      "name": "treasuryPubkey",
      "type": "pubkey",
      "value": "9QStWMdgxtqt9HMyVxzFSv7yWV1AFCdsMcMiKaqbqFEz"
    },
    {
      "name": "twitterMaxLen",
      "type": "u8",
      "value": "15"
    },
    {
      "name": "version",
      "type": "u8",
      "value": "1"
    },
    {
      "name": "wsolPubkey",
      "type": "pubkey",
      "value": "So11111111111111111111111111111111111111112"
    }
  ]
};
