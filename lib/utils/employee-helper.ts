/**
 * Employee-User Linking Helper
 * Provides utilities to link AppUser with Employee records
 * and validate enrollment eligibility
 */

import { employeeService } from '@/lib/services/hrService';
import { authService } from '@/lib/services/authService';
import type { EmployeeDto } from '@/lib/types/module.types';
import type { EmployeeUserLink, EnrollmentEligibility } from '@/lib/types/core.types';

/**
 * Find Employee record by userId
 * @param userId - The AppUser ID to search for
 * @returns Employee ID if found, null otherwise
 */
export async function getEmployeeIdByUserId(userId: string): Promise<string | null> {
  try {
    const employees = await employeeService.getAll();
    
    if (!employees) {
      return null;
    }

    // Find employee with matching userId
    const employee = employees.find((emp: any) => emp.userId === userId);
    
    return employee?.id || null;
  } catch (error) {
    console.error('Failed to get employee ID by user ID:', error);
    return null;
  }
}

/**
 * Get Employee record by userId with full details
 * @param userId - The AppUser ID to search for
 * @returns EmployeeDto if found, null otherwise
 */
export async function getEmployeeByUserId(userId: string): Promise<EmployeeDto | null> {
  try {
    const employees = await employeeService.getAll();
    
    if (!employees) {
      return null;
    }

    // Find employee with matching userId
    const employee = employees.find((emp: any) => emp.userId === userId);
    
    return employee || null;
  } catch (error) {
    console.error('Failed to get employee by user ID:', error);
    return null;
  }
}

/**
 * Get current logged-in user's Employee ID
 * @returns Employee ID if user has linked employee record, null otherwise
 */
export async function getCurrentUserEmployeeId(): Promise<string | null> {
  const userId = authService.getUserId();
  
  if (!userId) {
    console.warn('No user ID found - user not authenticated');
    return null;
  }

  return getEmployeeIdByUserId(userId);
}

/**
 * Get current logged-in user's Employee record
 * @returns EmployeeDto if user has linked employee record, null otherwise
 */
export async function getCurrentUserEmployee(): Promise<EmployeeDto | null> {
  const userId = authService.getUserId();
  
  if (!userId) {
    console.warn('No user ID found - user not authenticated');
    return null;
  }

  return getEmployeeByUserId(userId);
}

/**
 * Get Employee-User link information
 * @param userId - The AppUser ID to search for
 * @returns EmployeeUserLink if found, null otherwise
 */
export async function getEmployeeUserLink(userId: string): Promise<EmployeeUserLink | null> {
  try {
    const employee = await getEmployeeByUserId(userId);
    
    if (!employee) {
      return null;
    }

    return {
      employeeId: employee.id,
      userId: userId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
    };
  } catch (error) {
    console.error('Failed to get employee-user link:', error);
    return null;
  }
}

/**
 * Check if user is eligible to enroll in courses
 * @param userId - The AppUser ID to check (optional, uses current user if not provided)
 * @returns EnrollmentEligibility object with eligibility status and employee ID
 */
export async function checkEnrollmentEligibility(userId?: string): Promise<EnrollmentEligibility> {
  const targetUserId = userId || authService.getUserId();

  if (!targetUserId) {
    return {
      isEligible: false,
      reason: 'User not authenticated',
    };
  }

  try {
    const employeeId = await getEmployeeIdByUserId(targetUserId);

    if (!employeeId) {
      return {
        isEligible: false,
        reason: 'No employee record linked to this user account. Please contact your administrator.',
      };
    }

    return {
      isEligible: true,
      employeeId,
    };
  } catch (error) {
    console.error('Failed to check enrollment eligibility:', error);
    return {
      isEligible: false,
      reason: 'Failed to verify enrollment eligibility. Please try again.',
    };
  }
}

/**
 * Check if current user has an employee record
 * @returns true if user has linked employee record, false otherwise
 */
export async function hasEmployeeRecord(): Promise<boolean> {
  const employeeId = await getCurrentUserEmployeeId();
  return employeeId !== null;
}

/**
 * Get all employees with linked user accounts
 * @returns Array of EmployeeUserLink objects
 */
export async function getAllEmployeeUserLinks(): Promise<EmployeeUserLink[]> {
  try {
    const employees = await employeeService.getAll();
    
    if (!employees) {
      return [];
    }

    // Filter employees with userId and map to EmployeeUserLink
    const links = employees
      .filter((emp: any) => emp.userId)
      .map((emp: any) => ({
        employeeId: emp.id,
        userId: emp.userId,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
      }));

    return links;
  } catch (error) {
    console.error('Failed to get employee-user links:', error);
    return [];
  }
}
