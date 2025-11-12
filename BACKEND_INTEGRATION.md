# 🎯 Velithra Frontend - Backend Integration Guide

## 📦 Backend API Integration Status

✅ **COMPLETED** - Frontend fully configured for Velithra backend integration

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Configure Environment

Create `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5233/api
NEXT_PUBLIC_SIGNALR_HUB_URL=http://localhost:5233/hubs
NEXT_PUBLIC_APP_NAME=Velithra
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Start Backend API

Make sure Velithra backend is running on `http://localhost:5233`

```bash
# Backend should be running with:
# - Swagger: http://localhost:5233/swagger
# - API: http://localhost:5233/api
```

### 4. Start Frontend

```bash
npm run dev
# or
pnpm dev
```

Frontend will be available at `http://localhost:3000`

---

## 🔐 Default Login Credentials

```
Email: admin@velithra.com
Password: Admin123!
```

---

## 📁 Project Structure

```
lib/
├── api/
│   ├── client.ts              # Axios client with interceptors
│   └── index.ts
├── config/
│   └── env.ts                 # Environment configuration
├── services/
│   ├── authService.ts         # Authentication service
│   ├── crudService.ts         # Generic CRUD service
│   ├── coreServices.ts        # Core entity services
│   ├── moduleServices.ts      # Module entity services
│   ├── signalrService.ts      # SignalR real-time service
│   └── index.ts
├── types/
│   ├── core.types.ts          # Core entity TypeScript types
│   ├── module.types.ts        # Module entity TypeScript types
│   └── index.ts
└── utils.ts

hooks/
├── use-auth.ts                # Authentication hook
└── use-pagination.ts          # Pagination hook

components/
├── auth/
│   └── protected-route.tsx    # Route protection component
├── providers/
│   └── auth-provider.tsx      # Global auth context provider
└── ...

app/
├── layout.tsx                 # Root layout with providers
├── login/
│   └── page.tsx               # Login page (integrated)
└── ...
```

---

## 🔌 API Integration

### Authentication

```typescript
import { useAuth } from '@/hooks/use-auth';

function MyComponent() {
  const { user, isAuthenticated, login, logout, hasRole } = useAuth();

  const handleLogin = async () => {
    await login({
      email: 'admin@velithra.com',
      password: 'Admin123!',
    });
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.userName}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### CRUD Operations

```typescript
import { appUserService, roleService } from '@/lib/services';

// Get all users
const users = await appUserService.getAll();

// Get user by ID
const user = await appUserService.getById('user-id');

// Get paged users
const pagedUsers = await appUserService.getPaged(1, 10);

// Create user
await appUserService.create({
  userName: 'newuser',
  email: 'user@example.com',
  password: 'Password123!',
  fullName: 'New User',
});

// Update user
await appUserService.update('user-id', {
  id: 'user-id',
  fullName: 'Updated Name',
});

// Delete user
await appUserService.delete('user-id');
```

### Protected Routes

```typescript
import { ProtectedRoute } from '@/components/auth/protected-route';

// Require authentication only
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// Require specific role
<ProtectedRoute requiredRole="Admin">
  <AdminPanel />
</ProtectedRoute>

// Require any of multiple roles
<ProtectedRoute requiredRoles={['Admin', 'Manager']}>
  <ManagementPage />
</ProtectedRoute>
```

### SignalR Real-Time

```typescript
import { signalRService } from '@/lib/services';

// Connect to Dashboard Hub
await signalRService.connectToDashboard((data) => {
  console.log('Dashboard update:', data);
  // { users: 10, roles: 3, logs: 50, unread: 5 }
});

// Connect to Chat Hub
await signalRService.connectToChat('room-id', {
  onMessage: (roomId, userId, message, timestamp) => {
    console.log('New message:', message);
  },
  onUserJoined: (roomId, userId) => {
    console.log('User joined:', userId);
  },
  onUserLeft: (roomId, userId) => {
    console.log('User left:', userId);
  },
});

// Send message
await signalRService.sendMessage('room-id', 'Hello, World!');

// Disconnect
await signalRService.disconnectAll();
```

---

## 📊 Available Services

### Core Services

- `authService` - Authentication & token management
- `appLogService` - Application logs
- `appUserService` - User management
- `roleService` - Role management
- `systemSettingService` - System settings
- `notificationService` - Notifications
- `auditLogService` - Audit logs
- `userPreferenceService` - User preferences
- `dashboardService` - Dashboard statistics

### Module Services

#### Chat Manager
- `chatRoomService` - Chat rooms
- `chatServiceExtended` - Extended chat operations

#### Inventory Manager
- `itemService` - Inventory items
- `categoryService` - Item categories
- `stockTransactionService` - Stock transactions

#### HR Manager
- `employeeService` - Employee management
- `departmentService` - Departments
- `positionService` - Job positions

#### Course Manager
- `courseService` - Courses
- `lessonService` - Lessons
- `enrollmentService` - Course enrollments

#### Task Manager
- `taskService` - Task management

#### Module Manager
- `moduleService` - Module configuration

---

## 🎨 Usage Examples

### Pagination Hook

```typescript
import { usePagination } from '@/hooks/use-pagination';
import { appUserService } from '@/lib/services';

