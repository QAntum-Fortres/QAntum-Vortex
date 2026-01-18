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
        if cfg!(not(target_arch = "x86_64")) {
            return Err("Aeterna Logos Phase 1 currently supports x86_64 only.".to_string());
        }
        if cfg!(not(target_os = "linux")) {
             return Err("Aeterna Logos Phase 1 currently supports Linux only.".to_string());
        }

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

    #[test]
    fn test_mutation() {
        // mov rax, 42; ret
        let code = [
            0x48, 0xB8, 0x2A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0xC3
        ];
        let mut engine = PolymorphicEngine::new(&code).unwrap();

        let res: u64 = unsafe { engine.execute() };
        assert_eq!(res, 42);

        // Mutate 42 -> 43 (0x2B)
        engine.mutate_at(2, 0x2B).unwrap();

        let res2: u64 = unsafe { engine.execute() };
        assert_eq!(res2, 43);
    }

    #[test]
    fn test_transformation() {
         // mov rax, 10; ret
         let code1 = [
            0x48, 0xB8, 0x0A, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0xC3
        ];
        let mut engine = PolymorphicEngine::new(&code1).unwrap();
        let res: u64 = unsafe { engine.execute() };
        assert_eq!(res, 10);

        // mov rax, 20; ret
        let code2 = [
            0x48, 0xB8, 0x14, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0xC3
        ];
        engine.transform_to(&code2).unwrap();
        let res2: u64 = unsafe { engine.execute() };
        assert_eq!(res2, 20);
    }
}
