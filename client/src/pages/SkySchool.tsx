import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  BookOpen, Star, Zap, Award, Clock, Users, Search, GraduationCap, Brain,
  Coins, Shield, Code, Rocket, Bug, Cloud, Cpu, CheckCircle, Terminal, Play,
  Video, ArrowLeft, BarChart3, Lock, Trophy, ChevronRight, Flame, Target,
  Sparkles, ArrowRight, Volume2, Code2
} from "lucide-react";

// Real YouTube Videos + Actual Lesson Content
const COURSES = [
  {
    id: "blockchain-101",
    track: "web3",
    category: "Blockchain",
    level: "Beginner",
    icon: "⛓️",
    title: "Blockchain Fundamentals",
    description: "Master distributed ledgers, consensus mechanisms, and cryptography",
    lessons: 12,
    duration: "4h 30m",
    xpReward: 500,
    skyReward: 50,
    students: 28400,
    rating: 4.9,
    color: "oklch(0.72 0.20 200)",
    topics: [
      {
        title: "What is Blockchain?",
        videoId: "SSo_EIwHcMw",
        content: `Blockchain is a distributed ledger technology that maintains a continuously growing list of records called blocks. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data.

Key Concepts:
• Decentralization: No single point of failure
• Immutability: Once recorded, data cannot be altered
• Transparency: All participants can view transactions
• Security: Cryptographic protection of data

Bitcoin, the first blockchain, was created in 2008 by Satoshi Nakamoto. It introduced the concept of a peer-to-peer electronic cash system without requiring a trusted third party.

Learning Objectives:
✓ Understand blockchain architecture
✓ Learn about distributed systems
✓ Grasp the importance of cryptography
✓ Know the difference between public and private blockchains`
      },
      {
        title: "Distributed Ledgers",
        videoId: "qXZwmGkpixE",
        content: `A distributed ledger is a database that is consensually shared, replicated, and synchronized across multiple sites, institutions, or geographies. Unlike traditional centralized databases, distributed ledgers have no single point of control.

Characteristics:
• Replicated: Copies exist on multiple nodes
• Synchronized: All copies are kept in sync
• Shared: Participants have access to the same data
• Consensus-based: Changes require agreement

Advantages:
✓ Increased resilience and fault tolerance
✓ Reduced latency in data updates
✓ Enhanced security through redundancy
✓ Greater transparency and auditability

Use Cases:
• Supply chain tracking
• Cross-border payments
• Smart contracts
• Digital identity management`
      },
      {
        title: "Consensus Mechanisms",
        videoId: "3EUAcxhuoU4",
        content: `Consensus mechanisms are protocols that enable distributed networks to agree on a single version of the truth. They ensure that all nodes in the network maintain the same state.

Proof of Work (PoW):
• Miners compete to solve complex mathematical puzzles
• First to solve gets to add the next block
• Energy-intensive but highly secure
• Used by Bitcoin

Proof of Stake (PoS):
• Validators are chosen based on their stake
• More energy-efficient than PoW
• Used by Ethereum 2.0
• Reduces barriers to entry

Other Mechanisms:
• Delegated Proof of Stake (DPoS)
• Proof of Authority (PoA)
• Proof of History (PoH)
• Proof of Elapsed Time (PoET)

Comparison:
PoW is more decentralized but energy-intensive.
PoS is more efficient but requires significant capital.`
      },
      {
        title: "Hash Functions",
        videoId: "DMtFhACPnTY",
        content: `Hash functions are mathematical algorithms that convert input data of any size into a fixed-size string of bytes. The output is called a hash or digest.

Properties of Cryptographic Hash Functions:
• Deterministic: Same input always produces same output
• Quick: Fast to compute hash value
• Avalanche Effect: Small change in input drastically changes output
• One-way: Infeasible to reverse the hash
• Collision-resistant: Hard to find two inputs with same hash

Common Hash Functions:
• SHA-256: Used in Bitcoin, produces 256-bit hash
• SHA-3: Latest standard, more secure
• BLAKE2: Fast and secure alternative
• Keccak: Used in Ethereum

Applications in Blockchain:
• Creating block identifiers
• Verifying data integrity
• Merkle trees for efficient verification
• Proof of Work in mining`
      },
      {
        title: "Merkle Trees",
        videoId: "V9l-Yd9LFEA",
        content: `Merkle trees are binary trees of hashes where each leaf node contains the hash of data, and each non-leaf node contains the hash of its children.

Structure:
• Leaf nodes: Hash of transactions
• Parent nodes: Hash of concatenated child hashes
• Root: Single hash representing all data

Advantages:
✓ Efficient verification of large datasets
✓ Detect changes in any part of data
✓ Reduce storage requirements
✓ Enable light clients

How It Works:
1. Hash each transaction individually
2. Combine pairs of hashes and hash again
3. Repeat until single root hash remains
4. Root hash represents entire block

Applications:
• Bitcoin: Merkle root in block header
• Ethereum: Modified Merkle Patricia trees
• IPFS: Merkle DAGs
• Git: Merkle trees for version control

Verification:
To verify a specific transaction, only need O(log n) hashes instead of all n transactions.`
      },
      {
        title: "Smart Contracts Intro",
        videoId: "ZE2HxTmxfrI",
        content: `Smart contracts are self-executing contracts with terms written in code. They automatically execute when conditions are met.

Characteristics:
• Immutable: Cannot be changed once deployed
• Transparent: Code is visible to all
• Deterministic: Same input always produces same output
• Autonomous: Execute without intermediaries

How They Work:
1. Code is deployed to blockchain
2. Contract state is stored on-chain
3. Functions are called via transactions
4. Results are recorded on blockchain

Benefits:
✓ Eliminate intermediaries
✓ Reduce costs and delays
✓ Increase transparency
✓ Enable complex automation

Use Cases:
• Decentralized Finance (DeFi)
• Insurance claims
• Supply chain management
• Digital assets and NFTs

Platforms:
• Ethereum: Most popular, uses Solidity
• Cardano: Uses Plutus
• Polkadot: Uses Ink!
• Solana: Uses Rust`
      },
      {
        title: "Public vs Private Chains",
        videoId: "yubzJw0uiE4",
        content: `Blockchain networks can be classified as public or private based on access and participation.

Public Blockchains:
• Open to anyone
• Fully decentralized
• Transparent transactions
• Immutable records
• Examples: Bitcoin, Ethereum
• Slower but more secure
• No single point of control

Private Blockchains:
• Restricted access
• Controlled by organizations
• Faster transactions
• Privacy protection
• Examples: Hyperledger, Corda
• Centralized governance
• Better for enterprise

Comparison:
Public: Decentralization, Security, Transparency
Private: Speed, Privacy, Control

Hybrid Approaches:
• Consortium chains: Multiple organizations
• Permissioned public chains: Open but controlled
• Sidechains: Connected to main chain

Choosing the Right Type:
Consider: Decentralization needs, Privacy requirements, Performance needs, Regulatory compliance`
      },
      {
        title: "Layer 1 vs Layer 2",
        videoId: "uJWmhjxtuK8",
        content: `Blockchain scaling solutions are divided into Layer 1 (on-chain) and Layer 2 (off-chain) solutions.

Layer 1 Solutions (On-Chain):
• Increase base layer capacity
• Larger block sizes
• Faster block times
• Sharding: Divide network into smaller parts
• Examples: Bitcoin Lightning Network, Ethereum 2.0
• Trade-off: Decentralization vs scalability

Layer 2 Solutions (Off-Chain):
• Process transactions off main chain
• Settle periodically on Layer 1
• Maintain security of Layer 1
• Much faster and cheaper
• Examples: Lightning Network, Polygon, Arbitrum
• Rollups: Batch transactions and compress data

Rollup Types:
• Optimistic Rollups: Assume transactions valid, prove fraud
• Zero-Knowledge Rollups: Prove validity with cryptography

Comparison:
Layer 1: Slower but more secure and decentralized
Layer 2: Faster and cheaper but depends on Layer 1

Current Solutions:
• Bitcoin: Lightning Network (Layer 2)
• Ethereum: Polygon, Arbitrum, Optimism (Layer 2)
• Ethereum 2.0: Sharding (Layer 1)`
      },
      {
        title: "Blockchain Use Cases",
        videoId: "aQDpFJRkp-s",
        content: `Beyond cryptocurrency, blockchain has numerous real-world applications.

Supply Chain:
• Track products from manufacture to consumer
• Verify authenticity
• Reduce counterfeiting
• Improve transparency
• Companies: Walmart, Maersk

Healthcare:
• Secure medical records
• Drug traceability
• Clinical trial data
• Insurance claims
• Privacy-preserving

Real Estate:
• Property ownership records
• Smart contracts for transactions
• Reduce fraud
• Faster settlements
• Lower costs

Digital Identity:
• Self-sovereign identity
• Verifiable credentials
• Privacy protection
• Cross-border recognition
• Financial inclusion

Voting:
• Transparent elections
• Prevent fraud
• Accessibility
• Instant results
• Voter privacy

Intellectual Property:
• Copyright protection
• Royalty distribution
• NFTs for digital assets
• Proof of ownership
• Automated licensing`
      },
      {
        title: "Security Fundamentals",
        videoId: "Ks1M5SBoFCI",
        content: `Blockchain security relies on cryptography and distributed consensus.

Cryptographic Security:
• Public-key cryptography
• Digital signatures
• Hash functions
• Merkle trees
• Protects data integrity and authenticity

Consensus Security:
• 51% attack: Control majority of network
• Double-spending prevention
• Transaction finality
• Network resilience

Common Attacks:
• Sybil Attack: Create fake identities
• Eclipse Attack: Isolate nodes
• Selfish Mining: Withhold blocks
• 51% Attack: Control network majority

Protection Measures:
✓ Cryptographic hashing
✓ Digital signatures
✓ Distributed consensus
✓ Economic incentives
✓ Regular audits
✓ Bug bounty programs

Best Practices:
• Use reputable wallets
• Enable 2FA
• Backup private keys
• Verify smart contracts
• Stay updated on security news`
      },
      {
        title: "Wallets & Keys",
        videoId: "d8IBpfs9bf0",
        content: `Cryptocurrency wallets store and manage your private and public keys.

Key Concepts:
• Private Key: Secret key for signing transactions
• Public Key: Derived from private key
• Address: Hash of public key
• Seed Phrase: 12-24 words to recover wallet

Types of Wallets:
• Hot Wallets: Connected to internet (MetaMask, Trust Wallet)
• Cold Wallets: Offline storage (Ledger, Trezor)
• Hardware Wallets: Physical devices
• Paper Wallets: Printed keys
• Multi-sig Wallets: Multiple signatures required

Security Best Practices:
✓ Never share private keys
✓ Use hardware wallets for large amounts
✓ Backup seed phrases securely
✓ Use strong passwords
✓ Enable 2FA
✓ Verify addresses carefully

Common Mistakes:
• Storing keys in plain text
• Using weak passwords
• Sharing seed phrases
• Clicking phishing links
• Using public WiFi for transactions

Recovery:
• Seed phrase allows wallet recovery
• Keep backups in multiple locations
• Use password managers
• Test recovery process regularly`
      },
      {
        title: "Final Assessment",
        videoId: "SSo_EIwHcMw",
        content: `Congratulations on completing Blockchain Fundamentals!

Quiz Topics:
1. What is blockchain and how does it work?
2. Explain consensus mechanisms
3. Describe hash functions and their properties
4. How do Merkle trees work?
5. What are smart contracts?
6. Differences between public and private blockchains
7. Layer 1 vs Layer 2 solutions
8. Real-world blockchain applications
9. Security best practices
10. Wallet management

Key Takeaways:
✓ Blockchain is a distributed ledger technology
✓ Consensus mechanisms ensure network agreement
✓ Cryptography protects data integrity
✓ Smart contracts enable automation
✓ Multiple scaling solutions exist
✓ Security is paramount

Next Steps:
• Explore DeFi protocols
• Learn Solidity programming
• Experiment with testnet
• Join blockchain communities
• Stay updated on developments

Certificate:
You have earned your Blockchain Fundamentals certificate!
Share your achievement: #BlockchainFundamentals #SKY4444`
      }
    ]
  },
  {
    id: "python-dev",
    track: "coding",
    category: "Python",
    level: "Beginner",
    icon: "🐍",
    title: "Python for Builders",
    description: "From zero to production - scripts, APIs, automation, data pipelines",
    lessons: 6,
    duration: "3h 00m",
    xpReward: 600,
    skyReward: 60,
    students: 45200,
    rating: 4.9,
    color: "oklch(0.72 0.20 250)",
    topics: [
      {
        title: "Python Basics",
        videoId: "kqtZohvNjqU",
        content: `Python is a high-level, interpreted programming language known for its simplicity and readability.

Getting Started:
• Install Python from python.org
• Use interactive shell (REPL)
• Write scripts in .py files
• Run with: python script.py

Basic Syntax:
print("Hello, World!")  # Output text
x = 10  # Variable assignment
name = "Alice"  # String
is_active = True  # Boolean

Data Types:
• int: Integers (1, 2, 3)
• float: Decimals (1.5, 2.7)
• str: Text ("hello")
• bool: True/False
• None: No value

Operations:
• Arithmetic: +, -, *, /, //, %, **
• Comparison: ==, !=, <, >, <=, >=
• Logical: and, or, not

Control Flow:
if x > 5:
    print("x is greater than 5")
elif x == 5:
    print("x equals 5")
else:
    print("x is less than 5")

Loops:
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

while x > 0:
    print(x)
    x -= 1`
      },
      {
        title: "Functions & Modules",
        videoId: "9Os0o3wzS_I",
        content: `Functions are reusable blocks of code that perform specific tasks.

Defining Functions:
def greet(name):
    return f"Hello, {name}!"

result = greet("Alice")
print(result)  # Hello, Alice!

Parameters & Arguments:
def add(a, b):
    return a + b

add(3, 5)  # Positional arguments
add(a=3, b=5)  # Keyword arguments

Default Parameters:
def greet(name="World"):
    return f"Hello, {name}!"

greet()  # Hello, World!
greet("Alice")  # Hello, Alice!

Variable Arguments:
def sum_all(*args):
    return sum(args)

sum_all(1, 2, 3, 4)  # 10

Keyword Arguments:
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=30)

Modules:
import math
print(math.pi)  # 3.14159

from datetime import datetime
now = datetime.now()

Creating Modules:
# mymodule.py
def greet(name):
    return f"Hello, {name}!"

# main.py
from mymodule import greet
print(greet("Alice"))`
      },
      {
        title: "Data Structures",
        videoId: "W8KRzm-HUcc",
        content: `Python provides powerful built-in data structures for organizing data.

Lists:
fruits = ["apple", "banana", "cherry"]
fruits.append("date")
fruits[0]  # "apple"
fruits[-1]  # "date"

Tuples (Immutable):
coordinates = (10, 20)
x, y = coordinates  # Unpacking
coordinates[0]  # 10

Dictionaries:
person = {
    "name": "Alice",
    "age": 30,
    "city": "NYC"
}
person["name"]  # "Alice"
person["age"] = 31

Sets (Unique values):
colors = {"red", "green", "blue"}
colors.add("yellow")
colors.remove("red")

List Comprehension:
squares = [x**2 for x in range(5)]
# [0, 1, 4, 9, 16]

Dictionary Comprehension:
squares_dict = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

Common Methods:
list.append(), list.extend(), list.remove()
dict.keys(), dict.values(), dict.items()
set.add(), set.remove(), set.union()`
      },
      {
        title: "File I/O & Error Handling",
        videoId: "Ql8aKGUBV5c",
        content: `Reading and writing files, handling errors gracefully.

Reading Files:
with open("file.txt", "r") as f:
    content = f.read()  # Read entire file
    
with open("file.txt", "r") as f:
    lines = f.readlines()  # Read as list

Writing Files:
with open("file.txt", "w") as f:
    f.write("Hello, World!")

Appending to Files:
with open("file.txt", "a") as f:
    f.write("\\nNew line")

Error Handling:
try:
    x = 1 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
except Exception as e:
    print(f"Error: {e}")
finally:
    print("Cleanup code")

Custom Exceptions:
class CustomError(Exception):
    pass

raise CustomError("Something went wrong")

File Operations:
import os
os.path.exists("file.txt")
os.remove("file.txt")
os.listdir(".")

JSON:
import json
data = {"name": "Alice", "age": 30}
json_str = json.dumps(data)
parsed = json.loads(json_str)`
      },
      {
        title: "APIs with FastAPI",
        videoId: "7t2alSnE2-I",
        content: `Build high-performance REST APIs with FastAPI.

Installation:
pip install fastapi uvicorn

Basic API:
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

# Run: uvicorn main:app --reload

Path Parameters:
@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}

Query Parameters:
@app.get("/search")
def search(q: str, skip: int = 0, limit: int = 10):
    return {"query": q, "skip": skip, "limit": limit}

Request Body:
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float
    description: str = None

@app.post("/items/")
def create_item(item: Item):
    return item

Response Models:
@app.get("/items/{item_id}", response_model=Item)
def get_item(item_id: int):
    return {"name": "Item", "price": 9.99}

Status Codes:
@app.post("/items/", status_code=201)
def create_item(item: Item):
    return item

Validation:
from pydantic import Field

class Item(BaseModel):
    name: str = Field(..., min_length=1)
    price: float = Field(..., gt=0)`
      },
      {
        title: "Final Project",
        videoId: "kqtZohvNjqU",
        content: `Build a complete Python application combining all concepts.

Project: Task Management API

Requirements:
✓ Create, read, update, delete tasks
✓ Store tasks in JSON file
✓ Validate input data
✓ Handle errors gracefully
✓ Provide REST API endpoints

Implementation:
1. Define Task model with Pydantic
2. Create CRUD functions
3. Build FastAPI endpoints
4. Add error handling
5. Test with curl or Postman

Endpoints:
GET /tasks - List all tasks
POST /tasks - Create new task
GET /tasks/{id} - Get specific task
PUT /tasks/{id} - Update task
DELETE /tasks/{id} - Delete task

Testing:
curl http://localhost:8000/tasks
curl -X POST http://localhost:8000/tasks -H "Content-Type: application/json" -d '{"title":"Learn Python"}'

Deployment:
pip freeze > requirements.txt
Deploy to Heroku, Railway, or Render

Certificate:
You have completed Python for Builders!
Showcase your API project on GitHub.`
      }
    ]
  },
  {
    id: "js-mastery",
    track: "coding",
    category: "JavaScript",
    level: "Beginner",
    icon: "⚡",
    title: "JavaScript & React Mastery",
    description: "Modern JS/TS from fundamentals to full-stack React apps",
    lessons: 6,
    duration: "3h 30m",
    xpReward: 700,
    skyReward: 70,
    students: 52100,
    rating: 4.9,
    color: "oklch(0.80 0.20 70)",
    topics: [
      {
        title: "JavaScript Fundamentals",
        videoId: "jS4aFq5-91M",
        content: `JavaScript is the programming language of the web.

Getting Started:
• Browser console: F12 or Cmd+Option+I
• Node.js: npm install -g node
• Run: node script.js

Variables:
var x = 10;  // Function-scoped
let y = 20;  // Block-scoped (preferred)
const z = 30;  // Immutable

Data Types:
• Number: 42, 3.14
• String: "hello", 'world'
• Boolean: true, false
• Object: {name: "Alice"}
• Array: [1, 2, 3]
• null, undefined

Operators:
// Arithmetic
1 + 2, 5 - 3, 4 * 2, 8 / 2

// Comparison
5 == "5", 5 === 5, 5 !== 3

// Logical
true && false, true || false, !true

Functions:
function add(a, b) {
    return a + b;
}

const multiply = (a, b) => a * b;

Arrow Functions:
const greet = (name) => {
    return \`Hello, \${name}!\`;
};`
      },
      {
        title: "DOM & Events",
        videoId: "0ik6X7EL_60",
        content: `Interact with HTML elements and handle user events.

Selecting Elements:
document.getElementById("myId")
document.querySelector(".myClass")
document.querySelectorAll("p")

Modifying Content:
element.textContent = "New text"
element.innerHTML = "<p>HTML content</p>"
element.setAttribute("class", "active")

Styling:
element.style.color = "red"
element.style.backgroundColor = "blue"
element.classList.add("active")
element.classList.remove("inactive")

Event Listeners:
element.addEventListener("click", function() {
    console.log("Clicked!");
});

Common Events:
• click: Mouse click
• submit: Form submission
• change: Input value change
• keydown: Key pressed
• mouseover: Mouse over element
• load: Page loaded

Event Object:
element.addEventListener("click", (event) => {
    console.log(event.target);  // Element clicked
    event.preventDefault();  // Stop default behavior
});

Creating Elements:
const newDiv = document.createElement("div")
newDiv.textContent = "Hello"
document.body.appendChild(newDiv)`
      },
      {
        title: "React Basics",
        videoId: "SqcY0GlEPh4",
        content: `React is a JavaScript library for building UIs with components.

Installation:
npx create-react-app my-app
cd my-app
npm start

Components:
function Welcome() {
    return <h1>Hello, World!</h1>;
}

JSX:
const element = (
    <div>
        <h1>Title</h1>
        <p>Paragraph</p>
    </div>
);

Props:
function Greeting(props) {
    return <h1>Hello, {props.name}!</h1>;
}

<Greeting name="Alice" />

State:
import { useState } from "react";

function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}

Effects:
import { useEffect } from "react";

useEffect(() => {
    console.log("Component mounted");
    return () => console.log("Component unmounted");
}, []);  // Dependency array`
      },
      {
        title: "Advanced React",
        videoId: "I6qqG1usqKE",
        content: `Advanced React patterns and best practices.

Context API:
import { createContext, useState } from "react";

const ThemeContext = createContext();

function App() {
    const [theme, setTheme] = useState("light");
    
    return (
        <ThemeContext.Provider value={{theme, setTheme}}>
            <Component />
        </ThemeContext.Provider>
    );
}

Custom Hooks:
function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    return width;
}

Performance:
• React.memo: Prevent unnecessary re-renders
• useMemo: Memoize expensive computations
• useCallback: Memoize functions

Routing:
import { BrowserRouter, Routes, Route } from "react-router-dom";

<BrowserRouter>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
    </Routes>
</BrowserRouter>

Form Handling:
const [formData, setFormData] = useState({});

const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });
};`
      },
      {
        title: "Building with Next.js",
        videoId: "Sklc_fQBmcs",
        content: `Next.js is a React framework for production applications.

Getting Started:
npx create-next-app@latest my-app
cd my-app
npm run dev

File-based Routing:
app/page.tsx → /
app/about/page.tsx → /about
app/blog/[id]/page.tsx → /blog/:id

Server Components:
// app/page.tsx
export default function Home() {
    return <h1>Welcome</h1>;
}

API Routes:
// app/api/hello/route.ts
export async function GET() {
    return Response.json({ message: "Hello" });
}

Data Fetching:
async function getData() {
    const res = await fetch("https://api.example.com/data");
    return res.json();
}

export default async function Page() {
    const data = await getData();
    return <div>{data}</div>;
}

Dynamic Routes:
// app/blog/[id]/page.tsx
export default function Post({ params }) {
    return <h1>Post {params.id}</h1>;
}

Deployment:
npm run build
Deploy to Vercel with one click`
      },
      {
        title: "Final Project",
        videoId: "jS4aFq5-91M",
        content: `Build a complete full-stack application.

Project: Task Management App

Features:
✓ Create, read, update, delete tasks
✓ Mark tasks as complete
✓ Filter by status
✓ Persistent storage
✓ Beautiful UI

Tech Stack:
• Frontend: React with Tailwind CSS
• Backend: Next.js API routes
• Database: JSON file or SQLite
• Deployment: Vercel

Implementation:
1. Create task component
2. Build task list
3. Add form for new tasks
4. Implement API routes
5. Add styling
6. Deploy to Vercel

Features to Add:
• Due dates
• Priority levels
• Categories
• Search functionality
• Dark mode
• Mobile responsive

Testing:
• Manual testing
• Unit tests with Jest
• E2E tests with Cypress

Certificate:
You have completed JavaScript & React Mastery!
Share your project on GitHub and deploy on Vercel.`
      }
    ]
  }
];

