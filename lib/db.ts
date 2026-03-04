import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'phy-blog.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      cover_image TEXT,
      author TEXT DEFAULT 'XMUM Physics Department',
      category TEXT,
      tags TEXT DEFAULT '[]',
      published INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      published_at TEXT
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  seedAdminIfEmpty(db);
  seedPostsIfEmpty(db);
}

function seedAdminIfEmpty(db: Database.Database) {
  // INSERT OR IGNORE handles concurrent workers racing to seed on first build
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'physics2024';
  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT OR IGNORE INTO admins (username, password) VALUES (?, ?)').run(username, hash);
  if (result.changes > 0) {
    console.log(`[DB] Seeded admin user: ${username}`);
  }
}

function seedPostsIfEmpty(db: Database.Database) {
  const postCount = (db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number }).count;
  if (postCount === 0) {
    const posts = [
      {
        title: 'Introduction to Quantum Mechanics at XMUM',
        slug: 'introduction-to-quantum-mechanics-at-xmum',
        excerpt: 'An overview of the quantum mechanics curriculum and research opportunities available to physics students at Xiamen University Malaysia.',
        content: `# Introduction to Quantum Mechanics at XMUM

Welcome to the Physics Department at Xiamen University Malaysia. This post introduces our approach to teaching quantum mechanics and the exciting research opportunities available to our students.

## Why Quantum Mechanics Matters

Quantum mechanics is the foundational theory of modern physics, describing the behavior of matter and energy at the smallest scales. From semiconductors to quantum computing, its applications are transforming our world.

## Our Curriculum

Our quantum mechanics course covers:

- **Wave-particle duality** — understanding the dual nature of light and matter
- **The Schrödinger equation** — the central equation governing quantum systems
- **Quantum states and superposition** — exploring the strange world of quantum uncertainty
- **Measurement and collapse** — what happens when we observe a quantum system

## Particle in a Box

One of the first quantum systems students encounter is the **particle in a box** — a particle confined between two walls with infinite potential. The allowed wave functions are standing waves:

$$\\psi_n(x) = \\sqrt{\\frac{2}{L}}\\sin\\!\\left(\\frac{n\\pi x}{L}\\right)$$

The corresponding probability density |ψₙ(x)|² describes where the particle is most likely to be found. The Python code below computes and plots these distributions:

\`\`\`python
import numpy as np
import matplotlib.pyplot as plt

# Particle in a box — probability density
def prob_density(n, x, L=1.0):
    return (2 / L) * np.sin(n * np.pi * x / L) ** 2

x = np.linspace(0, 1, 1000)
for n in range(1, 4):
    plt.plot(x, prob_density(n, x), label=f'n={n}')

plt.xlabel('Position (x/L)')
plt.ylabel('Probability density |ψ|²')
plt.legend()
plt.title('Particle in a Box')
plt.show()
\`\`\`

The graph below shows the first three eigenstates. Notice how higher quantum numbers introduce more nodes (zeros) in the probability density:

![Particle in a Box — Probability Density](/particle-in-box.svg)

## Research Opportunities

Students interested in quantum physics research can join our labs working on:

1. Quantum optics experiments
2. Condensed matter physics simulations
3. Quantum information theory

We encourage all students to explore the fascinating world of quantum mechanics with us!`,
        cover_image: 'https://picsum.photos/seed/xmum-quantum/1200/600',
        author: 'Prof. Zhang Wei',
        category: 'Education',
        tags: JSON.stringify(['quantum mechanics', 'curriculum', 'education']),
        published: 1,
        published_at: new Date().toISOString(),
      },
      {
        title: 'Recent Advances in Condensed Matter Physics Research',
        slug: 'recent-advances-in-condensed-matter-physics-research',
        excerpt: 'Our department recently published groundbreaking results in topological insulators and 2D materials. Here we summarize the key findings.',
        content: `# Recent Advances in Condensed Matter Physics Research

The XMUM Physics Department is proud to announce several significant research achievements in condensed matter physics over the past year.

## Topological Insulators

Our research group has made important progress in understanding the surface states of topological insulators. These materials are insulators in their bulk but conduct electricity on their surfaces due to topology — a branch of mathematics dealing with properties preserved under continuous deformations.

### Key Findings

- Observation of robust surface states in Bi₂Se₃ thin films
- Measurement of the topological invariant (Z₂ index) using ARPES
- Evidence for helical spin texture at the Fermi surface

## 2D Materials

Building on the Nobel Prize-winning discovery of graphene, our team is exploring a new generation of two-dimensional materials:

| Material | Properties | Potential Applications |
|----------|-----------|----------------------|
| Graphene | Zero-gap semiconductor | Electronics, sensors |
| MoS₂ | Direct bandgap (1.8 eV) | Photodetectors, transistors |
| h-BN | Wide bandgap insulator | Substrate, encapsulation |
| WTe₂ | Weyl semimetal | Spintronics |

## Upcoming Seminars

We will present these findings at the following venues:

- **March 2024**: APS March Meeting, Minneapolis
- **June 2024**: International Workshop on Topological Materials, Singapore
- **October 2024**: Asia-Pacific Physics Conference, Kuala Lumpur

Stay tuned for more updates from our research group!`,
        cover_image: 'https://picsum.photos/seed/xmum-condensed/1200/600',
        author: 'Dr. Lim Mei Ling',
        category: 'Research',
        tags: JSON.stringify(['condensed matter', 'topological insulators', '2D materials', 'research']),
        published: 1,
        published_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        title: 'Student Spotlight: Award-Winning Astrophysics Project',
        slug: 'student-spotlight-award-winning-astrophysics-project',
        excerpt: 'Third-year physics student Amirah Binti Hassan wins the Malaysian National Science Competition with her project on exoplanet detection methods.',
        content: `# Student Spotlight: Award-Winning Astrophysics Project

We are thrilled to recognize third-year physics student **Amirah Binti Hassan** for her outstanding achievement at the 2024 Malaysian National Science Competition, where she won the Gold Award in the Physics category.

## The Project: Detecting Exoplanets with Amateur Equipment

Amirah's project, titled *"Precision Photometry for Exoplanet Transit Detection Using a 6-inch Reflector Telescope"*, demonstrated that it is possible to detect planets orbiting distant stars using relatively modest equipment.

### Methodology

The transit method works by detecting the tiny dip in a star's brightness when a planet passes in front of it:

\`\`\`
Stellar flux: ████████████████████████████████
                                ↓ planet transit
Transit:      ████████████░░░░░░░████████████

Relative flux: 1.0, 1.0, ..., 0.98, ..., 1.0
\`\`\`

Amirah successfully detected a transit of **HAT-P-7b**, a hot Jupiter with an orbital period of approximately 2.2 days. Her light curve showed:

- **Transit depth**: ~6% flux reduction (consistent with published values)
- **Duration**: ~4 hours
- **Timing accuracy**: Within 3 minutes of predicted midpoint

### Equipment Used

- 6-inch f/8 Newtonian reflector
- CMOS astronomy camera (cooled)
- Standard Johnson-Cousins V-band filter
- Custom Python photometry pipeline

## A Message from Amirah

> "I never imagined that I could detect a planet 1000 light-years away from our university campus. This project taught me that with careful planning, precise measurement, and good data analysis, amateur astronomers can contribute meaningful science."

## Supervisor's Note

Dr. Rajesh Kumar, Amirah's supervisor, noted: "Her careful attention to systematic errors and her rigorous statistical analysis set her project apart. We look forward to seeing what she will accomplish in her final year."

Congratulations, Amirah! 🌟`,
        cover_image: 'https://picsum.photos/seed/xmum-astro/1200/600',
        author: 'XMUM Physics Department',
        category: 'Student Life',
        tags: JSON.stringify(['student achievement', 'astrophysics', 'exoplanets', 'award']),
        published: 1,
        published_at: new Date(Date.now() - 172800000).toISOString(),
      },
    ];

    const insert = db.prepare(`
      INSERT OR IGNORE INTO posts (title, slug, excerpt, content, cover_image, author, category, tags, published, published_at)
      VALUES (@title, @slug, @excerpt, @content, @cover_image, @author, @category, @tags, @published, @published_at)
    `);

    for (const post of posts) {
      insert.run(post);
    }
    console.log('[DB] Seeded 3 sample posts');
  }
}
