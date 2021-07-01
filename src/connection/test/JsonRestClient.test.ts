/*
 * Copyright (c) 2021 Bentley Systems, Incorporated. All rights reserved.
 */

import { JsonRestClient } from "../JsonRestClient";
import { AccessToken } from "@bentley/itwin-client";

describe('REST Client Tests', () => {
    let baseUrl = 'https://dev-connect-ml-service-eus.bentley.com';
    const token = new AccessToken('eyJhbGciOiJSUzI1NiIsImtpZCI6IkJlbnRsZXlRQSIsInBpLmF0bSI6ImE4bWUifQ.eyJzY29wZSI6WyJhaW1sOnJ1bi1hZG1pbiIsImFpbWw6ZGF0YS1hZG1pbiIsImFpbWw6cmVhZCJdLCJjbGllbnRfaWQiOiJtYWNoaW5lLWxlYXJuaW5nLXNlcnZpY2Utc3dhZ2dlci1jbGllbnQiLCJhdWQiOlsiaHR0cHM6Ly9xYS1pbXMuYmVudGxleS5jb20vYXMvdG9rZW4ub2F1dGgyIiwiaHR0cHM6Ly9xYS1pbXNvaWRjLmJlbnRsZXkuY29tL2FzL3Rva2VuLm9hdXRoMiIsImh0dHBzOi8vcWEyLWltcy5iZW50bGV5LmNvbS9hcy90b2tlbi5vYXV0aDIiLCJodHRwczovL3FhMi1pbXNvaWRjLmJlbnRsZXkuY29tL2FzL3Rva2VuLm9hdXRoMiIsImh0dHBzOi8vcWEtaW1zb2lkYy5iZW50bGV5LmNvbS9yZXNvdXJjZXMiLCJodHRwczovL3FhMi1pbXMuYmVudGxleS5jb20vcmVzb3VyY2VzIiwibWFjaGluZS1sZWFybmluZy1zZXJ2aWNlIl0sInN1YiI6IjgxYzMxNTYyLTJmNzEtNGUwYy04ZGYzLWI1NmRmMjk5YWViMSIsInJvbGUiOiJCRU5UTEVZX0VNUExPWUVFIiwib3JnIjoiNzJhZGFkMzAtYzA3Yy00NjVkLWExZmUtMmYyZGZhYzk1MGE0Iiwic3ViamVjdCI6IjgxYzMxNTYyLTJmNzEtNGUwYy04ZGYzLWI1NmRmMjk5YWViMSIsImlzcyI6Imh0dHBzOi8vcWEtaW1zb2lkYy5iZW50bGV5LmNvbSIsImVudGl0bGVtZW50IjoiU0VMRUNUXzIwMDYiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJKdXN0aW4uRGVob3J0eUBiZW50bGV5LmNvbSIsImdpdmVuX25hbWUiOiJKdXN0aW4iLCJzaWQiOiJUSFNvMXk2X3AwR0hEZnFlWC13OE5qQ3pnM0EuVVVGSlRWTXRRbVZ1ZEd4bGVTMVZVdy4yMERnLldNNURpdGFsQkV6N1JVbTBEalp1Yjk1dmUiLCJuYmYiOjE2MjUwMzQxMTAsInVsdGltYXRlX3NpdGUiOiIxMDAxMzg5MTE3IiwidXNhZ2VfY291bnRyeV9pc28iOiJVUyIsImF1dGhfdGltZSI6MTYyNTAzNDQxMCwibmFtZSI6Ikp1c3Rpbi5EZWhvcnR5QGJlbnRsZXkuY29tIiwib3JnX25hbWUiOiJCZW50bGV5IFN5c3RlbXMgSW5jIiwiZmFtaWx5X25hbWUiOiJEZWhvcnR5IiwiZW1haWwiOiJKdXN0aW4uRGVob3J0eUBiZW50bGV5LmNvbSIsImV4cCI6MTYyNTAzODAxMH0.EvZXvekNGXmzlKkydO9a4gIy-s0NkveFbjjuSSwPhFAcwi-vgzamU-k1LNkXkQhIR_7DXB29B3ThIiIuVa6pxWOYlVFQNwk_dIyF5vLmXtTlUoHFmoonA4us1yqdDOx7gAKuRmRtHXRYbzgdAekA1b1l_mHa_c08uEWYnWAEMLOiNteL29D_8YSqtNtOBGAjCS9LfgXn_ZiHZlGrtwUYBxUWX9EwUcAMoVTTK0FnH8L3u-gLfgnyMUpkKwuqB55xJTOtPitN1Adf0CloJ8Ggk2pO0Ss0V_ewaT_0f4kV05gPGY8XfJNIT9Ga97vY_PxG_q18Us7JYRC-KxOsN90Lgg')

    it('should get a DataTypes response of correct length', async () => {
        let restClient = new JsonRestClient(baseUrl, token);
        const response = await restClient.get('/api/v1/DataTypes');
        expect(response.length).toBe(16);
    });
});