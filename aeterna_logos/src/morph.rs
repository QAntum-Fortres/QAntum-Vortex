use crate::memory::ExecutableMemory;
use std::mem;

/// A simple polymorphic engine that wraps executable memory.
pub struct PolymorphicEngine {
    memory: ExecutableMemory,
    code_len: usize,
}

impl PolymorphicEngine {
    /// Creates a new engine instance with the provided initial machine code.
    pub fn new(code: &[u8]) -> Result<Self, String> {
        // Architecture and OS checks removed to support "Adaptation" phase.
        // We now rely on platform-specific memory implementations and caller's discretion.

        // Allocate a page-aligned size (4096 is standard page size, usually sufficient for small tests)
        let page_size = 4096;
        let mut memory = ExecutableMemory::new(page_size)?;

        // Write the initial code
        memory.write(code);

        // Make it executable immediately
        memory.make_executable()?;

        Ok(Self {
            memory,
            code_len: code.len(),
        })
    }

    /// Executes the memory as a function returning a generic type T.
    ///
    /// # Safety
    /// The caller must ensure that the machine code in memory actually corresponds
    /// to a function with the signature `fn() -> T` using the appropriate ABI.
    pub unsafe fn execute<T>(&self) -> T {
        let func_ptr = self.memory.as_ptr();
        let func: extern "C" fn() -> T = mem::transmute(func_ptr);
        func()
    }

    /// Mutates the code at a specific offset.
    /// This demonstrates "Morphogenetic" properties: the code changes itself.
    pub fn mutate_at(&mut self, offset: usize, new_byte: u8) -> Result<(), String> {
        if offset >= self.code_len {
            return Err("Offset out of bounds".to_string());
        }

        // 1. Switch to Writable
        self.memory.make_writable()?;

        // 2. Perform Mutation
        let slice = self.memory.as_slice_mut();
        slice[offset] = new_byte;

        // 3. Switch back to Executable
        self.memory.make_executable()?;

        Ok(())
    }

    /// Replaces the entire code block.
    pub fn transform_to(&mut self, new_code: &[u8]) -> Result<(), String> {
        if new_code.len() > 4096 { // simplified check
             return Err("New code too large".to_string());
        }

        self.memory.make_writable()?;
        self.memory.write(new_code);
        self.code_len = new_code.len();
        self.memory.make_executable()?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[cfg(target_arch = "x86_64")]
    fn get_code_42() -> Vec<u8> {
        // mov rax, 42; ret
        vec![
            0x48, 0xB8, 0x2A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0xC3
        ]
    }

    #[cfg(target_arch = "aarch64")]
    fn get_code_42() -> Vec<u8> {
        // mov x0, 42; ret
        // mov x0, 42 -> 0xD2800540 -> LE: 40 05 80 D2
        // ret        -> 0xD65F03C0 -> LE: C0 03 5F D6
        vec![
            0x40, 0x05, 0x80, 0xD2,
            0xC0, 0x03, 0x5F, 0xD6
        ]
    }

    #[cfg(not(any(target_arch = "x86_64", target_arch = "aarch64")))]
    fn get_code_42() -> Vec<u8> {
        panic!("Unsupported architecture for tests");
    }

    #[cfg(target_arch = "x86_64")]
    fn get_code_10() -> Vec<u8> {
         // mov rax, 10; ret
        vec![
            0x48, 0xB8, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0xC3
        ]
    }

    #[cfg(target_arch = "aarch64")]
    fn get_code_10() -> Vec<u8> {
        // mov x0, 10 -> 0xD2800140 -> LE: 40 01 80 D2
        vec![
            0x40, 0x01, 0x80, 0xD2,
            0xC0, 0x03, 0x5F, 0xD6
        ]
    }

    #[cfg(target_arch = "x86_64")]
    fn get_code_20() -> Vec<u8> {
        // mov rax, 20; ret
        vec![
            0x48, 0xB8, 0x14, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0xC3
        ]
    }

    #[cfg(target_arch = "aarch64")]
    fn get_code_20() -> Vec<u8> {
        // mov x0, 20 -> 0xD2800280 -> LE: 80 02 80 D2
        vec![
            0x80, 0x02, 0x80, 0xD2,
            0xC0, 0x03, 0x5F, 0xD6
        ]
    }

    #[test]
    fn test_mutation() {
        let code = get_code_42();
        let mut engine = PolymorphicEngine::new(&code).unwrap();

        let res: u64 = unsafe { engine.execute() };
        assert_eq!(res, 42);

        #[cfg(target_arch = "x86_64")]
        {
            // Mutate 42 -> 43 (0x2B) at offset 2
            engine.mutate_at(2, 0x2B).unwrap();
        }

        #[cfg(target_arch = "aarch64")]
        {
            // Mutate 42 -> 43
            // 42: 0x40 (bits 5-7 = 010)
            // 43: 0x60 (bits 5-7 = 011)
            engine.mutate_at(0, 0x60).unwrap();
        }

        let res2: u64 = unsafe { engine.execute() };
        assert_eq!(res2, 43);
    }

    #[test]
    fn test_transformation() {
        let code1 = get_code_10();
        let mut engine = PolymorphicEngine::new(&code1).unwrap();
        let res: u64 = unsafe { engine.execute() };
        assert_eq!(res, 10);

        let code2 = get_code_20();
        engine.transform_to(&code2).unwrap();
        let res2: u64 = unsafe { engine.execute() };
        assert_eq!(res2, 20);
    }
}
