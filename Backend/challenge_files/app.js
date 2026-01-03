
        function encrypt(data) {
            const key = "super_secret_aes_key_123!"; // TODO: Remove this before prod
            return aes.encrypt(data, key);
        }
        // Encrypted Flag: U2FsdGVkX1+... (Simulation)
        // Real Flag: flag{aes_keys_should_be_secret}
        