"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Loader2,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/lib/services/authService";
import { courseService, type CourseDto } from "@/lib/services/courseService";
import { enrollmentService, type EnrollmentDto } from "@/lib/services/enrollmentService";
import { checkEnrollmentEligibility } from "@/lib/utils/employee-helper";
import { toast } from "sonner";
import type { EnrollmentEligibility } from "@/lib/types/core.types";

export default function UserCoursesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [enrollments, setEnrollments] = useState<EnrollmentDto[]>([]);
  const [eligibility, setEligibility] = useState<EnrollmentEligibility | null>(null);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Check enrollment eligibility (requires Employee record)
      const eligibilityResult = await checkEnrollmentEligibility();
      setEligibility(eligibilityResult);

      // Load all courses
      const courses = await courseService.getAll();
      if (courses) {
        setCourses(courses);
      }

      // Load user's enrollments if eligible
      if (eligibilityResult.isEligible && eligibilityResult.employeeId) {
        const enrollments = await enrollmentService.getByEmployee(
          eligibilityResult.employeeId
        );
        if (enrollments) {
          setEnrollments(enrollments);
        }
      }
    } catch (error: any) {
      console.error("Failed to load courses:", error);
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!eligibility?.isEligible || !eligibility.employeeId) {
      toast.error("You need an employee record to enroll in courses");
      return;
    }

    try {
      setEnrolling(courseId);

      await enrollmentService.enroll(eligibility.employeeId, courseId);

      toast.success("Successfully enrolled in course!");
      await loadData(); // Reload to update enrollment status
    } catch (error: any) {
      console.error("Failed to enroll:", error);
      toast.error(error.message || "Failed to enroll in course");
    } finally {
      setEnrolling(null);
    }
  };

  const isEnrolled = (courseId: string): boolean => {
    return enrollments.some((e) => e.courseId === courseId);
  };

  const getEnrollment = (courseId: string): EnrollmentDto | undefined => {
    return enrollments.find((e) => e.courseId === courseId);
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00d9ff] mx-auto mb-4" />
          <p className="text-white">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Courses</h1>
          <p className="text-gray-400">
            Browse and enroll in available training courses
          </p>
        </motion.div>

        {/* Eligibility Warning */}
        {!eligibility?.isEligible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Alert className="bg-yellow-500/10 border-yellow-500/50">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <AlertDescription className="text-yellow-200 ml-2">
                <strong>Enrollment Restricted:</strong> {eligibility?.reason}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* My Enrollments Section */}
        {eligibility?.isEligible && enrollments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                My Enrolled Courses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enrollments.map((enrollment) => {
                  const course = courses.find((c) => c.id === enrollment.courseId);
                  if (!course) return null;

                  return (
                    <div
                      key={enrollment.id}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <h3 className="text-white font-semibold mb-2">
                        {course.title}
                      </h3>
                      <Badge
                        className={
                          enrollment.isCompleted
                            ? "bg-green-500/20 text-green-400 border-green-500/50"
                            : "bg-blue-500/20 text-blue-400 border-blue-500/50"
                        }
                      >
                        {enrollment.isCompleted ? "Completed" : "In Progress"}
                      </Badge>
                      <div className="mt-3 space-y-2">
                        <div className="text-sm text-gray-400">
                          <span>Enrolled: </span>
                          <span className="text-gray-300">
                            {new Date(enrollment.enrolledAt).toLocaleDateString()}
                          </span>
                        </div>
                        {enrollment.completedAt && (
                          <div className="text-sm text-gray-400">
                            <span>Completed: </span>
                            <span className="text-green-400">
                              {new Date(enrollment.completedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        <div className="text-sm text-gray-400">
                          <span>Duration: </span>
                          <span className="text-gray-300">
                            {course.durationInHours} hours
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Available Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            Available Courses
          </h2>

          {courses.length === 0 ? (
            <GlassCard className="p-12">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No courses available</p>
                <p className="text-sm text-gray-500 mt-2">
                  Check back later for new courses
                </p>
              </div>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => {
                const enrolled = isEnrolled(course.id);
                const enrollment = getEnrollment(course.id);

                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <GlassCard className="p-6 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-primary/20 rounded-lg">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        {enrolled && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/50 border">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Enrolled
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-3">
                        {course.title}
                      </h3>

                      <p className="text-gray-300 text-sm mb-4 flex-1">
                        {course.description}
                      </p>

                      <div className="space-y-1 mb-4">
                        <div className="text-xs text-gray-400">
                          <span>Duration: </span>
                          <span className="text-primary">{course.durationInHours} hours</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Created: {new Date(course.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {enrolled ? (
                        <Button
                          disabled
                          className="w-full bg-green-600 hover:bg-green-600"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Enrolled
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleEnroll(course.id)}
                          disabled={
                            !eligibility?.isEligible || enrolling === course.id
                          }
                          className="w-full bg-primary hover:bg-primary-dark"
                        >
                          {enrolling === course.id ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Enrolling...
                            </>
                          ) : (
                            "Enroll Now"
                          )}
                        </Button>
                      )}
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
