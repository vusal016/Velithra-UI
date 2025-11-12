# 🔧 Backend Configuration Fix - JWT Key Error

## ❌ Problem

```
IDX10720: Unable to create KeyedHashAlgorithm for algorithm 'HS256', 
the key size must be greater than: '256' bits, key has '224' bits.
```

## 🎯 Səbəb

Backend-də JWT konfiqurasiyasında istifadə olunan secret key çox qısadır. Microsoft IdentityModel JWT library-si HS256 alqoritmi üçün minimum **256 bit (32 byte)** uzunluğunda key tələb edir.

## ✅ Həll (Backend Tərəfdə)

### 1. `appsettings.json` faylını açın:

```json
{
  "Jwt": {
    "Key": "supersecretkey_velithra_2025",  // ❌ Bu çox qısadır (27 bytes)
    "Issuer": "VelithraAPI",
    "Audience": "VelithraClient",
    "DurationInMinutes": 60
  }
}
```

### 2. Key-i dəyişdirin (minimum 32 karakter):

```json
{
  "Jwt": {
    "Key": "supersecretkey_velithra_2025_extended_to_32bytes_minimum!",  // ✅ Bu kifayətdir (56 bytes)
    "Issuer": "VelithraAPI",
    "Audience": "VelithraClient",
    "DurationInMinutes": 60
  }
}
```

### 3. Və ya daha güclü key generate edin:

**PowerShell-də:**
```powershell
# 64 byte random key generate et
$key = [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
Write-Output $key
```

**C# kod ilə:**
```csharp
using System.Security.Cryptography;

var key = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
Console.WriteLine(key);
```

**Nümunə güclü key:**
```json
{
  "Jwt": {
    "Key": "kL9mN2pQ4rS6tV8xZ0bC3dF5gH7jK9mN2pQ4rS6tV8xZ0bC3dF5gH7jK9mN2pQ4r",
    "Issuer": "VelithraAPI",
    "Audience": "VelithraClient",
    "DurationInMinutes": 60
  }
}
```

### 4. Backend-i yenidən başladın:

```bash
dotnet run --project Velithra.API
```

---

## 📋 Key Uzunluğu Tələbləri

| Alqoritm | Minimum Bit | Minimum Byte | Minimum Karakter |
|----------|-------------|--------------|------------------|
| HS256    | 256         | 32           | 32               |
| HS384    | 384         | 48           | 48               |
| HS512    | 512         | 64           | 64               |

---

## 🔐 Təhlükəsizlik Tövsiyələri

1. **Production-da heç vaxt sadə key istifadə etməyin**
2. **Environment variable-lardan istifadə edin:**
   ```csharp
   "Key": Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
   ```
3. **Key-i version control-a (Git) əlavə etməyin**
4. **Mümkünsə Azure Key Vault və ya AWS Secrets Manager istifadə edin**
5. **Müxtəlif environment-lər üçün fərqli key-lər istifadə edin**

---

## 🎯 Frontend Error Handling

Frontend artıq bu xətanı tanıyır və user-ə aydın mesaj göstərir:

```typescript
// lib/app/login/page.tsx
if (errorMessage.includes("KeyedHashAlgorithm") || errorMessage.includes("IDX10720")) {
  setError("Backend configuration error: JWT key is too short. Please contact administrator.")
}
```

---

## ✅ Test Etmək

Backend düzəldildikdən sonra login səhifəsində test edin:

```
Email: admin@velithra.com
Password: Admin123!
```

Əgər düzgün konfiqurasiya olubsa, uğurla login olmalısınız və `/dashboard`-a yönləndiriləcəksiniz.

---

**Status:** Backend konfiqurasiya problemi - Frontend düzgün işləyir ✅
