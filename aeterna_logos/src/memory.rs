#[cfg(unix)]
use std::ptr;
#[cfg(unix)]
use std::slice;
#[cfg(unix)]
use libc::{
    mmap, mprotect, munmap,
    PROT_READ, PROT_WRITE, PROT_EXEC,
    MAP_PRIVATE, MAP_ANONYMOUS, MAP_FAILED,
    c_void, size_t,
};

#[cfg(unix)]
extern "C" {
    // GCC/LLVM built-in for instruction cache flushing.
    // Clears the instruction cache for the range [beg, end).
    fn __clear_cache(beg: *mut c_void, end: *mut c_void);
}

#[cfg(windows)]
use winapi::um::memoryapi::{VirtualAlloc, VirtualProtect, VirtualFree};
#[cfg(windows)]
use winapi::um::processthreadsapi::{FlushInstructionCache, GetCurrentProcess};
#[cfg(windows)]
use winapi::um::winnt::{MEM_COMMIT, MEM_RESERVE, PAGE_EXECUTE_READ, PAGE_READWRITE, MEM_RELEASE};
#[cfg(windows)]
use std::ptr;
#[cfg(windows)]
use std::slice;
#[cfg(windows)]
use winapi::ctypes::c_void;

/// A wrapper around a raw memory block that can be toggled between
/// writable and executable states.
pub struct ExecutableMemory {
    ptr: *mut u8,
    size: usize,
}

impl ExecutableMemory {
    /// Allocates a new block of memory with the given size.
    /// Initially, the memory is READ | WRITE.
    pub fn new(size: usize) -> Result<Self, String> {
        #[cfg(unix)]
        unsafe {
            let ptr = mmap(
                ptr::null_mut(),
                size as size_t,
                PROT_READ | PROT_WRITE,
                MAP_PRIVATE | MAP_ANONYMOUS,
                -1,
                0,
            );

            if ptr == MAP_FAILED {
                return Err("Failed to allocate memory via mmap".to_string());
            }

            Ok(Self {
                ptr: ptr as *mut u8,
                size,
            })
        }

        #[cfg(windows)]
        unsafe {
            let ptr = VirtualAlloc(
                ptr::null_mut(),
                size,
                MEM_COMMIT | MEM_RESERVE,
                PAGE_READWRITE,
            );

            if ptr.is_null() {
                return Err("Failed to allocate memory via VirtualAlloc".to_string());
            }

            Ok(Self {
                ptr: ptr as *mut u8,
                size,
            })
        }
    }

    /// Writes data to the memory block.
    /// Panics if the data is larger than the allocated size.
    pub fn write(&mut self, data: &[u8]) {
        if data.len() > self.size {
            panic!("Data too large for allocated memory");
        }
        unsafe {
            ptr::copy_nonoverlapping(data.as_ptr(), self.ptr, data.len());
        }
    }

    /// Returns a mutable slice of the memory.
    /// Note: Ensure memory is writable before calling this.
    pub fn as_slice_mut(&mut self) -> &mut [u8] {
        unsafe {
            slice::from_raw_parts_mut(self.ptr, self.size)
        }
    }

    /// Changes the memory protection to READ | EXECUTE.
    /// Call this before trying to run the code.
    pub fn make_executable(&self) -> Result<(), String> {
        #[cfg(unix)]
        unsafe {
            let res = mprotect(
                self.ptr as *mut c_void,
                self.size as size_t,
                PROT_READ | PROT_EXEC,
            );

            if res != 0 {
                return Err("Failed to set memory to executable".to_string());
            }

            // Flush instruction cache. Essential for ARM/AArch64 coherence.
            let start = self.ptr as *mut c_void;
            let end = start.add(self.size);
            __clear_cache(start, end);

            Ok(())
        }

        #[cfg(windows)]
        unsafe {
            let mut old_protect = 0;
            let res = VirtualProtect(
                self.ptr as *mut _,
                self.size,
                PAGE_EXECUTE_READ,
                &mut old_protect,
            );

            if res == 0 {
                return Err("Failed to set memory to executable".to_string());
            }

            // Flush instruction cache.
            if FlushInstructionCache(GetCurrentProcess(), self.ptr as *const c_void, self.size) == 0 {
                return Err("Failed to flush instruction cache".to_string());
            }

            Ok(())
        }
    }

    /// Changes the memory protection back to READ | WRITE.
    /// Call this before mutating the code.
    pub fn make_writable(&self) -> Result<(), String> {
        #[cfg(unix)]
        unsafe {
            let res = mprotect(
                self.ptr as *mut c_void,
                self.size as size_t,
                PROT_READ | PROT_WRITE,
            );

            if res != 0 {
                return Err("Failed to set memory to writable".to_string());
            }
            Ok(())
        }

        #[cfg(windows)]
        unsafe {
            let mut old_protect = 0;
            let res = VirtualProtect(
                self.ptr as *mut _,
                self.size,
                PAGE_READWRITE,
                &mut old_protect,
            );

            if res == 0 {
                return Err("Failed to set memory to writable".to_string());
            }
            Ok(())
        }
    }

    /// Returns the raw pointer to the memory.
    pub fn as_ptr(&self) -> *const u8 {
        self.ptr as *const u8
    }
}

impl Drop for ExecutableMemory {
    fn drop(&mut self) {
        #[cfg(unix)]
        unsafe {
            munmap(self.ptr as *mut c_void, self.size as size_t);
        }

        #[cfg(windows)]
        unsafe {
            VirtualFree(self.ptr as *mut _, 0, MEM_RELEASE);
        }
    }
}
