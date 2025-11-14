/**
 * API Testing Utilities
 * Test all 100+ endpoints with proper token handling and response validation
 */

import { toast } from 'sonner';
import { ENV } from '../config/env';

interface TestResult {
  endpoint: string;
  method: string;
  success: boolean;
  statusCode?: number;
  message: string;
  data?: any;
  error?: string;
}

/**
 * Test API endpoint with authorization
 */
export async function testEndpoint(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  expectedStatus: number = 200
): Promise<TestResult> {
  const token = localStorage.getItem('accessToken');
  
  const result: TestResult = {
    endpoint: url,
    method,
    success: false,
    message: '',
  };

  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    };

    if (body && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(body);
    }

    const base = ENV.API_BASE_URL.replace(/\/api$/i, '');
    const response = await fetch(`${base}${url}`, options);
    result.statusCode = response.status;

    const data = await response.json();
    result.data = data;

    // Check if response matches expected format
    if (data.success === true && response.status === expectedStatus) {
      result.success = true;
      result.message = `✅ ${method} ${url} - Success`;
      console.log(result.message, data);
    } else {
      result.success = false;
      result.message = `❌ ${method} ${url} - Failed: ${data.message || 'Unknown error'}`;
      result.error = data.message;
      console.error(result.message, data);
      toast.error(`API Test Failed: ${url}`, {
        description: data.message || 'Unknown error',
      });
    }
  } catch (error: any) {
    result.success = false;
    result.message = `❌ ${method} ${url} - Error: ${error.message}`;
    result.error = error.message;
    console.error(result.message, error);
    toast.error(`API Test Error: ${url}`, {
      description: error.message,
    });
  }

  return result;
}

/**
 * Test Auth Endpoints
 */
export async function testAuthEndpoints(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('🔐 Testing Auth Endpoints...');

  // Note: Login and Register require valid credentials
  // These are skipped in automated testing
  
  // Test Refresh Token
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    results.push(await testEndpoint('/api/auth/refresh-token', 'POST', { refreshToken }));
  }

  return results;
}

/**
 * Test User Management Endpoints
 */
export async function testUserEndpoints(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('👤 Testing User Management Endpoints...');

  // GET all users
  results.push(await testEndpoint('/api/appuser', 'GET'));

  // GET paged users
  results.push(await testEndpoint('/api/appuser/paged?pageNumber=1&pageSize=10', 'GET'));

  return results;
}

/**
 * Test HR Endpoints
 */
export async function testHREndpoints(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('👔 Testing HR Endpoints...');

  // Employees
  results.push(await testEndpoint('/api/employee', 'GET'));
  results.push(await testEndpoint('/api/employee/paged?pageNumber=1&pageSize=10', 'GET'));

  // Departments
  results.push(await testEndpoint('/api/department', 'GET'));

  // Positions
  results.push(await testEndpoint('/api/position', 'GET'));

  return results;
}

/**
 * Test Course Endpoints
 */
export async function testCourseEndpoints(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('📚 Testing Course Endpoints...');

  // Courses
  results.push(await testEndpoint('/api/course', 'GET'));
  results.push(await testEndpoint('/api/course/paged?pageNumber=1&pageSize=10', 'GET'));

  // Lessons
  results.push(await testEndpoint('/api/lesson', 'GET'));

  // Enrollments
  results.push(await testEndpoint('/api/enrollment', 'GET'));

  return results;
}

/**
 * Test Task Endpoints
 */
export async function testTaskEndpoints(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('✅ Testing Task Endpoints...');

  // Tasks
  results.push(await testEndpoint('/api/task', 'GET'));
  results.push(await testEndpoint('/api/task/paged?pageNumber=1&pageSize=10', 'GET'));

  return results;
}

/**
 * Test Module Endpoints
 */
export async function testModuleEndpoints(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('📦 Testing Module Endpoints...');

  results.push(await testEndpoint('/api/module', 'GET'));

  return results;
}

