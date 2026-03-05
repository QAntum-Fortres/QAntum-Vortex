mod memory;
mod morph;

use morph::PolymorphicEngine;

fn main() -> Result<(), String> {
    println!("🌌 Aeterna Logos: Initializing Phase 1 (Polymorphic Engine)...");

    #[cfg(target_arch = "x86_64")]
    let (initial_code, mutation_plan) = {
        // x86_64: mov rax, 42; ret
        let code: Vec<u8> = vec![
            0x48, 0xB8, 0x2A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // mov rax, 42
            0xC3,                                                       // ret
        ];
        // Mutation: 42 (0x2A) -> 1337 (0x0539)
        // Offset 2: 0x2A -> 0x39
        // Offset 3: 0x00 -> 0x05
        let plan = vec![(2, 0x39), (3, 0x05)];
        (code, plan)
    };

    #[cfg(target_arch = "aarch64")]
    let (initial_code, mutation_plan) = {
        // AArch64: mov x0, 42; ret
        // mov x0, 42 -> 0xD2800540 -> LE: 40 05 80 D2
        let code: Vec<u8> = vec![
            0x40, 0x05, 0x80, 0xD2,
            0xC0, 0x03, 0x5F, 0xD6  // ret
        ];
        // Mutation: 42 -> 1337
        // Byte 0: 0x40 -> 0x20
        // Byte 1: 0x05 -> 0xA7
        let plan = vec![(0, 0x20), (1, 0xA7)];
        (code, plan)
    };

    #[cfg(not(any(target_arch = "x86_64", target_arch = "aarch64")))]
    let (initial_code, mutation_plan): (Vec<u8>, Vec<(usize, u8)>) = {
        panic!("Unsupported architecture.");
    };

    // 2. Load code into the engine
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

    for (offset, new_byte) in mutation_plan {
        organism.mutate_at(offset, new_byte)?;
    }

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
