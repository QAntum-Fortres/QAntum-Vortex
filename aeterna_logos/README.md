# Aeterna Logos: Self-Evolving Sentient Logic

## Phase 1: Polymorphic Engine

This project represents the first step towards "Aeterna Logos", a system capable of self-modification and evolution.

### Status
- **Architecture:** x86_64 Only
- **OS:** Linux Only (POSIX `mmap`/`mprotect`)
- **Core:** Rust `aeterna_logos` crate

### Features
1.  **Executable Memory Allocation:** Bypasses W^X protections using `mprotect`.
2.  **Runtime Code Modification:** The engine can rewrite its own machine code instructions in memory.
3.  **Polymorphism:** Demonstrates changing logic (e.g., return value) without recompilation.

### Usage
```bash
cargo run
```

### Roadmap (from "BEYOND SILICON")
- [x] Phase 1: Self-Modification Toolkit (Basic JIT/Morph)
- [ ] Phase 2: Intent-Compiler (Neuro-Symbolic Core)
- [ ] Phase 3: Distributed Swarm (Mist Architecture)

### Warning
This code executes raw machine code. It is inherently unsafe and specific to the x86_64 architecture.