function UserList() {
  const { pageNumber, pageSize, nextPage, prevPage, changePageSize } = usePagination(10);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await appUserService.getPaged(pageNumber, pageSize);
      setUsers(data.items);
    };
    fetchUsers();
  }, [pageNumber, pageSize]);

  return (
    <div>
      {users.map(user => <div key={user.id}>{user.userName}</div>)}
      <button onClick={prevPage}>Previous</button>
      <button onClick={nextPage}>Next</button>
    </div>
  );
}
```

### Role-Based UI

```typescript
import { useAuth } from '@/hooks/use-auth';

function AdminPanel() {
  const { hasRole, hasAnyRole } = useAuth();

  return (
    <div>
      {hasRole('Admin') && <button>Delete All</button>}
      {hasAnyRole(['Admin', 'Manager']) && <button>Manage Users</button>}
    </div>
  );
}
```

---

## 🔒 Security Features

✅ **JWT Token Management** - Automatic token injection in requests  
✅ **Token Expiration Handling** - Auto redirect on 401  
✅ **Role-Based Access Control** - Route and component level  
✅ **Protected Routes** - Higher-order component for route protection  
✅ **CORS Configured** - Backend allows frontend origin  
✅ **Error Handling** - Global error interceptor  
✅ **Type Safety** - Full TypeScript support  

---

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL | `http://localhost:5233/api` |
| `NEXT_PUBLIC_SIGNALR_HUB_URL` | SignalR hub URL | `http://localhost:5233/hubs` |
| `NEXT_PUBLIC_APP_NAME` | Application name | `Velithra` |
| `NEXT_PUBLIC_APP_VERSION` | Application version | `1.0.0` |

---

## 🐛 Troubleshooting

### JWT Key Error (IDX10720)

**Error:** `Unable to create KeyedHashAlgorithm for algorithm 'HS256', key size must be greater than 256 bits`

**Solution:** Backend JWT key is too short. Update `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "supersecretkey_velithra_2025_extended_to_32bytes_minimum!",
    "Issuer": "VelithraAPI",
    "Audience": "VelithraClient",
    "DurationInMinutes": 60
  }
}
```

**Note:** Key must be at least 32 characters (256 bits) for HS256 algorithm.

See `BACKEND_JWT_FIX.md` for detailed instructions.

### CORS Errors

Make sure backend CORS policy allows your frontend origin:

```csharp
// Backend: Program.cs
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```

### 401 Unauthorized

Check if:
1. Backend is running
2. Token is not expired
3. User has correct permissions
4. JWT key is properly configured (see above)

### SignalR Connection Failed

Verify:
1. SignalR hub URL is correct
2. JWT token is valid
3. Backend SignalR is configured

### Backend Connection Failed

Check if:
1. Backend is running on `http://localhost:5233`
2. Environment variables are set correctly
3. No firewall blocking the connection

---

## 📚 Additional Resources

- [Backend API Documentation](http://localhost:5233/swagger)
- [Velithra Backend Architecture Document](#)
- [Next.js Documentation](https://nextjs.org/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [SignalR Documentation](https://docs.microsoft.com/en-us/aspnet/core/signalr)

---

## ✅ Integration Checklist

- [x] API client configured (Axios)
- [x] TypeScript types defined
- [x] Auth service implemented
- [x] CRUD service implemented
- [x] Module services created
- [x] SignalR integration completed
- [x] Protected routes configured
- [x] Auth context provider
- [x] Environment variables setup
- [x] Login page integrated
- [x] Error handling configured
- [x] Toast notifications setup

---

## 🎯 Next Steps

1. **Test Backend Connection**
   ```bash
   # Start backend on port 5233
   # Start frontend on port 3000
   # Login with: admin@velithra.com / Admin123!
   ```

2. **Update Other Pages**
   - Integrate dashboard with real data
   - Connect module pages to backend services
   - Add SignalR to chat page
   - Implement data tables with pagination

3. **Deploy**
   - Update `.env.production` with production API URL
   - Build: `npm run build`
   - Deploy to Vercel/AWS/Azure

---

**Status: ✅ READY FOR BACKEND INTEGRATION**

All services, hooks, and components are configured. Frontend can now communicate with Velithra backend API.