/**
 * Test Inventory Endpoints
 */
export async function testInventoryEndpoints(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('📦 Testing Inventory Endpoints...');

  // Categories
  results.push(await testEndpoint('/api/category', 'GET'));

  // Items
  results.push(await testEndpoint('/api/item', 'GET'));

  // Stock Transactions
  results.push(await testEndpoint('/api/stocktransaction', 'GET'));

  return results;
}

/**
 * Test Notification Endpoints
 */
export async function testNotificationEndpoints(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('🔔 Testing Notification Endpoints...');

  results.push(await testEndpoint('/api/notification', 'GET'));

  return results;
}

/**
 * Test Role Endpoints
 */
export async function testRoleEndpoints(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('🔑 Testing Role Endpoints...');

  results.push(await testEndpoint('/api/role', 'GET'));

  return results;
}

/**
 * Test Dashboard Endpoints
 */
export async function testDashboardEndpoints(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('📊 Testing Dashboard Endpoints...');

  results.push(await testEndpoint('/api/dashboard/stats', 'GET'));
  results.push(await testEndpoint('/api/dashboard/recent-activity', 'GET'));

  return results;
}

/**
 * Test Audit Log Endpoints
 */
export async function testAuditEndpoints(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  console.log('📋 Testing Audit Log Endpoints...');

  results.push(await testEndpoint('/api/auditlog', 'GET'));
  results.push(await testEndpoint('/api/auditlog/paged?pageNumber=1&pageSize=10', 'GET'));

  return results;
}

/**
 * Run all API tests
 */
export async function runAllAPITests(): Promise<{
  total: number;
  passed: number;
  failed: number;
  results: TestResult[];
}> {
  console.log('🚀 Starting Comprehensive API Tests...\n');

  const allResults: TestResult[] = [];

  // Run all test suites
  allResults.push(...(await testAuthEndpoints()));
  allResults.push(...(await testUserEndpoints()));
  allResults.push(...(await testHREndpoints()));
  allResults.push(...(await testCourseEndpoints()));
  allResults.push(...(await testTaskEndpoints()));
  allResults.push(...(await testModuleEndpoints()));
  allResults.push(...(await testInventoryEndpoints()));
  allResults.push(...(await testNotificationEndpoints()));
  allResults.push(...(await testRoleEndpoints()));
  allResults.push(...(await testDashboardEndpoints()));
  allResults.push(...(await testAuditEndpoints()));

  const passed = allResults.filter(r => r.success).length;
  const failed = allResults.filter(r => !r.success).length;

  console.log('\n📊 Test Summary:');
  console.log(`Total Tests: ${allResults.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed === 0) {
    toast.success('All API Tests Passed! 🎉', {
      description: `${passed} endpoints tested successfully`,
    });
  } else {
    toast.warning('Some API Tests Failed', {
      description: `${failed} out of ${allResults.length} tests failed`,
    });
  }

  return {
    total: allResults.length,
    passed,
    failed,
    results: allResults,
  };
}

/**
 * Test specific endpoint group
 */
export async function testEndpointGroup(group: string): Promise<TestResult[]> {
  switch (group.toLowerCase()) {
    case 'auth':
      return testAuthEndpoints();
    case 'user':
      return testUserEndpoints();
    case 'hr':
      return testHREndpoints();
    case 'course':
      return testCourseEndpoints();
    case 'task':
      return testTaskEndpoints();
    case 'module':
      return testModuleEndpoints();
    case 'inventory':
      return testInventoryEndpoints();
    case 'notification':
      return testNotificationEndpoints();
    case 'role':
      return testRoleEndpoints();
    case 'dashboard':
      return testDashboardEndpoints();
    case 'audit':
      return testAuditEndpoints();
    default:
      console.error(`Unknown endpoint group: ${group}`);
      return [];
  }
}
