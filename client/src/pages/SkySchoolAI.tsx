import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';

export default function SkySchoolAI() {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isLoading] = useState(false);

  const courses = [
    {
      id: 'blockchain-101',
      title: 'Blockchain Fundamentals',
      instructor: 'HOPE AI',
      level: 'Beginner',
      duration: '4 weeks',
      students: 1250,
      rating: 4.8,
      skills: ['Crypto', 'Web3', 'Smart Contracts'],
      price: 'Free',
    },
    {
      id: 'ai-agents',
      title: 'Building AI Agents',
      instructor: 'HOPE AI',
      level: 'Intermediate',
      duration: '6 weeks',
      students: 840,
      rating: 4.9,
      skills: ['AI', 'Automation', 'LLMs'],
      price: '$49',
    },
    {
      id: 'economy-design',
      title: 'Token Economy Design',
      instructor: 'HOPE AI',
      level: 'Advanced',
      duration: '8 weeks',
      students: 320,
      rating: 4.7,
      skills: ['Economics', 'Tokenomics', 'Game Theory'],
      price: '$99',
    },
  ];

  const skillTrees = [
    { name: 'Blockchain Developer', progress: 65, skills: 8 },
    { name: 'AI Engineer', progress: 42, skills: 5 },
    { name: 'Ecosystem Designer', progress: 28, skills: 3 },
  ];

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">SKYSCHOOL AI</h1>
          <p className="text-gray-400">Learn from the world's best AI teacher — personalized education at scale</p>
        </div>

        {/* Featured Courses */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">FEATURED COURSES</h2>
          <div className="grid grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="bg-gray-900 border-gray-800 p-6 cursor-pointer hover:border-cyan-500 transition"
                onClick={() => setSelectedCourse(course.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-purple-600">{course.level}</Badge>
                  <span className="text-yellow-400">★ {course.rating}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{course.instructor}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Duration</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Students</span>
                    <span>{course.students.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {course.skills.map((skill) => (
                    <Badge key={skill} className="bg-gray-700 text-xs">{skill}</Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{course.price}</span>
                  <Button className="bg-cyan-600 hover:bg-cyan-700">Enroll</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Skill Trees */}
        <div>
          <h2 className="text-2xl font-bold mb-6">YOUR SKILL TREES</h2>
          <div className="space-y-4">
            {skillTrees.map((tree) => (
              <Card key={tree.name} className="bg-gray-900 border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">{tree.name}</h3>
                  <span className="text-sm text-gray-400">{tree.skills} skills unlocked</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full"
                    style={{ width: `${tree.progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2">{tree.progress}% complete</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
