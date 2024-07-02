import { HexString } from '@gear-js/api';

interface ContractData {
  programId: `0x${string}`,
  programMetadata: string
}

export const ACCOUNT_ID_LOCAL_STORAGE_KEY = 'account';

export const ADDRESS = {
  NODE: import.meta.env.VITE_NODE_ADDRESS,
  BACK: import.meta.env.VITE_BACKEND_ADDRESS,
  GAME: import.meta.env.VITE_CONTRACT_ADDRESS as HexString,
};

export const ROUTES = {
  HOME: '/',
  GAME: '/game',
  NOTFOUND: '*',
};


export const mnemonic ="light flip alien east pigeon furnace neglect lab believe perfect only toss";

export const account_name = "buenviaje"

export const MAIN_CONTRACT: ContractData = {
  programId: '0x45d38a75cb921b943a541f22dc5be002245f21c5579f820bfe2453748b7d5154',
  programMetadata: '00020000000100000000010a0000000000000000010d000000c90c3c0008307661726163686573735f696f3843686573734d657373616765496e00010c4052657175657374537461727447616d6504000401405265717565737447616d6553746172740000003053746174757347616d654964040008010c7536340001001c456e6447616d6504001c011c47616d65456e64000200000408307661726163686573735f696f405265717565737447616d65537461727400000c011c67616d655f696408010c753634000128706c617965725f6265740c01107531323800011c706c617965723110011c4163746f72496400000800000506000c00000507001010106773746418636f6d6d6f6e287072696d6974697665731c4163746f724964000004001401205b75383b2033325d0000140000032000000018001800000503001c08307661726163686573735f696f1c47616d65456e6400000c011c67616d655f696408010c75363400012c726573756c745f67616d65200124526573756c74456e64000144706f736974696f6e5f656e645f67616d65240118537472696e6700002008307661726163686573735f696f24526573756c74456e6400010c0c57696e000000104c6f73650001001044726177000200002400000502002808307661726163686573735f696f3c43686573734d6573736167654f757400010838526573706f6e7365537472696e670400240118537472696e670000004c526573706f6e7365426f61726453746174757304002c012c47616d6553746172746564000100002c08307661726163686573735f696f2c47616d6553746172746564000014011c67616d655f696408010c75363400012067616d655f6265740c01107531323800013067616d655f706c617965723110011c4163746f72496400013067616d655f706c617965723210011c4163746f72496400012c67616d655f73746174757330012853746174757347616d6500003008307661726163686573735f696f2853746174757347616d6500010c1c537461727465640000001c57616974696e6700010014456e646564000200003408307661726163686573735f696f2843686573735374617465000004011467616d65733801405665633c47616d65537461727465643e0000380000022c00'
};