const LEVEL_COLORS: Record<string, string> = {
  "Beginner": "bg-green-500/20 text-green-300 border-green-500/30",
  "Intermediate": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Advanced": "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function SkySchool() {
  const { isAuthenticated, user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<typeof COURSES[0] | null>(null);
  const [selectedLessonIdx, setSelectedLessonIdx] = useState(0);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());
  const [completedLessons, setCompletedLessons] = useState<Record<string, Set<number>>>({});

  const filtered = COURSES.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleEnroll = (courseId: string) => {
    if (!isAuthenticated) {
      toast.error("Sign in to enroll");
      return;
    }
    setEnrolledCourses(prev => new Set([...prev, courseId]));
    toast.success("Enrolled successfully! 🎉");
  };

  const handleCompleteLesson = () => {
    if (!selectedCourse) return;
    const key = selectedCourse.id;
    const completed = completedLessons[key] || new Set();
    completed.add(selectedLessonIdx);
    setCompletedLessons(prev => ({ ...prev, [key]: completed }));
    toast.success(`Lesson completed! +${Math.round(selectedCourse.xpReward / selectedCourse.lessons)} XP`);
  };

  const handleNextLesson = () => {
    if (!selectedCourse) return;
    if (selectedLessonIdx < selectedCourse.lessons - 1) {
      handleCompleteLesson();
      setSelectedLessonIdx(selectedLessonIdx + 1);
    } else {
      handleCompleteLesson();
      toast.success(`Course completed! 🏆 +${selectedCourse.xpReward} XP, +${selectedCourse.skyReward} SKY`);
    }
  };

  // Lesson View with REAL YouTube Video
  if (selectedCourse) {
    const lesson = selectedCourse.topics[selectedLessonIdx];
    const progress = (selectedLessonIdx + 1) / selectedCourse.lessons * 100;
    const completed = completedLessons[selectedCourse.id] || new Set();

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => setSelectedCourse(null)}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-400">Progress</p>
                <p className="text-lg font-bold text-white">{selectedLessonIdx + 1}/{selectedCourse.lessons}</p>
              </div>
              <div className="w-40 h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* REAL YouTube Video Player */}
          <div className="bg-black rounded-2xl overflow-hidden mb-8 aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${lesson.videoId}?autoplay=0`}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="col-span-2 space-y-6">
              <Card className="bg-slate-900/50 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{lesson.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-invert max-w-none">
                    {lesson.content.split('\n').map((line, idx) => (
                      <p key={idx} className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {line}
                      </p>
                    ))}
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedLessonIdx(Math.max(0, selectedLessonIdx - 1))}
                      disabled={selectedLessonIdx === 0}
                      className="border-slate-600 text-slate-300"
                    >
                      Previous
                    </Button>
                    <Button
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      onClick={handleNextLesson}
                    >
                      {selectedLessonIdx === selectedCourse.lessons - 1 ? "Complete Course" : "Next Lesson"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Course Info */}
              <Card className="bg-slate-900/50 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">{selectedCourse.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {selectedCourse.lessons} lessons
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedCourse.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    +{selectedCourse.skyReward} SKY
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    +{selectedCourse.xpReward} XP
                  </div>
                </CardContent>
              </Card>

              {/* Lessons List */}
              <Card className="bg-slate-900/50 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Lessons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedCourse.topics.map((topic, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedLessonIdx(idx)}
                        className={`w-full text-left p-2 rounded transition-all text-xs ${
                          selectedLessonIdx === idx
                            ? "bg-purple-500/30 text-purple-300 border border-purple-500/50"
                            : "text-slate-400 hover:bg-slate-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {completed.has(idx) ? (
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                          ) : idx === selectedLessonIdx ? (
                            <Play className="w-4 h-4 text-purple-400 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                          )}
                          <span className="truncate">{topic.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Course Catalog View
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-10 h-10 text-cyan-400" />
            <div>
              <h1 className="text-5xl font-bold text-white">Sky School</h1>
              <p className="text-slate-400 text-lg mt-2">Learn Web3, Coding, AI, and Hacking. Earn SKY4, XP, and Certifications.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/50 border border-white/10">
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">Total Courses</p>
              <p className="text-3xl font-bold text-white">{COURSES.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border border-white/10">
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">Total Lessons</p>
              <p className="text-3xl font-bold text-white">{COURSES.reduce((sum, c) => sum + c.lessons, 0)}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border border-white/10">
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">Total Hours</p>
              <p className="text-3xl font-bold text-white">{(COURSES.reduce((sum, c) => sum + parseFloat(c.duration), 0)).toFixed(1)}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border border-white/10">
            <CardContent className="p-4">
              <p className="text-slate-400 text-sm">Enrolled</p>
              <p className="text-3xl font-bold text-white">{enrolledCourses.size}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-8 relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-slate-500" />
          <Input
            placeholder="Search courses by title, description, or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-12 h-12 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-slate-800/50 border-b border-slate-700">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="web3">Web3</TabsTrigger>
            <TabsTrigger value="coding">Coding</TabsTrigger>
          </TabsList>

          {/* All Courses */}
          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(course => (
                <Card
                  key={course.id}
                  className="bg-slate-900/50 border border-white/10 hover:border-cyan-500/50 transition-all overflow-hidden group cursor-pointer"
                >
                  <div className="h-2 w-full bg-gradient-to-r from-cyan-500 to-purple-500" />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl">{course.icon}</span>
                      <Badge className={`text-xs px-2 py-1 ${LEVEL_COLORS[course.level]}`}>
                        {course.level}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2 group-hover:text-cyan-300 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />{course.lessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />{course.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-yellow-400 font-semibold flex items-center gap-1">
                          <Zap className="w-3 h-3" />+{course.skyReward} SKY
                        </span>
                        <span className="text-xs text-purple-400 flex items-center gap-1">
                          <Award className="w-3 h-3" />+{course.xpReward} XP
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {enrolledCourses.has(course.id) ? (
                        <Button
                          className="flex-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-500/30"
                          onClick={() => setSelectedCourse(course)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </Button>
                      ) : (
                        <Button
                          className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/30"
                          onClick={() => handleEnroll(course.id)}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Enroll
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Web3 Courses */}
          <TabsContent value="web3" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.filter(c => c.track === "web3").map(course => (
                <Card key={course.id} className="bg-slate-900/50 border border-white/10 hover:border-cyan-500/50 transition-all overflow-hidden group cursor-pointer">
                  <div className="h-2 w-full bg-gradient-to-r from-cyan-500 to-purple-500" />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl">{course.icon}</span>
                      <Badge className={`text-xs px-2 py-1 ${LEVEL_COLORS[course.level]}`}>
                        {course.level}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">{course.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">{course.description}</p>
                    <div className="flex gap-2">
                      {enrolledCourses.has(course.id) ? (
                        <Button className="flex-1 bg-green-600/20 text-green-300" onClick={() => setSelectedCourse(course)}>
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </Button>
                      ) : (
                        <Button className="flex-1 bg-cyan-500/20 text-cyan-300" onClick={() => handleEnroll(course.id)}>
                          <Play className="w-4 h-4 mr-2" />
                          Enroll
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Coding Courses */}
          <TabsContent value="coding" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.filter(c => c.track === "coding").map(course => (
                <Card key={course.id} className="bg-slate-900/50 border border-white/10 hover:border-cyan-500/50 transition-all overflow-hidden group cursor-pointer">
                  <div className="h-2 w-full bg-gradient-to-r from-cyan-500 to-purple-500" />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl">{course.icon}</span>
                      <Badge className={`text-xs px-2 py-1 ${LEVEL_COLORS[course.level]}`}>
                        {course.level}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">{course.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">{course.description}</p>
                    <div className="flex gap-2">
                      {enrolledCourses.has(course.id) ? (
                        <Button className="flex-1 bg-green-600/20 text-green-300" onClick={() => setSelectedCourse(course)}>
                          <Play className="w-4 h-4 mr-2" />
                          Continue
                        </Button>
                      ) : (
                        <Button className="flex-1 bg-cyan-500/20 text-cyan-300" onClick={() => handleEnroll(course.id)}>
                          <Play className="w-4 h-4 mr-2" />
                          Enroll
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
