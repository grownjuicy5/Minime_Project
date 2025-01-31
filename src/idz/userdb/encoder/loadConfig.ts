import {
  LoadConfigResponse1,
  LoadConfigResponse2,
  LoadConfigResponse3,
} from "../response/loadConfig";

const car_id_list = [
  0,
  9,
  1,
  2,
  7,
  3,
  5,
  4,
  10,
  6,
  8,
  256,
  257,
  264,
  263,
  258,
  259,
  260,
  261,
  262,
  512,
  513,
  514,
  515,
  516,
  768,
  769,
  773,
  770,
  771,
  772,
  1024,
  1026,
  1025,
  1027,
  1028,
  1280,
  1281,
  1285,
  1286,
  1283,
  1282,
  1284,
  1536,
  1792,
  2051,
  2049,
  2053,
  2048,
  2050,
  2052,
  2054,
  2055,
  2056,
  2057,
];

export function loadConfig1(res: LoadConfigResponse1) {
  const buf = Buffer.alloc(0x01a0);

  buf.writeInt16LE(0x0005, 0x0000);
  buf.writeInt8(res.status, 0x0002);
  buf.writeUInt16LE(res.serverVersion, 0x0016);
  buf.writeInt8(0x7, 0x0007); // Game Revision

  return buf;
}

export function loadConfig2(res: LoadConfigResponse2) {
  const buf = Buffer.alloc(0x0230);

  buf.writeInt16LE(0x00ac, 0x0000);
  buf.writeInt8(res.status, 0x0002);

  return buf;
}

export function loadConfig3(res: LoadConfigResponse3) {
  const buf = Buffer.alloc(0x05e0);

  buf.writeInt16LE(0x0005, 0x0000);
  buf.writeInt8(res.status, 0x0002);
  buf.writeUInt16LE(210, 0x0016);
  //buf.writeInt8(0x2, 0x0007); // Game Revision
  buf.writeInt8(0x63, 0x0007); // Game Revision
  buf.writeInt8(0x41, 0x0059); // revision letter
  buf.writeInt8(0x1, 0x0014); // playstamps enable
  buf.writeInt8(0x1, 0x0015); // playstamps enable 2

  // playstamps amount ... i think, idk honestly
  // it does some real weird funky looping and bitshifting
  for (let i = 0; i < 7; i++) {
    buf.writeUInt16LE(0x01, 0x0018 + i * 2);
  }

  buf.writeUInt16LE(64, 0x01f0); // ex parts pricing loop amount

  // 2.11 only has 4 ex parts, and as we currently have no way to
  // legitimately unlock ex tickets, let's make em free.

  // ex parts server side unlock
  for (let i = 0; i < 64; i++) {
    if (i < car_id_list.length) {
      buf.writeUInt16LE(car_id_list[i], 0x0272 + i * 2); // car id
    } else {
      buf.writeUInt16LE(i, 0x0272 + i * 2);
    }

    buf.writeBigUInt64LE(15n, 0x02f8 + i * 8); // per car part bitmask
    buf.writeInt8(i, 0x01f2 + i * 2); // part pricing id
    buf.writeInt8(0, 0x01f3 + i * 2); // part price
  }

  return buf;
}

export function loadConfig4(res: LoadConfigResponse2) {
  const buf = Buffer.alloc(0x0240);

  buf.writeInt16LE(0x00a1, 0x0000);
  buf.writeInt8(res.status, 0x0002);

  return buf;
}

export function loadConfig5(res: LoadConfigResponse3) {
  const buf = Buffer.alloc(0x05e0);

  buf.writeInt16LE(0x0005, 0x0000);
  buf.writeInt8(res.status, 0x0002);
  buf.writeUInt16LE(230, 0x0016);

  buf.writeInt8(0x6, 0x0007); // Game Revision
  buf.writeInt8(0x1, 0x0014); // playstamps enable
  buf.writeInt8(0x1, 0x0015); // playstamps ... something
  buf.writeInt8(0x42, 0x0059); // revision letter

  // playstamps amount ... i think, idk honestly
  // it does some real weird funky looping and bitshifting
  for (let i = 0; i < 7; i++) {
    buf.writeUInt16LE(0x01, 0x0018 + i * 2);
  }

  buf.writeInt8(0x63, 0x0042); // max ex parts tickets
  buf.writeUInt16LE(64, 0x01f0); // ex parts pricing loop amount

  // hardcoded values to match real network values
  // in this case, the DX version of the toho decals are supposed to cost 3 tickets
  let ex_part_pricing = [1, 1, 1, 1, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3, 1, 3];
  ex_part_pricing.length = 64;
  ex_part_pricing.fill(1, 16);

  // ex parts server side unlock
  for (let i = 0; i < 64; i++) {
    if (i < car_id_list.length) {
      buf.writeUInt16LE(car_id_list[i], 0x0272 + i * 2); // car id
    } else {
      buf.writeUInt16LE(i, 0x0272 + i * 2);
    }
    buf.writeBigUInt64LE(0xffffffffffffffffn, 0x02f8 + i * 8); // per car part bitmask
    //buf.writeBigUInt64LE(15n, 0x02f8 + i * 8);
    buf.writeInt8(i, 0x01f2 + i * 2); // part pricing id
    buf.writeInt8(ex_part_pricing[i], 0x01f3 + i * 2); // part price
  }

  return buf;
}
