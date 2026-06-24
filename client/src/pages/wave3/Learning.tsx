// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const LearningPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'enrolled' | 'certificates'>('browse');
  const [searchQuery, setSearchQuery] = useState('');

  // Queries
  const coursesQuery = trpc.wave3Learning.getCourses.useQuery(
    { limit: 20 },
    { enabled: true }
  );

  const enrollmentsQuery = trpc.wave3Learning.getEnrollments.useQuery(
    { limit: 20 },
    { enabled: isAuthenticated }
  );

  const certificatesQuery = trpc.wave3Learning.getCertificates.useQuery(
    { limit: 20 },
    { enabled: isAuthenticated }
  );

  // Mutations
  const enrollMutation = trpc.wave3Learning.enrollCourse.useMutation({
    onSuccess: () => {
      enrollmentsQuery.refetch();
      toast.success('Enrolled successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to enroll');
    },
  });

  const completeMutation = trpc.wave3Learning.completeCourse.useMutation({
    onSuccess: () => {
      certificatesQuery.refetch();
      enrollmentsQuery.refetch();
      toast.success('Course completed! Certificate issued');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to complete course');
    },
  });

  const handleEnroll = async (courseId: string) => {
    await enrollMutation.mutateAsync({ courseId });
  };

  const handleComplete = async (courseId: string) => {
    await completeMutation.mutateAsync({ courseId });
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Learning Hub</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {(['browse', 'enrolled', 'certificates'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coursesQuery.isLoading ? (
              <>
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </>
            ) : (coursesQuery.data?.courses || []).length > 0 ? (
              (coursesQuery.data?.courses || []).map((course: any) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {course.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {course._count.lessons} lessons
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {course._count.enrollments} enrolled
                        </p>
                      </div>
                    </div>
                    {isAuthenticated && (
                      <Button
                        onClick={() => handleEnroll(course.id)}
                        disabled={enrollMutation.isPending}
                        className="w-full"
                      >
                        {enrollMutation.isPending ? 'Enrolling...' : 'Enroll Now'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No courses found</p>
            )}
          </div>
        </div>
      )}

      {/* Enrolled Tab */}
      {activeTab === 'enrolled' && isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {enrollmentsQuery.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (enrollmentsQuery.data?.enrollments || []).length > 0 ? (
              <div className="space-y-2">
                {(enrollmentsQuery.data?.enrollments || []).map((enrollment: any) => (
                  <div key={enrollment.id} className="p-3 rounded-lg border border-border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{enrollment.course.title}</p>
                        <div className="w-full bg-muted rounded-full h-2 mt-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {enrollment.progress}% complete
                        </p>
                      </div>
                      {enrollment.progress === 100 && (
                        <Button
                          onClick={() => handleComplete(enrollment.course.id)}
                          disabled={completeMutation.isPending}
                          size="sm"
                        >
                          {completeMutation.isPending ? 'Issuing...' : 'Get Certificate'}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not enrolled in any courses</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Certificates Tab */}
      {activeTab === 'certificates' && isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>My Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            {certificatesQuery.isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (certificatesQuery.data?.certificates || []).length > 0 ? (
              <div className="space-y-2">
                {(certificatesQuery.data?.certificates || []).map((cert: any) => (
                  <div key={cert.id} className="p-3 rounded-lg border border-border bg-green-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-green-900">{cert.course.title}</p>
                        <p className="text-xs text-green-700">
                          Certificate #{cert.certificateNumber}
                        </p>
                        <p className="text-xs text-green-600">
                          Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No certificates yet</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LearningPage;
