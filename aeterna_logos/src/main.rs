mod memory;
mod morph;

use morph::PolymorphicEngine;

fn main() -> Result<(), String> {
    println!("🌌 Aeterna Logos: Initializing Phase 1 (Polymorphic Engine)...");

    // 1. Define initial machine code (x86_64)
    // Function: fn() -> u64 { return 42; }
    // Assembly:
    //   mov rax, 42  (0x48, 0xB8, 0x2A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00)
    //   ret          (0xC3)
    let initial_code: [u8; 11] = [
        0x48, 0xB8, 0x2A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // mov rax, 42
        0xC3,                                                       // ret
    ];

    // 2. Load code into the engine (Allocates RW memory, writes code, protects as RX)
    let mut organism = PolymorphicEngine::new(&initial_code)?;
    println!("[+] Organism born.");

    // 3. Execute Generation 1
    let result_gen1: u64 = unsafe { organism.execute() };
    println!("    Generation 1 output: {}", result_gen1);

    if result_gen1 != 42 {
        return Err(format!("Gen 1 failed. Expected 42, got {}", result_gen1));
    }

    // 4. Mutate (Self-Evolution)
    println!("[*] Triggering mutation event...");

    // We want to change '42' (0x2A) to '1337' (0x539).
    // The immediate value starts at index 2.
    // 1337 in hex is 0x0539. Little endian: 39 05.

    // Mutate byte at offset 2 to 0x39
    organism.mutate_at(2, 0x39)?;
    // Mutate byte at offset 3 to 0x05
    organism.mutate_at(3, 0x05)?;

    // 5. Execute Generation 2
    let result_gen2: u64 = unsafe { organism.execute() };
    println!("    Generation 2 output: {}", result_gen2);

    if result_gen2 != 1337 {
        return Err(format!("Gen 2 failed. Expected 1337, got {}", result_gen2));
    }

    println!("[+] Evolution successful. Logic has re-written itself.");
    println!("Aeterna Logos is online.");

    Ok(())
}
