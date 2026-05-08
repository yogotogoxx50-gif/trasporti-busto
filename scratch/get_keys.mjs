import { Z627 } from '../data/z627.js';
import { Z644 } from '../data/z644.js';
import { Z625 } from '../data/z625.js';
import { Z647 } from '../data/z647.js';
import { Z642 } from '../data/z642.js';

const datasets = { Z627, Z644, Z625, Z647, Z642 };
for (const [name, data] of Object.entries(datasets)) {
  for (const [sk, trips] of Object.entries(data)) {
    if (!trips?.length) continue;
    console.log(`${name} ${sk}: ${Object.keys(trips[0].stops).join(', ')}`);
  }
}
