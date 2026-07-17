require('dotenv').config();
const mongoose = require('mongoose');
const Note = require('../models/Note');

const SAMPLE_NOTES = [
  {
    title: 'Cellular Respiration Overview',
    subject: 'Biology',
    content:
      'Glycolysis splits glucose into pyruvate in the cytoplasm. The Krebs cycle then processes pyruvate in the mitochondrial matrix, and the electron transport chain uses the resulting NADH and FADH2 to produce most of the cell\'s ATP.',
  },
  {
    title: 'Big-O Notation Cheat Sheet',
    subject: 'Computer Science',
    content:
      'O(1) constant time, O(log n) binary search, O(n) linear scan, O(n log n) efficient sorts like mergesort, O(n^2) nested loops. Always check worst-case behavior, not just the average case.',
  },
  {
    title: 'The Cold War in Brief',
    subject: 'History',
    content:
      'A decades-long geopolitical standoff between the US and the Soviet Union following WWII, marked by proxy wars, an arms race, and the space race, without direct large-scale military conflict between the two superpowers.',
  },
  {
    title: 'The Pythagorean Theorem',
    subject: 'Mathematics',
    content:
      'For a right triangle with legs a and b and hypotenuse c: a^2 + b^2 = c^2. Used to find distances, verify right angles, and derive the distance formula in coordinate geometry.',
  },
  {
    title: 'Periodic Table Trends',
    subject: 'Chemistry',
    content:
      'Atomic radius decreases across a period and increases down a group. Electronegativity and ionization energy increase across a period and decrease down a group, driven by increasing nuclear charge and electron shielding.',
  },
];

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set. Please configure your .env file.');
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const created = await Note.insertMany(SAMPLE_NOTES);
  console.log(`Inserted ${created.length} sample notes:`);
  created.forEach((note) => console.log(`  - [${note.subject}] ${note.title} (${note._id})`));

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Failed to seed notes:', err.message);
  process.exit(1);
});
