import { v4 as uuidv4 } from 'uuid';
import { hash } from './hash';
import { BigNumber, ethers } from 'ethers';
import { Provider } from '@ethersproject/providers';

const verfiyKey = {
  protocol: 'groth16',
  curve: 'bn128',
  nPublic: 3,
  vk_alpha_1: [
    '8310245654790868655492623889184517262139233747167217424419226208394128227244',
    '2672380548633180053903280844237086847587000789114398895553291362114631281620',
    '1',
  ],
  vk_beta_2: [
    [
      '129202852061757826764955289114775609481417258630486556184375684891907789873',
      '16673695092240784392811265706637163910912673068376661378305562527091478041573',
    ],
    [
      '696759536163914600362791365878891864019772806174883255086953013296920800452',
      '6482845869619261084364422656131099391370352937177309706695333357760796760223',
    ],
    ['1', '0'],
  ],
  vk_gamma_2: [
    [
      '10857046999023057135944570762232829481370756359578518086990519993285655852781',
      '11559732032986387107991004021392285783925812861821192530917403151452391805634',
    ],
    [
      '8495653923123431417604973247489272438418190587263600148770280649306958101930',
      '4082367875863433681332203403145435568316851327593401208105741076214120093531',
    ],
    ['1', '0'],
  ],
  vk_delta_2: [
    [
      '17457229134073776759399861083450561043372404836484846499893477491690726145251',
      '9860993323530136969997337733339897252251292900558190397988039325284115910771',
    ],
    [
      '21468196727838893234311941920162434670967295691196758105996902826351535378621',
      '2553176836570938219379490342380749916083662357459099788952810043982857476207',
    ],
    ['1', '0'],
  ],
  vk_alphabeta_12: [
    [
      [
        '3429502213410573100093676228104390909025037776743560978209626816251277421497',
        '6677889651465274123574814575102836559847392536756489748679736130127294730900',
      ],
      [
        '11738520015677159022993267860765143652961172851253280349260457041804910938035',
        '20229389200130552397965702738382219058350488753650592339084776439047229757062',
      ],
      [
        '9381143045586821524069063695590898686904701307793261062442248490852162683255',
        '17435875622163372151471155360865069236899663302592583953514462438457946171091',
      ],
    ],
    [
      [
        '11187445904786754855811608873455941697160196738441459429468623105851944944352',
        '19865570133381630726415013197443185922479925153456421889714624318078263893168',
      ],
      [
        '12726720521528559630489992007521243039070158925839613681888638327696759837030',
        '12153485127655152251371765147991550051844634290670811584595898575393175443830',
      ],
      [
        '9358004281859153471258802938420008797963196289468866901653095581073314656481',
        '21557182417513666793831055132491016575052018168185314584575891341999360591748',
      ],
    ],
  ],
  IC: [
    [
      '11498191456876424218126365095694053264607149171935391661695468083199190151845',
      '20428918108078597793041313388416220632554805179724939080649447840664440901273',
      '1',
    ],
    [
      '2285089060588308708481176062925223481043715469007459888388009986031484454019',
      '4692211651304051233541389899344631891449335113425996376780031595480077001133',
      '1',
    ],
    [
      '2271220916478635418365746118123691588509977261620285052433734653428276357617',
      '609436160853629898212084175611926233163558151022265944150742675417290406656',
      '1',
    ],
    [
      '11157491131784333991785262324746038300294324013883667830325879355890698192657',
      '12874646076463994210302675048004488150453602525453471692089914172138300307979',
      '1',
    ],
  ],
};

export function generateSecretKey() {
  return uuidv4();
}

export function getUserId(email: string, secretKey: string) {
  return hash(email + secretKey);
}

export async function getPwdHash(
  provider: Provider,
  pwd: string,
  key: string,
  nonce: string,
  datahash: string
) {
  let expiration = parseInt(String(Date.now() / 1000 + 600));
  let chainId = (await provider.getNetwork()).chainId;
  let fullhash = ethers.utils.solidityKeccak256(
    ['uint256', 'uint256', 'uint256', 'uint256'],
    [expiration, chainId, nonce, datahash]
  );
  fullhash = s(b(fullhash).div(8)); //must be 254b, not 256b
  let input = [stringToHex(pwd), s(b(key)), fullhash];
  //@ts-ignore
  let data = await window.snarkjs.groth16.fullProve(
    { in: input },
    '/zk/circuit.wasm',
    '/zk/circuit_final.zkey'
  );
  return data.publicSignals[0];
}

export function getDataHash(vaultKey: string, vaultValue: string) {
  return s(b(ethers.utils.solidityKeccak256(['uint256', 'string'], [vaultKey, vaultValue])));
}

export async function getProof(
  provider: Provider,
  pwd: string,
  key: string,
  nonce: string,
  datahash: string
) {
  let expiration = parseInt(String(Date.now() / 1000 + 600));
  let chainId = (await provider.getNetwork()).chainId;
  let fullhash = ethers.utils.solidityKeccak256(
    ['uint256', 'uint256', 'uint256', 'uint256'],
    [expiration, chainId, nonce, datahash]
  );
  fullhash = s(b(fullhash).div(8)); //must be 254b, not 256b

  let input = [stringToHex(pwd), s(b(key)), fullhash];
  //@ts-ignore
  let data = await window.snarkjs.groth16.fullProve(
    { in: input },
    '/zk/circuit.wasm',
    '/zk/circuit_final.zkey'
  );

  // console.log(JSON.stringify(data))

  const vKey = verfiyKey;
  //@ts-ignore
  const res = await window.snarkjs.groth16.verify(vKey, data.publicSignals, data.proof);

  if (res === true) {
    console.log('Verification OK');

    let pwdhash = data.publicSignals[0];
    let fullhash = data.publicSignals[1];
    let allhash = data.publicSignals[2];

    let proof = [
      BigNumber.from(data.proof.pi_a[0]).toHexString(),
      BigNumber.from(data.proof.pi_a[1]).toHexString(),
      BigNumber.from(data.proof.pi_b[0][1]).toHexString(),
      BigNumber.from(data.proof.pi_b[0][0]).toHexString(),
      BigNumber.from(data.proof.pi_b[1][1]).toHexString(),
      BigNumber.from(data.proof.pi_b[1][0]).toHexString(),
      BigNumber.from(data.proof.pi_c[0]).toHexString(),
      BigNumber.from(data.proof.pi_c[1]).toHexString(),
    ];
    return { proof, pwdhash, key, expiration, chainId, nonce, datahash, fullhash, allhash };
  } else {
    throw new Error('Verification failed');
  }
}

export function stringToHex(string: string): string {
  let hexStr = '';
  for (let i = 0; i < string.length; i++) {
    let compact = string.charCodeAt(i).toString(16);
    hexStr += compact;
  }
  return '0x' + hexStr;
}

function b(num: string): BigNumber {
  return BigNumber.from(num);
}

function s(bn: BigNumber) {
  return bn.toString();
}
